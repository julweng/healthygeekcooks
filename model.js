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
  category: String,
  prepTime: String,
  cookTime: String,
  serving: Number,
  calories: Number,
  adaptedFromURL: String,
  publishDate: {type: Date, default: Date.now}
});

recipeSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    name: this.name,
    type: this.type,
    title: this.title,
    ingredients: this.ingredients,
    supplies: this.supplies,
    instructions: this.instructions,
    author: this.author,
    series: this.series,
    category: this.category,
    prepTime: this.prepTime,
    cookTime: this.cookTime,
    serving: this.serving,
    calories: this.calories,
    adaptedFromURL: this.AdaptedFromURL,
    publishDate: this.publishDate
  };
}

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = {Recipe};
