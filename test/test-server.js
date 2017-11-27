const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../server');

const should = chai.should();

const index = `/index.html`;
const recipe = `/recipe.html`;
const login = `/login.html`

chai.use(chaiHttp);

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
