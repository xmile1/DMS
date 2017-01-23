import chai from 'chai';
import supertest from 'supertest';
import helper from './testHelper';
import app from '../../server/config/app';


const request = supertest.agent(app);
const expect = chai.expect;

describe('Create User and Login User', () => {
  it('should create a new user for passed valid credentials', (done) => {
    request.post('/api/users')
      .type('form')
      .send(helper.user)
      .end((err, res) => {
        expect(res.statusCode).to.eql(201);
        expect(res.body.user).to.have.property('fullNames');
        expect(res.body.user).to.have.property('username');
        expect(res.body.user).to.have.property('email');
        expect(res.body.user).to.have.property('RoleId');
      });
    done();
  });
  it('should be able to login', (done) => {
    request.post('/api/users')
        .send({ email: 'wrongemail.com' })
        .expect(400)
        .end((err, res) => {
          expect(typeof res.error).to.equal('object');
          expect(/cannot be null/.test(res.error.text)).to.equal(true);
        });
    done();
  });
});
