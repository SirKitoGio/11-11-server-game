const fs = require('fs');
const path = require('path');

// Read the FIREBASE_CONFIG env var from Vercel
const config = process.env.FIREBASE_CONFIG;

if (config) {
  // Check if it already has 'const firebaseConfig ='
  const fileContent = config.trim().startsWith('const') 
    ? config 
    : `const firebaseConfig = ${config.trim().endsWith(';') ? config.trim() : config.trim() + ';'}`;

  const targetPath = path.join(__dirname, '../assets/firebase-config.js');
  
  // Ensure the directory exists
  if (!fs.existsSync(path.dirname(targetPath))) {
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  }

  fs.writeFileSync(targetPath, fileContent);
  console.log('SUCCESS: assets/firebase-config.js has been generated from Vercel environment variables.');
} else {
  console.warn('WARNING: FIREBASE_CONFIG environment variable not found. Using local assets/firebase-config.js if it exists.');
}
