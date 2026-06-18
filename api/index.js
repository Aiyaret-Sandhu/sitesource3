const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
    // Read headers to determine who is making the request
    const secFetchDest = req.headers['sec-fetch-dest'];
    const acceptHeader = req.headers['accept'] || '';

    // If Ruffle or a sub-fetch engine is requesting the stream, serve the binary
    if (secFetchDest === 'empty' || acceptHeader.includes('application/x-shockwave-flash')) {
        const filePath = path.join(process.cwd(), 'electricman-2-hs.swf');
        
        res.setHeader('Content-Type', 'application/x-shockwave-flash');
        const stream = fs.createReadStream(filePath);
        
        stream.on('error', (err) => {
            res.status(500).send('Error reading game payload binary');
        });
        
        return stream.pipe(res);
    }

    // Otherwise, a fresh browser window is loading the link. Serve the page wrapper.
    res.setHeader('Content-Type', 'text/html');
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
                    
                    // Calls the exact current URL path string down the network layer
                    player.load(window.location.pathname);
                });
            </script>

        </body>
        </html>
    `);
};
