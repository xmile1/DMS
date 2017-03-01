/* eslint-disable no-unused-expressions */

import chai from 'chai';
import model from '../../models';
import helpers from '../helpers/testHelper';

const expect = chai.expect;
const roleParams = helpers.defaultRole();

describe('Role MODEL:', () => {
  describe('Create Role:', () => {
    let role;
    before((done) => {
      model.Roles.create(roleParams)
        .then((createdRole) => {
          role = createdRole;
          done();
        }).catch((err) => {
          // console.log(err);
        });
    });

    after(() => model.Roles.destroy({ where: { id: role.id } }));

    it('should be able to create a role', () => {
      expect(role).to.exist;
      expect(typeof role).to.equal('object');
    });

    it('should be able to create a role that has a title', () => {
      expect(role.title).to.equal(roleParams.title);
    });
  });

  describe('Role Model Validations', () => {
    describe('Title Field Validation', () => {
      it('requires title field to create a role', (done) => {
        model.Roles.create()
          .catch((error) => {
            expect(/notNull Violation/.test(error.message)).to.be.true;
            done();
          });
      });

      it('ensures a role is unique', (done) => {
        model.Roles.create(roleParams)
          .then(() => {
            model.Roles.create(roleParams)
              .catch((error) => {
                expect(/UniqueConstraintError/.test(error.name)).to.be.true;
                done();
              });
          });
      });
    });
  });
});
