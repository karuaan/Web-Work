/* eslint-env node */
module.exports = function(app) {
  var express = require('express');
  var pdfsRouter = express.Router();
  var fs = require('fs');
  var mongodb = require('mongodb');
  var MongoClient = require('mongodb').MongoClient;
  var GridFS = require('GridFS').GridFS;
  var GridStream = require('GridFS').GridStream;
  var uri = "mongodb://elevator:XD8rIOc2bU9BcYRE@cluster0-shard-00-00-u4liw.mongodb.net:27017,cluster0-shard-00-01-u4liw.mongodb.net:27017,cluster0-shard-00-02-u4liw.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin";
  var assert = require('assert');

  pdfsRouter.get('/', function(req, res) {
    console.log('big one');
    res.set({
      'Access-Control-Allow-Origin': '*',
      'Expires': '-1',
      'Cache-Control': 'no-cache,no-store',
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=' + req.query.id + '.pdf',
    });
    console.log('bloop');
    var filename = req.query.id + '.pdf';
    var filepath = 'server/mocks/pdfData/';

    console.log('test connect');
    /*
    MongoClient.connect(uri, function(error, db) {
      if(error) {
        console.log('error');
        console.log(error);
      } else {
        console.log('connected');
        var bucket = new mongodb.GridFSBucket(db);

        fs.createReadStream('server/mocks/pdfData/Safety_Handbook.pdf')
          .pipe(bucket.openUploadStream('Safety_Handbook.pdf'))
          .on('error', function(error) {
            assert.ifError(error);
          })
          .on('finish', function() {
            console.log('done!');
            process.exit(0);
          });
      }
    });
    */
    fs.readFile(filepath + filename, function(err, data) {
      res.contentType("application/pdf");
      res.end(data);
    });
    /*
    res.send(pdfData);
    */
  });

  pdfsRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  pdfsRouter.get('/:id', function(req, res) {
    console.log('small one');
    res.set({
      'Access-Control-Allow-Origin': '*',
      'Expires': '-1',
      'Cache-Control': 'no-cache,no-store',
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=' + req.params.id + '.pdf',
    });
    var filename = req.params.id + '.pdf';
    var filepath = 'server/mocks/pdfData/';
    fs.readFile(filepath + filename, function(err, data) {
      res.contentType("application/pdf");
      res.send({
        'pdfs': {
          id: req.params.id,
          data: data
        }
      });
    });
    /*
    res.send({
      'pdfs': {
        id: req.params.id
      }
    });
    */
  });

  pdfsRouter.put('/:id', function(req, res) {
    var buffer = req.query.data;
    var filename = 'server/mocks/pdfData/test.pdf';
    //req.query.data
    fs.writeFile(filename, 'binary', 'binary', function(err) {
    });
    res.send({
      'pdfs': {
        id: req.params.id
      }
    });
  });

  pdfsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/pdfs', require('body-parser').json());
  app.use('/pdfs', pdfsRouter);
};
