import chai from 'chai';
import supertest from 'supertest';
import helper from '../helpers/testHelper';
import app from '../../config/app';

const request = supertest.agent(app);
const expect = chai.expect;

let adminDetails;
let regularDetails;

describe('Role', () => {
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
              done();
            });
        });
  });

  describe('Create role', () => {
    const newRole = helper.defaultRole();
    it('Ensures an admin can create a new role', (done) => {
      request.post('/api/roles')
        .set({ 'x-access-token': adminDetails.token })
        .send(newRole)
        .expect(201)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.title).to.equal(newRole.title);
          done();
        });
    });

    it('Should have a unique role title', (done) => {
      request.post('/api/roles')
        .set({ 'x-access-token': adminDetails.token })
        .send(newRole)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.message)
          .to.equal(`${newRole.title} already exists`);
          done();
        });
    });

    it('Should fail for a non admin', (done) => {
      request.post('/api/roles')
        .set({ 'x-access-token': regularDetails.token })
        .send({ title: 'new role' })
        .expect(403)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.message).to.equal('Admin access is required!');
          done();
        });
    });

    it('Should fail if a title is null', (done) => {
      request.post('/api/roles')
        .set({ 'x-access-token': adminDetails.token })
        .send({ title: null })
        .end((err, res) => {
          if (err) return done(err);
          expect(500);
          expect(res.body.message).to.equal('error occurred');
          done();
        });
    });
  });

  describe('Get roles', () => {
    it('Should return all roles to an admin', (done) => {
      request.get('/api/roles')
        .set({ 'x-access-token': adminDetails.token })
        .expect(200).end((err, res) => {
          expect(Array.isArray(res.body)).to.equal(true);
          expect(res.body[0].title).to.equal('Admin');
          expect(res.body[1].title).to.equal('Regular');
          done();
        });
    });

    it('Should fail to return all roles to a non admin', (done) => {
      request.get('/api/roles')
        .set({ 'x-access-token': regularDetails.token })
        .expect(403)
        .end((err, res) => {
          expect(typeof res.body).to.equal('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message)
            .to.equal('Admin access is required!');
          done();
        });
    });

    it('Should return a specific role', (done) => {
      request.get('/api/roles/1')
        .set({ 'x-access-token': adminDetails.token })
        .expect(200).end((err, res) => {
          expect(typeof res.body).to.equal('object');
          expect(res.body.title).to.equal('Admin');
          expect(res.body.id).to.equal(1);
          done();
        });
    });

    it('Should fail if a role does not exist', (done) => {
      request.get('/api/roles/5000')
        .set({ 'x-access-token': adminDetails.token })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message)
            .to.equal('Role with Id:5000 does not exist');
          done();
        });
    });
  });
  describe('Update role', () => {
    it('Should edit and update a role', (done) => {
      request.put('/api/roles/3')
        .set({ 'x-access-token': adminDetails.token })
        .send({ title: 'updated role' })
        .expect(200)
        .end((err, res) => {
          expect(res.body.data.title).to.equal('updated role');
          expect(res.body.message).to.equal('3 updated');
          done();
        });
    });

    it('Should fail to update a role by a non admin', (done) => {
      request.put('/api/roles/3')
        .set({ 'x-access-token': regularDetails.token })
        .send({ title: 'updated role' })
        .expect(403)
        .end((err, res) => {
          expect(typeof res.body).to.equal('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message)
            .to.equal('Admin access is required!');
          done();
        });
    });

    it('Should fail if a role does not exist', (done) => {
      request.put('/api/roles/10')
        .set({ 'x-access-token': adminDetails.token })
        .send({ title: 'updated role' })
        .expect(404)
        .end((err, res) => {
          expect(res.body.message)
            .to.equal('Role with Id:10 does not exist');
          done();
        });
    });
    it('Should fail if role title already exist', (done) => {
      request.put('/api/roles/2')
        .set({ 'x-access-token': adminDetails.token })
        .send({ title: 'Admin' })
        .expect(500)
        .end((err, res) => {
          expect(res.body.message.includes('Error Updating Role'));
          done();
        });
    });
  });

  describe('Delete role', () => {
    it('Should fail to delete a role by a non admin', (done) => {
      request.delete('/api/roles/3')
        .set({ 'x-access-token': regularDetails.token })
        .expect(403)
        .end((err, res) => {
          expect(typeof res.body).to.equal('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message)
            .to.equal('Admin access is required!');
          done();
        });
    });

    it('Should delete a role', (done) => {
      request.delete('/api/roles/3')
        .set({ 'x-access-token': adminDetails.token })
        .expect(200).end((err, res) => {
          expect(typeof res.body).to.equal('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Role 3 deleted');
          done();
        });
    });

    it('Should fail if a role does not exist', (done) => {
      request.delete('/api/roles/10000')
        .set({ 'x-access-token': adminDetails.token })
        .expect(404).end((err, res) => {
          expect(typeof res.body).to.equal('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message)
            .to.equal('Role with Id:10000 does not exist');
          done();
        });
    });
  });
});
