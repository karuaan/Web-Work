/* eslint-env node */
module.exports = function(app) {
  var express = require('express');
  var assignmentsRouter = express.Router();

  assignmentsRouter.get('/', function(req, res) {
    res.send({
      'assignments': []
    });
  });

  assignmentsRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  assignmentsRouter.get('/:id', function(req, res) {
    res.send({
      'assignments': {
        id: req.params.id
      }
    });
  });

  assignmentsRouter.put('/:id', function(req, res) {
    res.send({
      'assignments': {
        id: req.params.id
      }
    });
  });

  assignmentsRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  // The POST and PUT call will not contain a request body
  // because the body-parser is not included by default.
  // To use req.body, run:

  //    npm install --save-dev body-parser

  // After installing, you need to `use` the body-parser for
  // this mock uncommenting the following line:
  //
  //app.use('/api/assignments', require('body-parser').json());
  app.use('/api/assignments', assignmentsRouter);
};
