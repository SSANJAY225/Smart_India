const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

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

const Stop = mongoose.model('stops', stopSchema);
const BusData = mongoose.model('BusData', busDataSchema);


// Haversine formula to calculate the distance between two points on the Earth's surface
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
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
                        continue; // Skip iteration if distance calculation failed
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
