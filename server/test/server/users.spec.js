import chai from 'chai';
import supertest from 'supertest';
import helper from './testHelper';
import app from '../../config/app';

const request = supertest.agent(app);
const expect = chai.expect;
const testUser = helper.user();
let adminDetails;
let regularDetails;
let testDetails;

describe('Users', () => {
  describe('Authenticate', () => {
    it('should create a new user for passed valid credentials', (done) => {
      request.post('/api/users')
    .set({ 'Content-Type': 'application/x-www-form-urlencoded' })
      .type('form')
      .send(testUser)
      .end((err, res) => {
        expect(res.statusCode).to.eql(201);
        expect(res.body.user).to.have.property('fullNames');
        expect(res.body.user).to.have.property('username');
        expect(res.body.user).to.have.property('email');
        expect(res.body.user).to.have.property('RoleId');
        done();
      });
    });
    it('Should only allow for creation of unique users', (done) => {
      request.post('/api/users')
      .send(testUser)
      .expect(409)
      .end((err, res) => {
        expect(res.body.message.includes('already exists')).to.equal(true);
        done();
      });
    });
    it('Should fail for an invalid email input', (done) => {
      const user = helper.user();
      user.email = 'bademail';
      request.post('/api/users')
      .send(user)
      .expect(400)
      .end((err, res) => {
        expect(res.body.message.includes('Error')).to.equal(true);
        done();
      });
    });

    it('new users should be assigned a default role(id=2,Registered)',
     (done) => {
       request.post('/api/users')
      .send(helper.noRoleUser())
      .expect(201)
      .end((err, res) => {
        expect(res.body.user).to.have.property('RoleId');
        expect(res.body.user.RoleId).to.equal(2);
        done();
      });
     });

    it('Should login a user with correct credentials', (done) => {
      const user = helper.user();
      request.post('/api/users')
    .type('form')
    .send(user)
    .end(() => {
      request.post('/api/users/login')
      .send(user)
      .expect(200)
      .end((err, res) => {
        expect(res.body.user).not.to.equal(null);
        expect(res.body.user.username).not.to.equal(null);
        done();
      });
    });
    });

    it('Should return a token on successful login', (done) => {
      const user = helper.user();
      request.post('/api/users')
    .type('form')
    .send(user)
    .end(() => {
      request.post('/api/users/login')
      .send(user)
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.have.property('token');
        expect(res.body.token).not.to.equal(null);
        done();
      });
    });
    });

    it('Should not return hashed password on successful login', (done) => {
      const user = helper.user();
      request.post('/api/users')
    .type('form')
    .send(user)
    .end(() => {
      request.post('/api/users/login')
      .send(user)
      .expect(200)
      .end((err, res) => {
        expect(res.body.user.password).to.equal(undefined);
        expect(res.body.token).not.to.equal(null);
        done();
      });
    });
    });

    it('should deny access for invalid login details ', (done) => {
      request.post('/api/users/login')
    .send({ username: 'amss', password: 'qaole' })
    .expect(401)
    .end((err, res) => {
      expect(res.body.message).to.equal('Authentication failed!');
      done();
    });
    });
  });

  describe('Get Users', () => {
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

    it('should not allow un-authenticated users access users list',
     (done) => {
       request.get('/api/users')
          .end((err, res) => {
            expect(res.status).to.equal(401);
            expect(res.body.message)
            .to.equal('Unauthorized Access');
            done();
          });
     });

    it('should allow admin users access all users list', (done) => {
      request.get('/api/users')
    .set({ 'x-access-token': adminDetails.token })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.instanceOf(Array);
        done();
      });
    });


    it('should deny NON admin users access to all users list', (done) => {
      request.get('/api/users')
        .set({ 'x-access-token': regularDetails.token })
          .end((err, res) => {
            expect(res.status).to.equal(403);
            expect(res.body.message)
            .to.equal('Admin access is required!');
            done();
          });
    });

    it('should not allow un-authenticated users access user by email',
     (done) => {
       request.get(`/api/users/${regularDetails.user.email}`)
          .end((err, res) => {
            expect(res.status).to.equal(401);
            expect(res.body.message)
            .to.equal('Unauthorized Access');
            done();
          });
     });

    it('should allow admin users access user by email', (done) => {
      request.get(`/api/users/${regularDetails.user.email}`)
    .set({ 'x-access-token': adminDetails.token })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.email).to.be.equal(regularDetails.user.email);
        done();
      });
    });


    it('should allow owner access to his details', (done) => {
      request.get(`/api/users/${regularDetails.user.email}`)
        .set({ 'x-access-token': regularDetails.token })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.email).to.be.equal(regularDetails.user.email);
            done();
          });
    });

    it('should return an error message if record doesnt exist', (done) => {
      request.get('/api/users/bademail')
    .set({ 'x-access-token': adminDetails.token })
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.message).to.be.equal('User bademail cannot be found');
        done();
      });
    });
  });

  describe('Update User', () => {
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

    it('should fail for un-authenticated users ',
     (done) => {
       request.put(`/api/users/${regularDetails.user.id}`)
       .send(helper.userFullNames())
          .end((err, res) => {
            expect(res.status).to.equal(401);
            expect(res.body.message)
            .to.equal('Unauthorized Access');
            done();
          });
     });

    it('should allow admin users update a user', (done) => {
      request.put(`/api/users/${regularDetails.user.id}`)
    .set({ 'x-access-token': adminDetails.token })
    .send(helper.userFullNames())
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message)
        .to.be.equal(`${regularDetails.user.id} updated`);
        done();
      });
    });


    it('should deny NON admin users update a user', (done) => {
      request.put(`/api/users/${testDetails.user.id}`)
    .set({ 'x-access-token': regularDetails.token })
    .send(helper.userFullNames())
      .end((err, res) => {
        expect(res.status).to.equal(401);
        done();
      });
    });

    it('should allow a user update his details', (done) => {
      request.put(`/api/users/${regularDetails.user.id}`)
    .set({ 'x-access-token': regularDetails.token })
    .send(helper.userFullNames())
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.message)
        .to.be.equal(`${regularDetails.user.id} updated`);
        done();
      });
    });
  });

  describe('Delete User', () => {
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

    it('should fail for un-authenticated users ',
     (done) => {
       request.delete(`/api/users/${regularDetails.user.id}`)
          .end((err, res) => {
            expect(res.status).to.equal(401);
            expect(res.body.message)
            .to.equal('Unauthorized Access');
            done();
          });
     });

    it('should allow admin users delete a user', (done) => {
      request.delete(`/api/users/${regularDetails.user.id}`)
    .set({ 'x-access-token': adminDetails.token })
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body.message)
        .to.be.equal(`${regularDetails.user.id} has been deleted`);
        done();
      });
    });


    it('should deny NON admin users delete a user', (done) => {
      request.delete(`/api/users/${testDetails.user.id}`)
    .set({ 'x-access-token': regularDetails.token })
    .send(helper.userFullNames())
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.message)
        .to.equal('Unauthorized Access');
        done();
      });
    });

    it('should deny a user rom deleting himself', (done) => {
      request.delete(`/api/users/${regularDetails.user.id}`)
    .set({ 'x-access-token': regularDetails.token })
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.message)
        .to.equal('Unauthorized Access');
        done();
      });
    });
  });
});
