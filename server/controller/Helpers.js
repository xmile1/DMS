import validator from 'validator';
import db from '../models';

/**
 * controllers helper functions
 */
const Helpers = {
  /**
   * isAdmin - Verify if the requester is an admin
   *
   * @param  {Object} req Request Object
   * @param  {Object} res Response Object
   * @returns {Boolean} returns true or false
   */
  isAdmin(req, res) {
    return req.decoded.RoleId === 1;
  },
  validateInput(data) {
    return data
    && (data < 1 || isNaN(data)) ?
     null : data;
  },
  search(req, res) {
    const term = req.query.term;
    const offset = Helpers.validateInput(req.query.offset);
    const limit = Helpers.validateInput(req.query.limit);

    let columnToSearch = {};
    columnToSearch[req.body.columnToSearch] = { $iLike: `%${term}%` };
    if (req.body.requester) {
      req.body.entity = 'Documents';
      req.body.columnToSearch = 'title';
      if (Helpers.isAdmin(req, res) || Helpers.isOwner(req, res)) {
        if (req.body.requester === 'All User Documents') {
          columnToSearch = {
            $and: { $or: {
              permission: 'public', OwnerId: req.params.userId },
              title: { $iLike: `%${req.query.term}%` } }
          };
        }

        if (req.body.requester === 'User Documents') {
          columnToSearch = {
            OwnerId: req.params.userId,
            title: {
              $iLike: `%${req.query.term}%` }
          };
        }
      } else {
        return res.send({ message: 'Unauthorized Access' });
      }
    }


    db[req.body.entity].findAndCountAll({
      limit,
      offset,
      order: '"createdAt" DESC',
      where: columnToSearch })
    .then((result) => {
      const metadata = limit && offset ? { count: result.count,
        pages: Math.ceil(result.count / limit),
        currentPage: Math.floor(offset / limit) + 1 } : null;
      res.status(200).send({ result: result.rows, metadata });
    });
  },

  isOwner(req, res, document) {
    const itemToCheck = document ? String(document.OwnerId) : req.params.id;
    return String(req.decoded.UserId) === itemToCheck;
  },
  isRelatedToDocument(req, res, document, role) {
    return (document.permission.indexOf(role.title) > -1 && role.write);
  },
  isPublic(req, res) {
    return req.body.document.permission === 'public';
  }

};

export default Helpers;
