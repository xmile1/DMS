import jwt from 'jsonwebtoken';
import db from '../models';

const secret = process.env.SECRET || 'just another open secret';
const Auth = {

  /**
   * verifyToken - Verifies Token sent from the consumer
   * @param {object} req  request Object
   * @param {object} res  response Object
   * @param {callback} next callback to the next middleware or function
   * @returns {Object | void} token validity response | void
   */
  verifyToken(req, res, next) {
    const token = req.headers.authorization || req.headers['x-access-token'];
    if (!token) {
      return res.status(401).send({ message: 'Unauthorized Access' });
    }

    db.InvalidTokens.find({ where: { token } })
    .then((InvalidTokens) => {
      if (InvalidTokens) {
        return res.status(401)
      .send({ message: 'Invalid Token' });
      }
    });

    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: 'Invalid Token' });
      }
      req.decoded = decoded;
      next();
    });
  },
  /**
   * verifyAdmin - Verifies if user is an Admin
   * @param {object} req request Object
   * @param {object} res response Object
   * @param {callback} next callback to the next middleware or function
   * @returns {Object | void} status response  | void
   */
  verifyAdmin(req, res, next) {
    db.Roles.findById(req.decoded.RoleId)
       .then((role) => {
         if (role.title === 'Admin') {
           next();
         } else {
           return res.status(403)
           .send({ message: 'Admin access is required!' });
         }
       });
  },

  /**
   * checkPassedId - check if a req.body.id is passed
   * @param {object} req request Object
   * @param {object} res response Object
   * @param {callback} next callback to the next middleware or function
   * @returns {Object | void} status response | void
   */
  checkPassedId(req, res, next) {
    if (req.body.id) {
      return res.status(403)
      .send({ message: 'you cannot pass an Id' });
    }
    next();
  },

  /**
   * documentExist - checks if a document exist
   * @param {object} req request Object
   * @param {object} res response Object
   * @param {callback} next callback to the next middleware or function
   * @returns {Object | void} status response  | void
   */
  documentExist(req, res, next) {
    db.Documents.findById(req.params.id)
     .then((document) => {
       if (!document) {
         return res.status(404)
           .send({
             message: `Document with id: ${req.params.id} does not exit`
           });
       }
       req.body.document = document;
       next();
     });
  },


  /**
   * documentRight - Check if user have the neccesary rights to a document
   * @param {object} req request Object
   * @param {object} res response Object
   * @param {callback} next callback to the next middleware or function
   * @returns {Object | void} status response  | void
   */
  documentRight(req, res, next) {
    db.Roles.findById(req.decoded.RoleId)
      .then((role) => {
        const itemToCheck = req.body.document ?
          String(req.body.document.OwnerId) : req.params.id;
        if (req.decoded.RoleId === 1
        || String(req.decoded.UserId) === itemToCheck
        || (req.body.document.permission.indexOf(role.title) > -1
        && role.write)) {
          return next();
        }
        return res.status(403)
      .send({ message: 'Unauthorized Access to this Document' });
      });
  },


  /**
   * fullDocumentRight - Checks if a user has neccesary rights including public
   * document access right
   * @param {object} req request Object
   * @param {object} res response Object
   * @param {callback} next callback to the next middleware or function
   * @returns {Object | void} status response  | void
   */
  fullDocumentRight(req, res, next) {
    db.Roles.findById(req.decoded.RoleId)
      .then((role) => {
        const itemToCheck = req.body.document ?
          String(req.body.document.OwnerId) : req.params.id;
        if (req.decoded.RoleId === 1
        || String(req.decoded.UserId) === itemToCheck
        || req.body.document.permission === 'public'
        || (req.body.document.permission.indexOf(role.title) > -1
        && role.write)) {
          return next();
        }
        return res.status(403)
      .send({ message: 'Unauthorized Access to this Document' });
      });
  }

};

export default Auth;
