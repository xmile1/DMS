import chai from 'chai';
import supertest from 'supertest';
import helper from '../helpers/testHelper';
import app from '../../config/app';


const request = supertest(app);
const expect = chai.expect;
const documents = [];
let adminDetails;
let regularDetails;

for (let i = 5; i >= 0; i = -i) {
  documents.push(helper.user());
}

describe('Search', () => {
  before((done) => {
    request.post('/api/users/login')
      .type('form')
      .send({ username: 'uyiosa', password: 'uyiosa' })
      .end((err, res) => {
        adminDetails = res.body;
        request.post('/api/users/login')
          .type('form')
          .send({ username: 'uyiosa2', password: 'uyiosa2' })
          .end((err, res) => {
            regularDetails = res.body;
            done();
          });
      });
  });


  describe('Search document', () => {
    it('Should return users document based on the search criteria', (done) => {
      request.get('/api/search/document/1/?term=special')
        .set({ 'x-access-token': adminDetails.token })
        .end((err, res) => {
          expect(res.body.result[0].title.includes('special'));
          done();
        });
    });

    it('Should return user`s and public documents based on search criteria',
     (done) => {
       request.get('/api/search/documents/1/?term=something')
        .set({ 'x-access-token': adminDetails.token })
        .end((err, res) => {
          expect(res.body.result[0].title.includes('something'));
          done();
        });
     });
    it('Should return a list of documents based on search criteria', (done) => {
      request.get('/api/search/documents/?term=something')
        .set({ 'x-access-token': adminDetails.token })
        .end((err, res) => {
          expect(res.body.result[0].title.includes('something'));
          done();
        });
    });

    it('Should return pagination details when limits and offset is passed',
     (done) => {
       request.get('/api/search/documents/?term=special&limit=1&offset=1')
        .set({ 'x-access-token': adminDetails.token })
        .end((err, res) => {
          expect(res.body.metadata)
          .to.be.eql({ count: 2, pages: 2, currentPage: 2, pageSize: 1 });
          done();
        });
     });

    it('Should return null metadata for invalid limits and offset',
       (done) => {
         request.get('/api/search/documents/?term=special&limit=-1&offset=-1')
          .set({ 'x-access-token': adminDetails.token })
          .end((err, res) => {
            expect(res.body.metadata)
            .to.be.eql(null);
            done();
          });
       });

    it('Should fail for non admin users', (done) => {
      request.get('/api/search/documents/?term=something')
            .set({ 'x-access-token': regularDetails.token })
        .end((err, res) => {
          expect(res.status).to.be.equal(403);
          done();
        });
    });

    it('Should fail user document search for non owner of the document'
    , (done) => {
      request.get('/api/search/document/1/?term=something')
        .set({ 'x-access-token': regularDetails.token })
        .end((err, res) => {
          expect(res.body.message).to.be.equal('Unauthorized Access');
          done();
        });
    });

    it('Should fail user documents search for non owner of the document'
    , (done) => {
      request.get('/api/search/documents/1/?term=something')
        .end((err, res) => {
          expect(res.body.message).to.be.equal('Unauthorized Access');
          done();
        });
    });


    describe('Search Users', () => {
      it('Should return a list of users based on search criteria', (done) => {
        request.get('/api/search/users/?term=uyi')
        .set({ 'x-access-token': adminDetails.token })
        .end((err, res) => {
          expect(res.body.result[0].fullNames.includes('uyiosa'));
          done();
        });
      });

      it('Should return error for non-admin search', (done) => {
        request.get('/api/search/users/?term=uyi')
        .set({ 'x-access-token': regularDetails.token })
        .end((err, res) => {
          expect(res.body.message.includes('Admin access is required!'));
          done();
        });
      });
      it('Should return user pagination details for passed limits and offset',
       (done) => {
         request.get('/api/search/users/?term=uyi&limit=1&offset=1')
          .set({ 'x-access-token': adminDetails.token })
          .end((err, res) => {
            expect(res.body.metadata)
            .to.be.eql({ count: 2, pages: 2, currentPage: 2, pageSize: 1 });
            done();
          });
       });
      it('Should return null metadata for invalid limits and offset',
         (done) => {
           request.get('/api/search/users/?term=dmin&limit=-1&offset=-1')
            .set({ 'x-access-token': adminDetails.token })
            .end((err, res) => {
              expect(res.body.metadata)
              .to.be.eql(null);
              done();
            });
         });
    });

    describe('Search Roles', () => {
      it('Should return a list of roles based on search criteria', (done) => {
        request.get('/api/search/roles/?term=dmin')
        .set({ 'x-access-token': adminDetails.token })
        .end((err, res) => {
          expect(res.body.result[0].title).to.equal('Admin');
          done();
        });
      });

      it('Should return roles pagination details for passed limits and offset',
       (done) => {
         request.get('/api/search/roles/?term=dmin&limit=1&offset=1')
          .set({ 'x-access-token': adminDetails.token })
          .end((err, res) => {
            expect(res.body.metadata)
            .to.be.eql({ count: 1, pages: 1, currentPage: 2, pageSize: 0 });
            done();
          });
       });

      it('Should return null metadata for invalid limits and offset',
        (done) => {
          request.get('/api/search/roles/?term=dmin&limit=-1&offset=-1')
           .set({ 'x-access-token': adminDetails.token })
           .end((err, res) => {
             expect(res.body.metadata)
             .to.be.eql(null);
             done();
           });
        });

      it('Should return error for non-admin search', (done) => {
        request.get('/api/search/roles/?term=dmin')
        .set({ 'x-access-token': regularDetails.token })
        .end((err, res) => {
          expect(res.body.message.includes('Admin access is required!'));
          done();
        });
      });
    });
  });
});
