import db from '../models';

const DocumentsCtrl = {

  /**
   * Creates a new document
   * @param {Object} req Request
   * @param {Object} res Response
   * @returns {Void} no return
   */
  createDocument(req, res) {
    req.body.OwnerId = req.decoded.UserId;
    db.Documents.create(req.body)
      .then((document) => {
        res.status(201)
        .send(document);
      })
      .catch((err) => {
        res.status(400)
        .send(err.errors);
      });
  },

  /**
   * Gets all documents depending on who is requesting
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @returns {Void} Returns Void
   */
  getAllDocuments(req, res) {
    db.Roles.findById(req.decoded.RoleId)
    .then((role) => {
      if (role.title === 'Admin') {
        db.Documents.findAll({
          limit: req.query.limit,
          order: '"createdAt" DESC',
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
   * Gets all documents belonging to a specific user
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @returns {Void} Returns Void
   */
  getUserDocuments(req, res) {
    db.Roles.findById(req.decoded.RoleId)
    .then((role) => {
      if (role.title === 'Admin' ||
      String(req.decoded.UserId) === req.params.id) {
        db.Documents.findAll({ where: { OwnerId: req.params.id } })
          .then(documents => res.send(documents));
      } else {
        res.send({ message: 'Unauthorized Access' });
      }
    });
  },

  /**
   * Gets all documents belonging to a specific user with public documents
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @returns {Void} Returns Void
   */
  getAllUserDocuments(req, res) {
    db.Roles.findById(req.decoded.RoleId)
    .then((role) => {
      if (role.title === 'Admin' ||
      String(req.decoded.UserId) === req.params.id) {
        db.Documents.findAll({ where: {
          $or: { permission: 'Public', OwnerId: req.params.id }
        } })
          .then(documents => res.send(documents));
      } else {
        res.send({ message: 'Unauthorized Access' });
      }
    });
  },

  /**
   * Get a specific document
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @returns {Void} Returns Void
   */
  getDocument(req, res) {
    db.Documents.findById(req.params.id)
     .then((document) => {
       if (!document) {
         return res.status(404)
           .send({
             message: `Document with id: ${req.params.id} does not exit`
           });
       }

       db.Roles.findById(req.decoded.RoleId)
         .then((role) => {
           if (role.title === 'Admin') {
             res.send(document);
           } else {
             if ((document.permission === 'Private'
                 && document.OwnerId === req.decoded.UserId)
                 || (document.permission === 'Public'
                 || document.permission.indexOf(role.title) > -1)) {
               return res.send(document);
             }
             res.status(403)
               .send({ message: 'Unauthorized Access to this Document' });
           }
         });
     });
  },

  /**
   * Edit and update a specific document
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @returns {Void} Returns Void
   */
  updateDocument(req, res) {
    db.Documents.findById(req.params.id)
      .then((document) => {
        if (!document) {
          return res.status(404)
            .send({ message: 'Document does not exist' });
        }

        db.Roles.findById(req.decoded.RoleId)
          .then((role) => {
            if (role.title === 'Admin'
            || document.OwnerId === req.decoded.UserId
            || (document.permission.indexOf(role.title) > -1 && role.write)) {
              return document.update(req.body)
                .then((updatedDocument) => {
                  res.send(updatedDocument);
                });
            }
            res.status(403)
            .send({ message: 'Unauthorized Edit Access' });
          });
      });
  },

  /**
   * Delete a specific document
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @returns {Void} Returns Void
   */
  deleteDoc(req, res) {
    db.Documents.findById(req.params.id)
      .then((document) => {
        if (!document) {
          return res.status(404)
            .send({ message: 'Document does not exist' });
        }
        db.Roles.findById(req.decoded.RoleId)
          .then((role) => {
            if (role.title === 'Admin'
            || document.OwnerId === req.decoded.UserId
            || (document.permission.indexOf(role.title) > -1 && role.write)) {
              return document.destroy()
                .then(() => {
                  res.send(
                    { message: `Deleted Document with id:${req.params.id}` });
                });
            }
            res.status(403)
            .send({ message: 'Unauthorized Delete Access' });
          })
          .catch((err) => {
            res.status(404)
              .send({ message: 'Role Not Found', details: err });
          });
      });
  }
};

export default DocumentsCtrl;
