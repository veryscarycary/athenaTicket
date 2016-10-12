'use strict'
const mw = require('../config/middleware.js');
const uri = mw.urls.database;
const chalk = mw.chalk;
const schema = require('./schema.js');
const DEFAULT_DATA = require('../data/test.json');

let sequelize = module.exports.sequelize = new mw.Sequelize(uri, {
  logging: false //set true to see SQL in terminal
});

//table definitions
let Ticket = module.exports.ticket = 
  sequelize.define('ticket', schema.ticket);
let RelatedArticle = module.exports.relatedArticle = sequelize.define('related_article', schema.relatedArticle);
Ticket.hasMany(RelatedArticle, {as: 'relatedArticles', onDelete: 'CASCADE', onUpdate: 'CASCADE'});
//----server initialization----
//server will overwrite defaults each time its launched
sequelize.authenticate()
  .then(() => {
    let conflicts = 0,
    creations = 0,
    errors = 0,
    done = 0;
    console.log(chalk.green('Database connected.') + chalk.cyan('\nLoading default data...'));
    Ticket.sync({force: true})
    .then(() => 
      RelatedArticle.sync({force: true})
      .then(()=> Promise.all(DEFAULT_DATA.map((jsonItem, i, a) => {
        let articles = [];
        if(Array.isArray(jsonItem.relatedArticles)) {
          articles = jsonItem.relatedArticles.slice();
          delete jsonItem.relatedArticles;
        }
        return Ticket.create(jsonItem)
        .then(data => RelatedArticle.bulkCreate(articles.map(article => {
          article.ticketId = data.id;
          article.id = `T${article.ticketId}A${article.articleId}`;
          return article;
        }))
      )})).then(loads => console.log(chalk.green(`Load complete. `) + chalk.magenta(`${loads.length} records loaded.`))))
    );
  })
  .catch(err => console.log(chalk.red(err.name + ' ' + err.message)));