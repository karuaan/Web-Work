const express = require('express');
const cors = require('cors');
const http = require('http');
const https = require('https');
const fs = require('fs');
const splitCA = require('split-ca');
const secure = require('express-force-https')

const app = express();


app.use(secure);
app.use(cors());
app.use(express.static('dist'));

//const CAs = fs.readFileSync('../ssl/ca-bundle.crt').toString().split(/(?=-----BEGIN CERTIFICATE-----)/);

//console.log(CAs);

const sslOptions = {
  key: fs.readFileSync('../ssl/key.pem'),
  cert: fs.readFileSync('../ssl/cert.crt'),
  ca: splitCA('../ssl/ca-bundle.crt'),
  requestCert: true,
  rejectUnauthorized: false
};

/*app.use (function (req, res, next) {
	if (req.secure) {
		next();
	} else {
		res.redirect('https://' + req.headers.host + req.url);
	}
});*/


//http.createServer(app).listen(80);

https.createServer(sslOptions, app, function(req, res){
	console.log("server started on port 443");
}).listen(443);

//app.listen(443, () => console.log('server running on 443'));