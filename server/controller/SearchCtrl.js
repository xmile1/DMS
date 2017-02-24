import db from '../models';

const SearchCtrl = {


  /**
   * Search all documents on Admin request only for a specified term
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @returns {Void} Returns Void
   */
  allDocuments(req, res) {
    db.Roles.findById(req.decoded.RoleId)
    .then((role) => {
      if (role.title === 'Admin') {
        const limit = req.query.limit
        && req.query.limit < 1 ? null : req.query.limit;
        db.Documents.findAll({
          limit,
          order: '"createdAt" DESC',
          where: { title: { $iLike: `%${req.params.term}%` } }
        })
          .then((documents) => {
            res.send(documents);
          });
      } else {
        res.status(401)
        .send('Unauthorized Access');
      }
    });
  },

  /**
   * Search all documents belonging to a specific user for a specified term
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @returns {Void} Returns Void
   */
  userDocuments(req, res) {
    db.Roles.findById(req.decoded.RoleId)
    .then((role) => {
      if (role.title === 'Admin' ||
      String(req.decoded.UserId) === req.params.userId) {
        const limit = req.query.limit
        && req.query.limit < 1 ? null : req.query.limit;
        db.Documents.findAll({
          limit,
          order: '"createdAt" DESC',
          where: {
            OwnerId: req.params.userId,
            title: {
              $iLike: `%${req.params.term}%` } } })
          .then(documents => res.send(documents));
      } else {
        res.send({ message: 'Unauthorized Access' });
      }
    });
  },

  /**
   * Search all documents belonging to a specific user
   * with public documents for a specified term
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @returns {Void} Returns Void
   */
  allUserDocuments(req, res) {
    db.Roles.findById(req.decoded.RoleId)
    .then((role) => {
      if (role.title === 'Admin' ||
       String(req.decoded.UserId) === req.params.userId) {
        const limit = req.query.limit
         && req.query.limit < 1 ? null : req.query.limit;
        db.Documents.findAll({
          limit,
          order: '"createdAt" DESC',
          where: {
            $and: { $or: {
              permission: 'public', OwnerId: req.params.userId },
              title: { $iLike: `%${req.params.term}%` } }
          } })
          .then(documents => res.send(documents));
      } else {
        res.send({ message: 'Unauthorized Access' });
      }
    });
  },


  /**
   * allUsers - Search list of user where the search term
   * matches the fullnames
   * @param {Object} req Request Object
   * @param {Object} res Response Object
   * @returns {Void} Returns Void
   */
  allUsers(req, res) {
    const limit = req.query.limit
    && req.query.limit < 1 ? null : req.query.limit;
    db.Users.findAndCountAll({
      limit,
      order: '"createdAt" DESC',
      where: {
        fullNames: { $iLike: `%${req.params.term}%` } } })
      .then((usersList) => {
        res.status(201);
        res.send({ users: usersList.rows, count: usersList.count });
      });
  },

  /**
   * allRoles - Search list of role where the search term
   * matches the Role title
   * @param {Object} req Request Object
   * @param {Object} res Response Object
   * @returns {Void} Returns Void
   */
  allRoles(req, res) {
    const limit = req.query.limit
    && req.query.limit < 1 ? null : req.query.limit;
    db.Roles.findAll({
      limit,
      order: '"createdAt" DESC',
      where: {
        title: { $iLike: `%${req.params.term}%` } } })
    .then((role) => {
      res.status(201)
      .send(role);
    });
  }
};

export default SearchCtrl;
