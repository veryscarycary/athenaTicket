'use strict'
const db = require('../db/index.js')
const sequelize = db.sequelize;
const Ticket = db.ticket;
const RelatedArticle = db.relatedArticle;

module.exports = {
  pingDb (req, res) {
    sequelize.authenticate()
    .then(() => res.status(200).send(JSON.stringify('db connected')))
    .catch(err => res.status(503).send(JSON.stringify({name: 'PGSQL_CONN_FAIL', message: 'bad PostgreSQL connection'})));
  },
  getTicket(req, res) {
    let id = req.params.id ;
    let options = {
      include: [{
        model: RelatedArticle,
        as: 'relatedArticles'
      }]
    };
    if(id)
      options.where = { 
        id: { $any: id.split(',').map(str => +str) }
      };
    Ticket.findAll(options)
    .then(data => res.status(200).send(JSON.stringify(data)))
    .catch(err => res.status(404).send(err));
  },
  createTicket(req, res) {
    let articles = false;
    if(Array.isArray(req.body.relatedArticles)) {
      articles = req.body.relatedArticles.slice();
      delete req.body.relatedArticles;
    }
    Ticket.create(req.body)
    .then(data => articles ? 
      RelatedArticle.bulkCreate(articles.map(article => {
        article.ticketId = data.id;
        article.id = `T${article.ticketId}A${article.articleId}`;
        return article;
      }))
      .then(() => sendRes(res, data.id))
      : sendRes(res, data.id))
    .catch(err => res.status(500).send(err));
  },
  editTicket(req, res) {
    let articles = false;
    if(Array.isArray(req.body.relatedArticles)) {
      articles = req.body.relatedArticles.map(article => {
        article.ticketId = req.params.id;
        article.id = `T${article.ticketId}A${article.articleId}`;
        return article;
      });
      delete req.body.relatedArticles;
    }
    Ticket.update(req.body, {where: {id: req.params.id}})
    .then(() => articles ? 
      RelatedArticle.destroy({where: {ticketId: req.params.id}})
      .then(() => RelatedArticle.bulkCreate(articles)
        .then(() => sendRes(res, req.params.id)))
      : sendRes(res, req.params.id))
    .catch(err => res.status(500).send(err));
  },
  deleteTicket(req, res) {
    Ticket.destroy({where: {id: req.params.id} })
    .then(deleted => deleted ? 
      res.status(201).send('record deleted')
      : res.status(404).send('no record found'))
    .catch(err => res.status(500).send(err));
  },
  getRelations(req, res) {
    RelatedArticle.findAll({
      // include: [{
      //   model: Ticket,
      //   attributes: ['authorId', 'product', 'customerId']
      // }]
    })
    .then(data => res.status(200).send(JSON.stringify(data)))
    .catch(err => res.status(404).send(err));
  }
};

function sendRes(res, id) {
  Ticket.find({
    where: {id: id},
    include: [{
      model: RelatedArticle, 
      as: 'relatedArticles'
    }]
  })
  .then(data => res.status(201).send(JSON.stringify([data])))
}