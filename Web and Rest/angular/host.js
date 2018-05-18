const express = require('express');
const cors = require('cors');
const http = require('http');
const https = require('https');
const fs = require('fs');
const splitCA = require('split-ca');
const httpsRedirect = require('express-https-redirect');

const app = express();

//app.all('*', ensureSecure);
app.use('/', httpsRedirect(true));
app.use(cors());
app.use(express.static('dist'));

const CAs = fs.readFileSync('../ssl/ca-bundle.crt').toString().split(/(?=-----BEGIN CERTIFICATE-----)/);

//console.log(CAs);

app.use (function (req, res, next) {
	if (req.secure) {
		next();
	} else {
		res.redirect('https://' + req.headers.host + req.url);
	}
});


const sslOptions = {
  key: fs.readFileSync('../ssl/key.pem'),
  cert: fs.readFileSync('../ssl/cert.crt'),
  ca: splitCA('../ssl/ca-bundle.crt'),
  rejectUnauthorized: false
};

https.createServer(sslOptions, app).listen(443);