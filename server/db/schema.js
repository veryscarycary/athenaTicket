'use strict'
const Sequelize = require('../config/middleware.js').Sequelize,
STR = Sequelize.STRING, //varchar(255)
BOOL = Sequelize.BOOLEAN, //tinyint(1)
DATE = Sequelize.DATE, //Timestamp with time zone
INT = Sequelize.INTEGER, //tinyint(1)
TXT = Sequelize.TEXT, //text
ENUM = Sequelize.ENUM; //enumerated

module.exports = {
  ticket: {
    title: {
      type:STR,
      unique: true,
      required: true
    },
    id: {
      type: INT,
      autoIncrement: true,
      unique: true,
      primaryKey: true
    },
    issuePreview: STR,
    issue: TXT,
    customerId: STR,
    product: STR,
    solution: TXT,
    // relatedArticles: [String], do join table
    // relatedProducts: Object, //keys are products, values are versions
    status: {
      type: ENUM,
      values: ['unresolved', 'checked out', 'resolved'],
      defaultValue: 'unresolved'
    },
    authorId: STR,
    datesResolved: DATE //dates resolved, user Id
  },
  relatedArticle: {
    id: {
      type: STR,
      required: true,
      primaryKey:true
    },
    articleId: {
      type: INT
    }
  }
};
