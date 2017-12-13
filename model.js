'use strict';

const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
  name: {type: String, required: true},
  type: {type: [String], required: true},
  ingredients: {type: [String], required: true},
  supplies: [String],
  instructions: {type: [String], required: true},
  author: {type: String, default: 'anonymous'},
  series: {type: String, required: true},
  prepTime: String,
  cookTime: String,
  serving: Number,
  publishDate: {type: Date, default: Date.now},
  img: {type: String, default: '/img/nopic.png'}
});

recipeSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    name: this.name,
    type: this.type,
    ingredients: this.ingredients,
    supplies: this.supplies,
    instructions: this.instructions,
    author: this.author,
    series: this.series,
    prepTime: this.prepTime,
    cookTime: this.cookTime,
    serving: this.serving,
    publishDate: this.publishDate,
    img: this.img
  };
}

recipeSchema.query.byName = function(name) {
  return this.find({name: new RegExp('^'+name+'$', "i")});
};

recipeSchema.query.bySeries = function(series) {
  return this.find({series: new RegExp('^'+series+'$', "i")});
};

recipeSchema.query.byType = function(type) {
  return this.find({type: new RegExp('^'+type+'$', "i")});
};

recipeSchema.query.byAuthor = function(author) {
  return this.find({author: new RegExp('^'+author+'$', "i")});
};

recipeSchema.query.byNameAndAuthor = function(name, author) {
  return this.find({
    name: new RegExp('^'+name+'$', "i"),
    author: new RegExp('^'+author+'$', "i")
  })
}

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = {Recipe};
