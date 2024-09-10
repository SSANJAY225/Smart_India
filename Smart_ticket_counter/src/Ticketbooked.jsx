import React from 'react';
import { useLocation } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import qr from "react-qr-code" // Correct named import for the QRCode component

const Ticketbooked = () => {
    const location = useLocation();
    const { qrCode } = location.state || {};
    console.log(qrCode)
    const truncatedHash = qrCode && qrCode.length > 200 ? qrCode.substring(0, 200) : qrCode;

    return (
        <div className="ticketbooked">
            <h1>Booking Successful</h1>
            <img src="tick.gif" alt="Success" />
            <h2>Verified</h2>
            {qrCode ? (
                <div>
                    <h3>QR Code:</h3>
                    <img src={qrCode} alt="QR Code" style={{ width: 200, height: 200 }} />
                </div>
            ) : (
                <p>No QR Code available</p>
            )}
        </div>
    );
};

export default Ticketbooked;
