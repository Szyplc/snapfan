const express = require('express');
const app = express();
const fs = require('fs');
const https = require('https');
const path = require('path');

app.use(express.static('build'));

app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'; connect-src *; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';");
  next();
});

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/snapfun.io/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/snapfun.io/fullchain.pem')
};

https.createServer(options, app).listen(443);

const http = require('http');
http.createServer((req, res) => {
  res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
  res.end();
}).listen(80);

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

console.log('Serwer działa na porcie 443 i 80.');


// const express = require('express');
// const app = express();
// const fs = require('fs');
// const https = require('https');

// app.use(express.static('build'));

// app.use((req, res, next) => {
//   res.setHeader('Content-Security-Policy', "default-src 'self'; connect-src *; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';");
//   next();
// });

// const options = {
//   key: fs.readFileSync('/etc/letsencrypt/live/snapfun.io/privkey.pem'),
//   cert: fs.readFileSync('/etc/letsencrypt/live/snapfun.io/fullchain.pem')
// };

// https.createServer(options, app).listen(443);

// const http = require('http');
// http.createServer((req, res) => {
//   res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
//   res.end();
// }).listen(80);

// console.log('Serwer działa na porcie 443 i 80.');

