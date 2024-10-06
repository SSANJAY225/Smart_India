import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


const Counters = () => {
    
    const navigate= useNavigate()
    const tk = { stops: ["Thiruvanmayur", "Adayaru", "Guindy", "Ashok Pillar", "Vadapalani", "Koyambedu"], routeno: 1, mapurl: "https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d62193.39638274079!2d80.18423637227335!3d13.030114096228163!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x3a525d5b9b3bfc6f%3A0x6959f97669f90baa!2sThiruvanmiyur%2C%20Chennai%2C%20Tamil%20Nadu!3m2!1d12.983026899999999!2d80.2594001!4m5!1s0x3a5266b2082873a1%3A0x7f2b6f60e42a31f8!2sKoyambedu%2C%20Chennai%2C%20Tamil%20Nadu!3m2!1d13.0693568!2d80.1948314!5e0!3m2!1sen!2sin!4v1725436652287!5m2!1sen!2sin" };
    const tn = { stops: ["Thiruvanmayur", "Thoraipakam", "Karapakam", "Solinganallur", "Navalur"], routeno: 2, mapurl: "https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d124444.35807632837!2d80.16049223542794!3d12.915035691162403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x3a525d5b9b3bfc6f%3A0x6959f97669f90baa!2sThiruvanmiyur%2C%20Chennai%2C%20Tamil%20Nadu!3m2!1d12.983026899999999!2d80.2594001!4m5!1s0x3a525a51439fd9f3%3A0x5fdacd19ed90126c!2sNavalur%2C%20Tamil%20Nadu%20600130!3m2!1d12.8459348!2d80.22652289999999!5e0!3m2!1sen!2sin!4v1725463661891!5m2!1sen!2sin" };
    const tm = { stops: ["Thiruvanmayur", "Velachery", "Ram nagar", "Madipakam", "Medavakam"], routeno: 3, mapurl: "https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d62213.32222819287!2d80.17933187188422!3d12.95055391471845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x3a525d5b9b3bfc6f%3A0x6959f97669f90baa!2sThiruvanmiyur%2C%20Chennai%2C%20Tamil%20Nadu!3m2!1d12.983026899999999!2d80.2594001!4m5!1s0x3a525c1c2ab10c01%3A0x8f33fe8bebe2b89c!2sMedavakkam%2C%20Chennai%2C%20Tamil%20Nadu!3m2!1d12.9200089!2d80.1919901!5e0!3m2!1sen!2sin!4v1725463755174!5m2!1sen!2sin" };
    
    const [route, setRoute] = useState(tk.stops);
    const [mapUrl, setMapUrl] = useState(tk.mapurl);

    const [source, setSource] = useState(null);
    const [destination, setDestination] = useState(null);
    const [routeno, setrouteno] = useState(null);
    const [email, setEmail] = useState('');

    const handleRouteChange = (routeKey) => {
        if (routeKey === "tk") {
            setRoute(tk.stops);
            setMapUrl(tk.mapurl);
            setrouteno(tk.routeno);
        } else if (routeKey === "tn") {
            setRoute(tn.stops);
            setMapUrl(tn.mapurl);
            setrouteno(tn.routeno);
        } else if (routeKey === "tm") {
            setRoute(tm.stops);
            setMapUrl(tm.mapurl);
            setrouteno(tm.routeno);
        }
    };

    const handleSource = (stop) => {
        setSource(stop);
    };

    const handleDestination = (stop) => {
        setDestination(stop);
    };

    const handleEmail = (e) => {
        setEmail(e.target.value);
    };

    const handlebook = async (e) => {
        
        try {
            const response = await axios.post(" https://smart-india.onrender.com/counter", { source, destination, email, routeno });
            const {qrCode}=response.data
            navigate("/ticketbooked",{state:{qrCode}});

        } catch (error) {
            console.error("Error booking ticket:", error);
        }
    };

    return (
        <div className="all">
            <div className="routes">
                <div className="routebox" onClick={() => handleRouteChange("tk")}>
                    <p>Thiruvanmayur TO Koyambedu</p>
                </div>
                <div className="routebox" onClick={() => handleRouteChange("tn")}>
                    <p>Thiruvanmayur TO Navalur</p>
                </div>
                <div className="routebox" onClick={() => handleRouteChange("tm")}>
                    <p>Thiruvanmayur TO Medavakam</p>
                </div>
            </div>

            <div>
                <h2>Select The Starting Place:</h2>
                
                <section className="srcbox">
                    {route.map((stop, index) => (
                        <div onClick={() => handleSource(stop)} key={index} className="stopname">
                            <p>{stop}</p>
                        </div>
                    ))}
                </section>

                <h2>Select The Destination</h2>
                
                <section className="descbox">
                    {route.map((stop, index) => (
                        <div onClick={() => handleDestination(stop)} key={index} className="stopname2">
                            <p>{stop}</p>
                        </div>
                    ))}
                </section>

                <section className="map">
                    <iframe
                        src={mapUrl}
                        width="600"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </section>

                <section className="mailid">
                    <label htmlFor="email">Mailid </label>
                    <input type="text" value={email} onChange={handleEmail} />
                </section>

                <button onClick={handlebook}>Book Ticket</button>
            </div>
        </div>
    );
};

export default Counters;
