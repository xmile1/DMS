import db from '../models';
import Helpers from './Helpers';

const DocumentsCtrl = {

  /**
   * Creates a new document
   * @param {Object} req Request
   * @param {Object} res Response
   * @returns {void} no return
   */
  createDocument(req, res) {
    req.body.OwnerId = req.decoded.UserId;
    db.Documents.create(req.body)
      .then((document) => {
        res.status(201)
        .send(document);
      })
      .catch((err) => {
        res.status(500)
        .send({ message: 'Unknown error occurred' });
      });
  },

  /**
   * Gets all documents depending on who is requesting
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @returns {void} Returns void
   */
  getAllDocuments(req, res) {
    db.Documents.findAll({
      limit: req.query.limit,
      order: '"createdAt" DESC',
    })
      .then((documents) => {
        res.status(200).send(documents);
      });
  },

  /**
   * Gets all documents belonging to a specific user
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @returns {void} Returns void
   */
  getUserDocuments(req, res) {
    db.Documents.findAll({ where: { OwnerId: req.params.id } })
          .then(documents => res.status(200).send(documents));
  },

  /**
   * Gets all documents belonging to a specific user with public documents
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @returns {void} Returns void
   */
  getAllUserDocuments(req, res) {
    db.Documents.findAll({ where: {
      $or: { permission: 'public', OwnerId: req.params.id }
    } })
          .then(documents => res.status(200).send(documents));
  },

  /**
   * Get a specific document
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @returns {void} Returns void
   */
  getDocument(req, res) {
    return res
    .status(200)
    .send(req.body.document);
  },

    /**
     * searchDocuments - Search list of documents where the search term
     * matches the title
     * @param {Object} req Request Object
     * @param {Object} res Response Object
     * @returns {void} Returns void
     */
  searchDocuments(req, res) {
    req.body.entity = 'Documents';
    req.body.columnToSearch = 'title';
    Helpers.search(req, res);
  },

  /**
   * searchUserDocuments - Search list of document where the search term
   * matches the fullnames
   * @param {Object} req Request Object
   * @param {Object} res Response Object
   * @returns {void} Returns void
   */
  searchUserDocuments(req, res) {
    req.body.requester = 'User Documents';
    Helpers.search(req, res);
  },

/**
 * searchUsers - Search list of user where the search term
 * matches the fullnames
 * @param {Object} req Request Object
 * @param {Object} res Response Object
 * @returns {void} Returns void
 */
  searchAllUserDocuments(req, res) {
    req.body.requester = 'All User Documents';
    Helpers.search(req, res);
  },

  /**
   * searchAllDocuments - Search list of user where the search term
   * matches the fullnames
   * @param {Object} req Request Object
   * @param {Object} res Response Object
   * @returns {void} Returns void
   */
  searchAllDocuments(req, res) {
    req.body.entity = 'Documents';
    req.body.columnToSearch = 'title';
    Helpers.search(req, res);
  },

  /**
   * Edit and update a specific document
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @returns {void} Returns void
   */
  updateDocument(req, res) {
    req.body.document.update(req.body)
      .then(updatedDocument => res.status(200).send(updatedDocument));
  },

  /**
   * Delete a specific document
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @returns {void} Returns void
   */
  deleteDoc(req, res) {
    return req.body.document.destroy()
      .then(() => {
        res.status(200)
        .send({ message:
          `Deleted Document with id:${req.params.id}` });
      });
  }
};

export default DocumentsCtrl;
