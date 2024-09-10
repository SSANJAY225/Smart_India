import axios from "axios";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [mapdata, setmapdata] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "https://smart-india.onrender.com/min-distance"
        );
        console.log(response.data); // Check the structure of the response
        setmapdata(response.data); // Assuming the response is the array of objects you need
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      <div className="container">
        <div className="row">
          <h1 className="text-center">Dashboard</h1>
          <div className="dashcont">
            <section className="busbox">
              <h3>Thiruvanmayur TO Koyambedu</h3>
              <div className="busstat">
                <h3>Bus In Duty</h3>

                <p>{}</p>

                <ul>
                  <li>{}</li>
                </ul>
              </div>
              <p>Use the Map to Track The traffic ...</p>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d62193.39638274079!2d80.18423637227335!3d13.030114096228163!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x3a525d5b9b3bfc6f%3A0x6959f97669f90baa!2sThiruvanmiyur%2C%20Chennai%2C%20Tamil%20Nadu!3m2!1d12.983026899999999!2d80.2594001!4m5!1s0x3a5266b2082873a1%3A0x7f2b6f60e42a31f8!2sKoyambedu%2C%20Chennai%2C%20Tamil%20Nadu!3m2!1d13.0693568!2d80.1948314!5e0!3m2!1sen!2sin!4v1725436652287!5m2!1sen!2sin"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </section>
            <section className="busbox">
              <h3>Thiruvanmayur TO Navalur</h3>
              <div className="busstat">
                <h3>Bus In Duty</h3>
              </div>
              <p>Use the Map to Track The traffic ...</p>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d124444.35807632837!2d80.16049223542794!3d12.915035691162403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x3a525d5b9b3bfc6f%3A0x6959f97669f90baa!2sThiruvanmiyur%2C%20Chennai%2C%20Tamil%20Nadu!3m2!1d12.983026899999999!2d80.2594001!4m5!1s0x3a525a51439fd9f3%3A0x5fdacd19ed90126c!2sNavalur%2C%20Tamil%20Nadu%20600130!3m2!1d12.8459348!2d80.22652289999999!5e0!3m2!1sen!2sin!4v1725463661891!5m2!1sen!2sin"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </section>
            <section className="busbox">
              <h3>Thiruvanmayur TO Medavakam</h3>
              <div className="busstat">
                <h3>Bus In Duty</h3>
              </div>
              <p>Use the Map to Track The traffic ...</p>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d62213.32222819287!2d80.17933187188422!3d12.95055391471845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x3a525d5b9b3bfc6f%3A0x6959f97669f90baa!2sThiruvanmiyur%2C%20Chennai%2C%20Tamil%20Nadu!3m2!1d12.983026899999999!2d80.2594001!4m5!1s0x3a525c1c2ab10c01%3A0x8f33fe8bebe2b89c!2sMedavakkam%2C%20Chennai%2C%20Tamil%20Nadu!3m2!1d12.9200089!2d80.1919901!5e0!3m2!1sen!2sin!4v1725463755174!5m2!1sen!2sin"
                width="600"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
