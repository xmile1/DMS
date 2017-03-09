/* eslint-disable no-unused-expressions */
import chai from 'chai';
import model from '../../models';
import helper from '../helpers/testHelper';

const expect = chai.expect;
const userParams = helper.user();
const roleParams = helper.regularRole;

const requiredFields = ['fullNames', 'email',
  'password', 'roleId'
];
const uniqueFields = ['email'];

describe('User MODEL', () => {
  describe('Create User', () => {
    let user = {};

    before((done) => {
      model.Users.create(userParams)
        .then((createdUser) => {
          user = createdUser;
          done();
        });
    });

    after(() => model.Users.destroy({ where: { id: user.id } }));

    it('should be able to create a user', () => {
      expect(user).to.exist;
      expect(typeof user).to.equal('object');
    });

    it('should create a user with first name & last name', () => {
      expect(user.firstname).to.equal(userParams.firstname);
      expect(user.lastname).to.equal(userParams.lastname);
    });

    it('should create a user with a valid email', () => {
      expect(user.email).to.equal(userParams.email);
    });

    it('should create a user with hashed password', () => {
      expect(user.password).to.not.equal(userParams.password);
    });

    it('should create a user with a defined role', (done) => {
      model.Users.findById(user.id, {
        include: [model.Roles]
      })
      .then((foundUser) => {
        expect(foundUser.Role.title).to.equal('Regular');
        done();
      });
    });
  });
});

describe('User Model Validation', () => {
  let user = {};

  describe('Required Fields', () => {
    user = model.Users.build(userParams);
    requiredFields.forEach((field) => {
      it(`requires ${field} field to create a user`, (done) => {
        user[field] = null;
        user.save()
          .catch((error) => {
            expect(/notNull Violation/.test(error.message)).to.be.true;
            done();
          });
      });
    });
  });

  describe('Unique Fields Validation', () => {
    uniqueFields.forEach((field) => {
      it(`requires ${field} field to be Unique`, (done) => {
        model.Users.create(userParams)
          .then((createdUser) => {
            user = createdUser;
            model.Users.create(userParams)
              .catch((error) => {
                expect(/UniqueConstraintError/.test(error.name)).to.be.true;
                done();
              });
          });
      });
    });
  });

  describe('Password Validation', () => {
    before(() => model.Users.destroy({ where: { id: user.id } }));
    it('should be valid if compared', (done) => {
      model.Users.build(userParams).save()
        .then((createdUser) => {
          expect(createdUser.validPassword(userParams.password)).to.be.true;
          done();
        });
    });
  });
});
