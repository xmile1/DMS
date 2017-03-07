/* eslint-disable no-unused-expressions */

import chai from 'chai';
import model from '../../../server/models';
import helpers from '../helpers/testHelper';

const expect = chai.expect;
const documentParams = helpers.document();

const requiredFields = ['title', 'content', 'OwnerId', 'permission'];

describe('Document MODEL:', () => {
  describe('Create Document', () => {
    let document = {};
    before((done) => {
      model.Documents.create(documentParams)
        .then((createdDocument) => {
          document = createdDocument;
          done();
        });
    });

    after(() => model.Documents.destroy({ where: { id: document.id } }));

    it('should be able to create a document', () => {
      expect(document).to.exist;
      expect(typeof document).to.equal('object');
    });

    it('should create a document with title and content', () => {
      expect(document.title).to.equal(documentParams.title);
      expect(document.content).to.equal(documentParams.content);
    });

    it('should create a document with correct OwnerId', () => {
      expect(document.OwnerId).to.equal(1);
    });

    it('should create a document with published date', () => {
      expect(document.createdAt).to.exist;
    });

    it('should create a document with access set to public', () => {
      expect(document.permission).to.equal('public');
    });
  });

  describe('Document Model Validations', () => {
    let document = {};
    describe('Required Fields Validation', () => {
      document = model.Documents.build(documentParams);
      requiredFields.forEach((field) => {
        it(`requires a ${field} field to create a document`, (done) => {
          document[field] = null;
          document.save()
            .catch((error) => {
              expect(/notNull Violation/.test(error.message)).to.be.true;
              done();
            });
        });
      });
    });

    describe('Unique Fields Validation', () => {
      it('ensures a document is unique', (done) => {
        model.Documents.create(documentParams)
          .then(() => {
            model.Documents.create(documentParams).catch((error) => {
              expect(/UniqueConstraintError/.test(error.name)).to.be.true;
              done();
            });
          });
      });
    });
  });
});
