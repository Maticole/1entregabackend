const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Asegúrate de que app sea tu aplicación Express

chai.use(chaiHttp);
const expect = chai.expect;

describe('Router de Carts', () => {
  describe('POST /api/carts', () => {
    it('should add a product to the cart', (done) => {
      
      chai.request(app)
        .post('/api/carts')
        .send({ productId: 'producto_id' }) 
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
         
          done();
        });
    });
  });

 
});