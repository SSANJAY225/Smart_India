const crypto = require('crypto');
const qrcode = require('qrcode-terminal');

// Details to be hashed
const details = "sensitive-information";

// Hashing the details using SHA-256
const hashedDetails = crypto.createHash('sha256').update(details).digest('hex');

console.log(`Hashed Details: ${hashedDetails}`);

// Generate and display the QR code in the terminal
qrcode.generate(hashedDetails, { small: true });
