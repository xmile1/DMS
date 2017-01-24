import chai from 'chai';
import supertest from 'supertest';
import helper from './testHelper';
import app from '../../server/config/app';


const request = supertest(app);
const expect = chai.expect;

describe('Create User and Login User', () => {
  it('should create a new user for passed valid credentials', (done) => {
    request.post('/api/users')
      .type('form')
      .send(helper.user())
      .end((err, res) => {
        expect(res.statusCode).to.eql(501);
        expect(res.body.user).to.have.property('fullNames');
        expect(res.body.user).to.have.property('username');
        expect(res.body.user).to.have.property('email');
        expect(res.body.user).to.have.property('RoleId');
      });
    done();
  });
  it('Should create a unique user', (done) => {
    request.post('/api/users')
      .send(helper.user())
      .expect(409)
      .end((err, res) => {
        expect(res.body.message.includes('already exists')).to.equal(true);
      });
    done();
  });
  it('Should fail for an invalid email input', (done) => {
    const user = helper.user();
    user.email = 'bademail';
    request.post('/api/users')
      .send(user)
      .expect(400)
      .end((err, res) => {
        expect(res.error.text.includes('cannot be null')).to.equal(true);
      });
    done();
  });

  it('new users should be assigned a default role(registered)', (done) => {
    request.post('/api/users')
      .send(helper.user())
      .expect(201)
      .end((err, res) => {
        expect(res.body.user).to.have.property('RoleId');
        expect(res.body.user.RoleId).to.equal(5);
      });
    done();
  });

  it('Should login a user', (done) => {
    const user = helper.user();
    request.post('/api/users')
    .type('form')
    .send(user);
    request.post('/api/users/login')
      .send(user)
      .expect(200)
      .end((err, res) => {
        expect(typeof res.body).to.equal('object');
        expect(res.body).to.have.property('token');
        expect(res.body.token).not.to.equal(null);
      });
    done();
  });
});
