'use strict';
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const upload = require('jquery-file-upload-middleware')
mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {Recipe} = require('./model');
const {router: usersRouter} = require('./users');
const {router: authRouter, localStrategy, jwtStrategy } = require('./auth');
const app = express();
upload.configure({
    uploadDir: __dirname + '/public/uploads/',
    uploadUrl: '/uploads'
});


app.use('/upload', upload.fileHandler());
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(morgan('common'));


// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

passport.use(localStrategy);
passport.use(jwtStrategy);

/// Redirect all to home except post
app.get('/uploads', function( req, res ){
	res.redirect('/');
});

app.put('/uploads', function( req, res ){
	res.redirect('/');
});

app.delete('/uploads', function( req, res ){
	res.redirect('/');
});

app.use('/uploads', function(req, res, next){
    upload.fileHandler({
        uploadDir: function () {
            return __dirname + '/public/uploads/'
        },
        uploadUrl: function () {
            return '/uploads'
        }
    })(req, res, next);
});
app.post('/images', (req, res) => {
  console.log(req);
  res.send({});
});

app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);

const jwtAuth = passport.authenticate('jwt', { session: false });

// A protected endpoint which needs a valid JWT to access it
// if no valid JWT is provided, 401 Unauthorized would have been returned
app.get('/api/protected', jwtAuth, (req, res) => {
  return res.json({
    data: 'rosebud'
  });
});

// GET requests to /recipes
app.get('/recipes', (req, res) => {
  Recipe
    .find()
    .then(recipes => {
      res.json(recipes.map(recipe => recipe.apiRepr()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal Server Error'});
    });
});

// get by id
app.get('/recipes/:id', (req, res) => {
  Recipe
    .findById(req.params.id)
    .then(recipe => res.json(recipe.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal Server Error'});
    });
});

// get by recipe name
app.get('/recipes/name', (req, res) => {
  let filter = {};
  for (let k in req.query.filter) {
    filter[k] = req.query.filter[k];
  }
  return Recipe.find(filter, function(error, recipe){
    return res.json(recipe.apiRepr());
  });
});

// get by recipe Name
app.get('/recipes', (req, res) => {
Recipe
    .find()
    .byName(req.query.name)
    .exec(function(err, recipe) {
      res.json(recipe.apiRepr());
    if(err) {
      console.log(err);
      res.status(500).json({message: 'Internal Server Error'});
    }
  });
});

// get by series name
app.get('/recipes', (req, res) => {
  Recipe.find()
    .bySeries(req.query.series)
    .then(recipe => res.json(recipe.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal Server Error'});
    });
});

// get by Author name (username)
app.get('/recipes', (req, res) => {
  Recipe.find()
    .byAuthor(req.query.author)
    .then(recipe => res.json(recipe.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal Server Error'});
    });
});

// get by type
app.get('/recipes', (req, res) => {
  Recipe.find()
    .byType(req.query.type)
    .then(recipe => res.json(recipe.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal Server Error'});
    });
});

app.post('/recipes/post', (req, res) => {
  const requiredFields = ['name', 'type', 'ingredients', 'instructions', 'series'];
  for(let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if(!(field in req.body)) {
      const message = `Bad request: missing \'${field}\' in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  Recipe
    .create({
      name: req.body.name,
      type: req.body.type,
      ingredients: req.body.ingredients,
      instructions: req.body.instructions,
      series: req.body.series,
      author: req.body.author,
      cookTime: req.body.cook,
      prepTime: req.body.prep,

    })
    .then(recipe => res.status(201).json(recipe.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({message: 'Internal Server Error'});
    });
});

app.put('/recipes/:id', (req, res) => {
  if(!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = `Bad Request: Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
    console.error(message);
    return res.status(400).json({message: message});
  }

  const toUpdate = {};
  const updateableFields = ['name', 'type', 'ingredients', 'supplies','instructions', 'author', 'series', 'prepTime', 'cookTime', 'serving', 'publishDate'];

  updateableFields.forEach(field => {
    if(field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Recipe
    .findOneAndUpdate(req.params.id, {$set: toUpdate})
    .then(recipe => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal Server Error'}));
});


// delete by id
app.delete('/recipes/:id', (req, res) => {
  Recipe
    .findByIdAndRemove(req.params.id)
    .then(recipe => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal Server Error'}));
});

// delete by Name
app.delete('/recipes', (req, res) => {
  Recipe
    .findOneAndRemove({name: res.query.name})
    .then(recipe => res.status(204).end())
    .catch(err => {
      res.status(500).json({message: 'Internal Server Error'});
    });
});

app.use('*', function(req, res) {
  res.status(404).json({message: 'Not Found'});
});

let server;

function runServer(databaseUrl = DATABASE_URL, port = PORT) {
    return new Promise((resolve, reject) => {
      mongoose.connect(databaseUrl, err => {
        if(err) {
          return reject(err);
        }
        server = app.listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve();
        })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
      });
    });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if(err) {
          return rejct(err);
        }
        resolve();
      });
    });
  });
}

if(require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
