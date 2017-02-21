import chai from 'chai';
import supertest from 'supertest';
import helper from './testHelper';
import app from '../../config/app';


const request = supertest(app);
const expect = chai.expect;
let adminDetails;
let regularDetails;
let testDetails;

describe('Document', () => {
  before((done) => {
    request.post('/api/users')
      .type('form')
      .send(helper.admin())
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

  describe('Create document', () => {
    it('Should create a document for passed valid input', (done) => {
      request.post('/api/documents')
        .set({ 'x-access-token': adminDetails.token })
        .send(helper.document())
        .expect(201)
        .end((err, res) => {
          expect(res.body).to.have.property('title');
          expect(res.body).to.have.property('content');
          expect(res.body).to.have.property('OwnerId');
          done();
        });
    });

    it('Should have the date of creation defined', (done) => {
      request.post('/api/documents')
        .set({ 'x-access-token': adminDetails.token })
        .send(helper.document())
        .expect(201)
        .end((err, res) => {
          expect(res.body).to.have.property('createdAt');
          expect(res.body.createdAt).not.to.equal(null);
          done();
        });
    });

    it('Should set its permission to public by default', (done) => {
      request.post('/api/documents')
        .set({ 'x-access-token': adminDetails.token })
        .send(helper.documentNoPermission())
        .expect(201)
        .end((err, res) => {
          expect(res.body).to.have.property('permission');
          expect(res.body.permission).to.equal('Public');
          done();
        });
    });

    it('Should fail to create a document for passed invalid input', (done) => {
      request.post('/api/documents')
        .set({ 'x-access-token': adminDetails.token })
        .send({ title: null })
        .expect(400)
        .end((err, res) => {
          expect(res.body[0].message).to.equal('title cannot be null');
          done();
        });
    });
  });

  describe('Get document', () => {
    let document;
    before((done) => {
      request.post('/api/documents')
        .set({ 'x-access-token': regularDetails.token })
        .send(helper.documentWithArg('Private', 1))
        .end((err, res) => {
          document = res.body;
          done();
        });
    });

    it('Should return a private document only to its owner', (done) => {
      request.get(`/api/documents/${document.id}`)
        .set({ 'x-access-token': testDetails.token })
        .expect(403).end((err, res) => {
          expect(typeof res.body).to.equal('object');
          expect(res.body.message)
          .to.equal('Unauthorized Access to this Document');
          done();
        });
    });

    it('Should get all documents for a specific user', (done) => {
      request.get(`/api/users/${regularDetails.user.id}/documents`)
        .set({ 'x-access-token': regularDetails.token })
        .expect(200)
        .end((err, res) => {
          expect(Array.isArray(res.body)).to.equal(true);
          expect(res.body[0].OwnerId).to.equal(regularDetails.user.id);
          done();
        });
    });

    it('Should return all documents to the admin', (done) => {
      request.get('/api/documents')
        .set({ 'x-access-token': adminDetails.token })
        .expect(200)
        .end((err, res) => {
          expect(Array.isArray(res.body)).to.equal(true);
          expect(res.body.length).to.be.greaterThan(3);
          done();
        });
    });

    it('Should return documents starting from the most recent', (done) => {
      request.get('/api/documents/')
        .set({ 'x-access-token': adminDetails.token })
        .expect(200).end((err, res) => {
          if (err) return done(err);
          expect(Array.isArray(res.body)).to.equal(true);
          expect(res.body[0].id).not.to.equal(1);
          done();
        });
    });

    it('Should not return all documents to a non admin', (done) => {
      request.get('/api/documents')
        .set({ 'x-access-token': regularDetails.token })
        .expect(200).end((err, res) => {
          expect(res.body.message).to.equal('Admin access is required!');
          done();
        });
    });

    it('Should return a private document to the admin', (done) => {
      request.get(`/api/documents/${document.id}`)
        .set({ 'x-access-token': adminDetails.token })
        .expect(200).end((err, res) => {
          expect(typeof res.body).to.equal('object');
          expect(res.body.permission).to.equal('Private');
          expect(res.body.title).to.equal(document.title);
          done();
        });
    });

    it('Should fail if a document does not exist', (done) => {
      request.get('/api/documents/1000')
        .set({ 'x-access-token': adminDetails.token })
        .expect(404).end((err, res) => {
          expect(typeof res.body).to.equal('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message)
            .to.equal('Document with id: 1000 does not exit');
          done();
        });
    });
  });

  describe('Update document', () => {
    let document;
    before((done) => {
      request.post('/api/documents')
        .set({ 'x-access-token': regularDetails.token })
        .send(helper.documentWithArg('Private', regularDetails.user.id))
        .end((err, res) => {
          document = res.body;
          done();
        });
    });

    it('Should edit and update a document by the owner', (done) => {
      request.put(`/api/documents/${document.id}`)
        .set({ 'x-access-token': regularDetails.token })
        .send({ title: 'New title' })
        .expect(200)
        .end((err, res) => {
          expect(typeof res.body).to.equal('object');
          expect(res.body.title).to.equal('New title');
          done();
        });
    });

    it('Should fail if the document is not owned by you', (done) => {
      request.put(`/api/documents/${document.id}`)
        .set({ 'x-access-token': testDetails.token })
        .send({ title: 'doc title updated' })
        .expect(403)
        .end((err, res) => {
          expect(typeof res.body).to.equal('object');
          expect(res.body.message)
            .to.equal('Unauthorized Edit Access');
          done();
        });
    });

    it('Should fail if the document does not exist', (done) => {
      request.put('/api/documents/10000')
        .set({ 'x-access-token': adminDetails.token })
        .send({ title: 'doc title updated' })
        .expect(404)
        .end((err, res) => {
          expect(typeof res.body).to.equal('object');
          expect(res.body.message)
            .to.equal('Document does not exist');
          done();
        });
    });
  });

  describe('Delete a document', () => {
    let document;
    before((done) => {
      request.post('/api/documents')
        .set({ 'x-access-token': regularDetails.token })
        .send(helper.documentWithArg('Private', regularDetails.id))
        .end((err, res) => {
          document = res.body;
          done();
        });
    });
    it('Should fail if document is not owned by you', (done) => {
      request.delete(`/api/documents/${document.id}`)
        .set({ 'x-access-token': testDetails.token })
        .expect(403)
        .end((err, res) => {
          expect(typeof res.body).to.equal('object');
          expect(res.body.message)
            .to.equal('Unauthorized Delete Access');
          done();
        });
    });

    it('Should fail if document does not exist', (done) => {
      request.delete('/api/documents/100000')
        .set({ 'x-access-token': regularDetails.token })
        .expect(404)
        .end((err, res) => {
          expect(typeof res.body).to.equal('object');
          expect(res.body.message)
            .to.equal('Document does not exist');
          done();
        });
    });
    it('Should delete a document', (done) => {
      request.delete(`/api/documents/${document.id}`)
        .set({ 'x-access-token': regularDetails.token })
        .expect(200)
        .end((err, res) => {
          expect(typeof res.body).to.equal('object');
          expect(res.body.message)
          .to.equal(`Deleted Document with id:${document.id}`);
          done();
        });
    });
  });
});
