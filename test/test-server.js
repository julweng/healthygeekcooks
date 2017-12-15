'use strict';

require('dotenv').config();
const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const {TEST_DATABASE_URL} = require('../config');
const {Recipe} = require('../model');
const {app, runServer, closeServer} = require('../server');

chai.use(chaiHttp);

function seedRecipeData() {
  console.info('seeding data');
  const seedData = [];

  for(let i = 1; i<=10; i++) {
    seedData.push(generateRecipeData());
  }
  return Recipe.insertMany(seedData);
}

function generateType() {
  let typeArray = [];
  const types = ["low fat", "low carb", "low sugar", "gluten free"];
  typeArray.push(types[Math.floor(Math.random() * types.length)]);
  return typeArray;
}

function generateRecipeData() {
  return {
    name:faker.lorem.words(),
    type: generateType(),
    ingredients: [faker.lorem.words()],
    supplies: [faker.lorem.words()],
    instructions: faker.lorem.sentences(),
    author: faker.lorem.word(),
    series: faker.lorem.word(),
    prepTime: `${faker.random.number()} hr ${faker.random.number()} min`,
    cookTime: `${faker.random.number()} hr(s) ${faker.random.number()} min`,
    serving: faker.random.number(),
    publishDate: faker.date.recent(),
  };
}

function generateUser() {
  return {
    username: faker.random.word(),
    password: faker.random.alphaNumeric()
  }
}

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

describe('healthy geek cooks API resources', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedRecipeData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  describe('GET endpoint', function() {
    it('should return all healthy geek recipes', function() {
      let res;
      return chai.request(app)
        .get('/recipes')
        .then(function(_res) {
          res = _res;
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.have.length.of.at.least(1);
          return Recipe.count();
        })
        .then(function(count) {
          res.body.should.have.lengthOf(count);
        });
    });

    it('should return recipes with right fields', function() {
      let resRecipe;
      return chai.request(app)
        .get('/recipes')
        .then(function(res) {
          res.should.have.status(200);
          res.should.be.json;
          res.body.should.be.a('array');
          res.body.should.have.length.of.at.least(1);
          res.body.forEach(function(recipe) {
            recipe.should.be.a('object');
            recipe.should.include.keys(
              'id', 'name', 'ingredients', 'instructions', 'author', 'series');
          });
          resRecipe = res.body[0];
          return Recipe.findById(resRecipe.id);
          })
          .then(function(recipe) {
            resRecipe.name.should.equal(recipe.name);
            resRecipe.author.should.equal(recipe.author);
            resRecipe.series.should.equal(recipe.series);
          });
        });
    });

    describe('POST endpoint', function() {
      it('should add a new recipe', function() {
        const newRecipe = generateRecipeData();
        return chai.request(app)
          .post('/recipes/post')
          .send(newRecipe)
          .then(function(res) {
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.include.keys(
              'id', 'name', 'instructions', 'series', 'publishDate');
            res.body.name.should.equal(newRecipe.name);
            res.body.author.should.equal(newRecipe.author);
            res.body.series.should.equal(newRecipe.series);
            return Recipe.findById(res.body.id);
          })
          .then(function(recipe) {
            recipe.name.should.equal(newRecipe.name);
            recipe.author.should.equal(newRecipe.author);
            recipe.series.should.equal(newRecipe.series);
          });
      });
    });

    describe('PUT endpoint', function() {
      it('should update fields sent over by user', function() {
        const updateData = {
          name: 'Kaldorei Spider Kabob',
          serving: 2
        };
        return Recipe
          .findOne()
          .then(function(recipe) {
            updateData.id = recipe.id;

            return chai.request(app)
              .put(`/recipes/${recipe.id}`)
              .send(updateData);
          })
          .then(function(res) {
            res.should.have.status(204);
            return Recipe.findById(updateData.id);
          })
          .then(function(recipe) {
            recipe.name.should.equal(updateData.name);
            recipe.serving.should.equal(updateData.serving);
          });
      });
    });

    describe('DELETE endpoint', function() {
      it('delete a recipe by id', function() {
        let recipe;
        return Recipe
          .findOne()
          .then(function(_recipe) {
            recipe = _recipe;
            return chai.request(app).delete(`/recipes/${recipe.id}`);
          })
          .then(function(res) {
            res.should.have.status(204);
            return Recipe.findById(recipe.id);
          })
          .then(function(_recipe) {
            should.not.exist(_recipe);
          });
      });
    });
});
