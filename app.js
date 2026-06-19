const express = require('express');
const path = require('path');
const app = express();

const TARGET_PATH = '/electricman-2-hs.swf';

app.get(TARGET_PATH, (req, res) => {
    // Read the browser's native Fetch Metadata destinations
    const secFetchDest = req.headers['sec-fetch-dest'];
    const acceptHeader = req.headers['accept'] || '';

    // If Ruffle or an internal script is fetching the asset payload, 
    // its destination is 'empty' or it asks for a binary stream
    if (secFetchDest === 'empty' || acceptHeader.includes('application/x-shockwave-flash')) {
        res.sendFile(path.join(__dirname, 'electricman-2-hs.swf'));
    } else {
        // Otherwise, a fresh browser tab is loading the web page
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>1:1 Dittox Matching Test</title>
                <script src="https://unpkg.com/@ruffle-rs/ruffle"></script>
            </head>
            <body style="background:#0a0a0c; margin:0; display:flex; justify-content:center; align-items:center; height:100vh;">
                <div id="flash-container" style="width:800px; height:600px;"></div>
                <script>
                    window.addEventListener("DOMContentLoaded", () => {
                        const ruffle = window.RufflePlayer.newest();
                        const player = ruffle.createPlayer();
                        document.getElementById("flash-container").appendChild(player);
                        
                        // Requests the EXACT identical string with zero parameters
                        player.load(window.location.pathname);
                    });
                </script>
            </body>
            </html>
        `);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/electricman-2-hs.swf`);
});