const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); 

chai.use(chaiHttp);
const expect = chai.expect;

describe('Router de Products', () => {
  describe('GET /api/products', () => {
    it('should return a list of products', (done) => {
      chai.request(app)
        .get('/api/products')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });

});