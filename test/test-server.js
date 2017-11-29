'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const {TEST_DATABASE_URL} = require('../config');
const {Recipe} = require('../model');
const {app, runServer, closeServer} = require('../server')

const index = `/index.html`
const recipe = `/recipes.html`;
const login = `/login.html`;

chai.use(chaiHttp);

function seedRecipeData() {
  console.info('seeding data');
  const seedData = [];

  for(let i = 1; i<=10; i++) {
    seedData.push(generateRecipeData());
  }
  return Recipe.insertMany(seedData);
}

function generateRecipeName() {
  const names = ['Roasted Boar Meat', 'Spice Bread', 'Gingerbread Cookies', 'Beer Basted Boar Ribs', 'Delicious Chocolate Cake'];
  return names[Math.floor(Math.random() * names.length)];
}

function generateType() {
  const types = ['low-fat', 'low-carb', 'low-sugar']
}


name: {type: String, required: true},
type: {type: [String], required: true},
ingredients: {type: [String], required: true},
supplies: [String],
instructions: {type: [String], required: true},
author: {type: String, default: 'anonymous'},
series: {type: String, required: true}
category: String,
prepTime: String,
cookTime: String,
serving: Number,
AdaptedFromURL: String,
publishDate: {type: Date, default: Date.now}

describe('index', function() {
  // get index.html
  it('should return 200 on GET', function() {
    return chai.request(app)
      .get(index)
      .then(function(res) {
        res.should.have.status(200);
      });
  });
});

describe('recipe', function() {
  // get index.html
  it('should return 200 on GET', function() {
    return chai.request(app)
      .get(recipe)
      .then(function(res) {
        res.should.have.status(200);
      });
  });
});

describe('login', function() {
  // get index.html
  it('should return 200 on GET', function() {
    return chai.request(app)
      .get(login)
      .then(function(res) {
        res.should.have.status(200);
      });
  });
});
