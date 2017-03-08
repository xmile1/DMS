import 'babel-polyfill';
import httpMocks from 'node-mocks-http';
import chai from 'chai';
import sinon from 'sinon';
import events from 'events';
import supertest from 'supertest';
import app from '../../config/app';
import helper from '../helpers/testHelper';
import Auth from '../../middlewares/Auth';
import db from '../../models';

const expect = chai.expect;
const request = supertest(app);

const next = () => true;
const createResponse = () => httpMocks
.createResponse({ eventEmitter: events.EventEmitter });
let adminDetails;
let regularDetails;
let testDetails;

describe('Middleware Test', () => {
  before((done) => {
    request.post('/api/users/login')
      .type('form')
      .send({ username: 'uyiosa', password: 'uyiosa' })
      .end((err, res) => {
        adminDetails = res.body;
        request.post('/api/users')
          .send(helper.user())
          .end((err, res) => {
            regularDetails = res.body;
            request.post('/api/users')
              .send(helper.user())
              .end((err, res) => {
                testDetails = res.body;
                done();
              });
          });
      });
  });
  after((done) => {
    db.sequelize.sync({ force: true }).then(() => {
      done();
    });
  });

  describe('verifyToken', () => {
    it('returns an error if token is not passed', (done) => {
      const res = createResponse();
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/users',
      });
      res.on('end', () => {
        expect(res._getData().message).to.equal('Unauthorized Access');
        done();
      });
      Auth.verifyToken(req, res);
    });

    it('returns an error if a wrong token is passed', (done) => {
      const res = createResponse();
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/users',
        headers: { 'x-access-token': 'thiscanneverbeavalidbase-64code' }
      });
      Auth.verifyToken(req, res);
      res.on('end', () => {
        expect(res._getData().message).to.equal('Invalid Token');
        done();
      });
    });

    it('calls the next function if the token is valid', (done) => {
      const res = createResponse();
      const req = httpMocks.createRequest({
        method: 'POST',
        url: '/api/users/login',
        headers: { 'x-access-token': adminDetails.token }
      });
      const middlewareStub = {
        callback: () => {}
      };

      sinon.spy(middlewareStub, 'callback');
      Auth.verifyToken(req, res, middlewareStub);
      expect(middlewareStub.callback).to.have.been.called;
      done();
    });
  });

  describe('verifyAdmin', () => {
    it('returns an error if the user is not the admin', (done) => {
      const res = createResponse();
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/users/',
        decoded: { RoleId: 2 }
      });
      const middlewareStub = {
        callback: () => {}
      };
      Auth.verifyAdmin(req, res, middlewareStub);
      res.on('end', () => {
        expect(res._getData().message).to.equal('Admin access is required!');
        done();
      });
    });

    it('calls the next function if the user is an admin', (done) => {
      const res = createResponse();
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/users/',
        headers: { authorization: adminDetails.token },
        decoded: { RoleId: 1 }
      });

      const middlewareStub = {
        callback: () => {}
      };

      sinon.spy(middlewareStub, 'callback');
      Auth.verifyAdmin(req, res, middlewareStub.callback);
      expect(middlewareStub.callback).to.have.been.called;
      done();
    });
  });

  describe('DocumentExist', () => {
    it('returns an error if document does not exist', (done) => {
      const res = createResponse();
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/users/',
        params: { id: 5000 }
      });
      Auth.documentExist(req, res);
      res.on('end', () => {
        expect(res._getData().message)
        .to.equal('Document with id: 5000 does not exit');
        done();
      });
    });

    it('calls the next function if the user is an admin', (done) => {
      const res = createResponse();
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/users/',
        headers: { authorization: adminDetails.token },
        decoded: { RoleId: 1 }
      });

      const middlewareStub = {
        callback: () => {}
      };

      sinon.spy(middlewareStub, 'callback');
      Auth.documentExist(req, res, middlewareStub.callback);
      expect(middlewareStub.callback).to.have.been.called;
      done();
    });
  });

  describe('DocumentRights', () => {
    it('returns an error if user does not have the document rights', (done) => {
      const res = createResponse();
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/users/',
        params: { id: 5000 },
        decoded: { RoleId: 2, UserId: 2 },
        document: { permission: '14' },
        body: { document: { permission: 'john' } }
      });
      Auth.documentRight(req, res);
      res.on('end', () => {
        expect(res._getData().message)
        .to.equal('Unauthorized Access to this Document');
        done();
      });
    });

    it('calls the next function if the user has a document right', (done) => {
      const res = createResponse();
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/documents/',
        decoded: { RoleId: 1 }
      });

      const middlewareStub = {
        callback: () => {}
      };

      sinon.spy(middlewareStub, 'callback');
      Auth.documentRight(req, res, middlewareStub.callback);
      expect(middlewareStub.callback).to.have.been.called;
      done();
    });
  });

  describe('roleExist', () => {
    it('return an error if roles does not exist', (done) => {
      const res = createResponse();
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/users/',
        params: { id: '5000' },
        decoded: { RoleId: 5000 }
      });
      Auth.roleExist(req, res);
      res.on('end', () => {
        expect(res._getData().message)
        .to.equal('Role with Id:5000 does not exist');
        done();
      });
    });

    it('calls the next function if role exist', (done) => {
      const res = createResponse();
      const req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/users/',
        decoded: { RoleId: 1 }
      });

      const middlewareStub = {
        callback: () => {}
      };

      sinon.spy(middlewareStub, 'callback');
      Auth.roleExist(req, res, middlewareStub);
      expect(middlewareStub.callback).to.have.been.called;
      done();
    });
  });
});
