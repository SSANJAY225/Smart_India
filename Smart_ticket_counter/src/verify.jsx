import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeScanner } from 'html5-qrcode';

const Verify = () => {
   
    const [hashedId,setScanresult]=useState(null)
    const [apiResponse, setApiResponse] = useState(null)
    useEffect(()=>{
        const scanner=new Html5QrcodeScanner('reader',{
            qrbox:{
                width: 250,
                height:250,
            },
            fps:5
        })
        scanner.render(succes,error) 
        function succes(result){
            scanner.clear()
            setScanresult(result)
            Toapi(result)
        }
        function error(err){
            console.warn(err)
        }
    },[])

    const Toapi=async(hashedId)=>{
        try{
            const response = await fetch('http://localhost:5000/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ hashedId })
            });            
            console.log(response)
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            console.log('API response:', data);
            setApiResponse(data)
        }
        catch (error) {
            console.error('Error sending scan result to API:', error);
        }
    }
    
    const getStatusMessage = () => {
        if (!apiResponse) return null;

        switch (apiResponse) {
            case "Passenger Boarded":
                return "Passenger has been successfully boarded.";
            case "Travel completed":
                return "Travel has been completed.";
            case "Not Ticket":
                return "The QR code does not match any ticket.";
            case "Ticket already used":
                return "The ticket has already been used.";
            default:
                return "Unknown response from server.";
        }
    };

    return (
        <div>
            {hashedId ? (
                <div>
                    <div>Status: {getStatusMessage()}</div>
                </div>
            ) : (
                <div id="reader"></div>
            )}
        </div>
    );
};

export default Verify;
