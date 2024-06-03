const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Router de Products', () => {
  describe('GET /api/products', () => {
    it('debería devolver una lista de productos', (done) => {
      chai.request(app)
        .get('/api/products')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });

  describe('POST /api/products', () => {
    it('debería agregar un nuevo producto', (done) => {
      chai.request(app)
        .post('/api/products')
        .send({ name: 'Nuevo producto', price: 100, category: 'Electrónica' })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Producto creado exitosamente');
          done();
        });
    });
  });

  describe('GET /api/products/:id', () => {
    it('debería obtener un producto por su ID', (done) => {
      
      chai.request(app)
        .get('/api/products/producto_id')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          
          done();
        });
    });
  });

  describe('PUT /api/products/:id', () => {
    it('debería actualizar un producto existente', (done) => {
      
      chai.request(app)
        .put('/api/products/producto_id')
        .send({ name: 'Producto actualizado', price: 150, category: 'Electrónica' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Producto actualizado exitosamente');
          done();
        });
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('debería eliminar un producto existente', (done) => {
      
      chai.request(app)
        .delete('/api/products/producto_id')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('Producto eliminado exitosamente');
          done();
        });
    });
  });
});