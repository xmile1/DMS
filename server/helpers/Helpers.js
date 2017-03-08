import validator from 'validator';
import db from '../models';

/**
 * controllers helper functions
 */
const Helpers = {
  /**
   * isAdmin - Verify if the requester is an admin
   * @param  {Object} req Request Object
   * @param  {Object} res Response Object
   * @returns {Boolean} returns true or false
   */
  isAdmin(req, res) {
    return req.decoded.RoleId === 1;
  },


  /**
   * validateInput - checks if input is a negative number or not a number
   * @param {String} data data to be tested
   * @returns {String|null}  valid input or null
   */
  validateInput(data) {
    if (!data) return 0;
    return data
    && (data < 0 || isNaN(data)) ?
     0 : data;
  },

  /**
   * validatelimit - checks if input is a negative number or not a number
   * @param {String} data data to be tested
   * @returns {String|null}  valid input or null
   */
  validateLimit(data) {
    if (!data) return 10;
    return data
    && (data < 0 || isNaN(data)) ?
     10 : data;
  },


  /**
   * search - Search the entity based on request query term
   * @param {Object} req Request Object
   * @param {Object} res Response Object
   * @returns {void} returns response based on search
   */
  search(req, res) {
    return new Promise((resolve, reject) => {
      const term = req.query.term;
      const offset = Helpers.validateInput(req.query.offset);
      const limit = Helpers.validateLimit(req.query.limit);

      let columnToSearch = {};
      columnToSearch[req.body.columnToSearch] = { $iLike: `%${term}%` };
      if (req.body.searchQuery) columnToSearch = req.body.searchQuery;
      db[req.body.entity].findAndCountAll({
        limit,
        offset,
        order: '"createdAt" DESC',
        where: columnToSearch })
    .then((result) => {
      let pages = Math.ceil(result.count / limit) ?
       Math.ceil(result.count / limit) : undefined;

      let currentPage = Math.floor(offset / limit) ?
       Math.floor(offset / limit) + 1 : undefined;

      if (result.count < limit) pages = 1;
      if (offset === '0') currentPage = 1;

      let metadata = { count: result.count,
        pages,
        currentPage,
        pageSize: result.rows.length };
      if (result.rows.length === 0) metadata = { count: result.count };

      resolve({ result: result.rows, metadata });
    });
    });
  },


  /**
   * isOwner - checks if a user is the owner of a document
   * @param {Object} req      Request object
   * @param {Object} res      Response object
   * @param {Object} document the document to compare with
   * @returns {Boolean} returns true or false
   */
  isOwner(req, res, document) {
    const itemToCheck = document ? String(document.OwnerId) : req.params.id;
    return String(req.decoded.UserId) === itemToCheck;
  },


  /**
   * isRelatedToDocument - check if a user is related to a document
   * @param {Object} req      Request object
   * @param {Object} res      Response object
   * @param {Object} document the document to verify with
   * @param {Object} role     the user's role object
   * @returns {Boolean} returns true or false
   */
  isRelatedToDocument(req, res, document, role) {
    return (document.permission.indexOf(role.title) > -1 && role.write);
  },

  /**
   * isPublic - checks if a document is public
   * @param {Object} req      Request object
   * @param {Object} res      Response object
   * @returns {Boolean} returns true or false
   */
  isPublic(req, res) {
    return req.body.document.permission === 'public';
  }

};

export default Helpers;
