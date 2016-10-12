'use strict'
const mw = require('../config/middleware.js');
const request = mw.request;
const url = mw.urls.database;
const Ticket = require('./schema.js');

module.exports = {
  pingDb (req, res) {
    require('../db/index.js').readyState ?
      res.status(200).send(JSON.stringify('db connected'))
      : res.status(503).send(JSON.stringify({name: 'MONGO_CONN_FAIL', message: 'bad MongoDB connection'}
      ));
  },
  getStub(req, res) {
  },
  getTicket(req, res) {
    let id = req.params.id;
    Ticket.find(id ? {id: req.params.id} : {},
      (err, data) => err ?
        res.status(404).send(err)
        : res.status(200).send(JSON.stringify(data))
    );
  },
  createTicket(req, res) {
    new Ticket(req.body)
      .save((err, data) => (() => { console.log(err, data); return err})() ?
        res.status(500).send(err)
        : res.status(201).send(data)
      );
  },
  editTicket(req, res) {
    Ticket.findOneAndUpdate({_id: req.params.id},
      req.body,
      {new: true},
      (err, data) => err ?
        res.status(404).send(err)
        : res.status(200).send(data)
    );
  },
  deleteTicket(req, res) {
    Ticket.remove({_id: req.params.id},
      (err, data) => err ?
        res.status(404).send(err)
        : res.status(200).send(JSON.stringify(data))
    );
  }
};
