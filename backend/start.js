const https = require('https');
const fs = require('fs');
const express = require('express');
const path = require('path'); // Importuj moduł path

const app = express();
const port = 443; // Port HTTPS

const options = {
    key: fs.readFileSync('./etc/letsencrypt/live/snapfan.io/privkey.pem'),
    cert: fs.readFileSync('./etc/letsencrypt/live/snapfan.io/fullchain.pem'),
};

// Ścieżka do folderu zbudowanego projektu React
const buildPath = './build';

app.use(express.static(buildPath));

// Dodaj obsługę routingu klienta
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, buildPath, 'index.html'));
});

const server = https.createServer(options, app);

server.listen(port, () => {
    console.log(`Serwer HTTPS działa na porcie ${port}`);
});
