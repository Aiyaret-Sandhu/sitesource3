const express = require('express');
const path = require('path');
const app = express();

app.get('/electricman-2-hs.swf', (req, res) => { // <-- Fixed argument order here!
    // Read the browser's native Fetch Metadata destinations
    const secFetchDest = req.headers['sec-fetch-dest'];
    const acceptHeader = req.headers['accept'] || '';

    // If Ruffle is fetching the asset payload over the network
    if (secFetchDest === 'empty' || acceptHeader.includes('application/x-shockwave-flash')) {
        res.sendFile(path.join(__dirname, '../electricman-2-hs.swf'));
    } else {
        // If a fresh browser tab is loading the web page initial framework
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>1:1 Vercel Tracking Match</title>
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

module.exports = app;
