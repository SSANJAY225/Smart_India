const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const crypto = require('crypto');
const qrcode = require('qrcode-terminal');
const QRCode = require('qrcode');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Database connection
mongoose.connect("mongodb+srv://Dheena:dheena123@cluster0.ser6ewc.mongodb.net/Smarttransit?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to database");
}).catch((err) => {
    console.error(err);
});

const connection = mongoose.connection;
connection.once('open', () => console.log("MongoDB Connected..."));

// Schema definitions
const stopSchema = new mongoose.Schema({
    Route: [Array],
    StopName: String,
    latitude: Number,
    longitude: Number,
    NoOfpassenger: Number
}, { collection: 'stops' });

const busDataSchema = new mongoose.Schema({
    busid: Number,
    routeno: Number,
    location: {
        latitude: Number,
        longitude: Number
    },
    dutystatus: Boolean,
    staticseatcount: Number,
    currentseatcountfilled: Number,
}, { collection: 'busdata' });
const ticketSchema = new mongoose.Schema({
    source: String,
    destination: String,
    email: String,
    routeno: Number
});

const Ticket = mongoose.model('Ticket', ticketSchema);
const Stop = mongoose.model('stops', stopSchema);
const BusData = mongoose.model('BusData', busDataSchema);

function swap(str) {
    let arr = str.split('');
        for (let i = 0; i < arr.length - 1; i += 2) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
    }    
    return arr.join('');
}
// Adding ticket
app.post("/counter", async (req, res) => {
    try {
        const { source, destination, email, routeno } = req.body;
        const ticket = new Ticket({ source, destination, email, routeno });
        const savedTicket = await ticket.save();
        // res.send({ id: savedTicket._id });
        console.log()
        const hashedDetails = crypto.createHash('sha256').update(swap(savedTicket._id.toString())).digest('hex');
        QRCode.toDataURL(hashedDetails, { errorCorrectionLevel: 'H' }, (err, url) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error generating QR code");
            }
            res.json({qrCode: url });
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).send("Error creating ticket");
    }
});

// verify the passenger before travel
app.post("/verify", async (req, res) => {
    try {
        const { hashedId } = req.body;
        const tickets = await Ticket.find();
        const matchedTicket = tickets.find(ticket => {
            const ticketHash = crypto.createHash('sha256').update(swap(ticket._id.toString())).digest('hex');
            return ticketHash === hashedId;
        });
        if (!matchedTicket) {
            return res.json("Not Ticket");
        }
        const count = await Ticket.findById(matchedTicket)
        // console.log(count.__v);
        if (count.__v == 0) {
            await Ticket.findByIdAndUpdate(matchedTicket, { $set: { __v: 1 } }, { new: true })
            return res.json("Passenger Boarded")
        }
        else if (count.__v == 1) {
            await Ticket.findByIdAndUpdate(matchedTicket, { $set: { __v: 2 } }, { new: true });
            return res.json("Travel completed")
        } else {
            return res.json("Ticket already used")
        }
    } catch (error) {
        console.error("Error during verification:", error);
        res.status(500).send("Verification failed");
    }
});

// Haversine formula to calculate the distance between two points on the Earth's surface
function calculateDistance(lat1, lon1, lat2, lon2) {
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = 6371 * c;
    return distance;
}

// Route to find the minimum distance between any bus and stop with the same route
app.get('/min-distance', async (req, res) => {
    try {
        const min = [];
        const stops = await Stop.find();
        const buses = await BusData.find();

        if (stops.length === 0 || buses.length === 0) {
            return res.status(404).json({ message: "No stops or bus data available" });
        }

        var minDistance = Infinity;
        let closestPair = null;
        for (const bus of buses) {
            closestPair = null
            minDistance = Infinity
            for (const stop of stops) {
                if (!stop.latitude || !stop.longitude) {
                    console.error("Invalid stop data: ", stop);
                    continue;
                }

                if (!bus || !bus.location || !bus.location.latitude || !bus.location.longitude) {
                    console.error("Invalid bus location data: ", bus);
                    break;
                }
                if (stop.Route.includes(bus.routeno) && !bus.status && bus.currentseatcountfilled + stop.NoOfpassenger <= bus.staticseatcount) {
                    const distance = calculateDistance(
                        bus.location.latitude,
                        bus.location.longitude,
                        stop.latitude,
                        stop.longitude
                    );

                    if (isNaN(distance)) {
                        console.error("Distance calculation failed:", distance);
                        continue;
                    }
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestPair = {
                            bus: {
                                busid: bus.busid,
                                routeno: bus.routeno,
                                location: bus.location
                            },
                            stop: {
                                StopName: stop.StopName,
                                location: {
                                    latitude: stop.latitude,
                                    longitude: stop.longitude
                                }
                            },
                            distance: minDistance
                        };

                    }
                }
            }
            if (closestPair)
                min.push(closestPair)
        }
        if (!min)
            return res.status(404).json({ message: "No matching bus and stop pairs found" });
        else
            res.json(min);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
