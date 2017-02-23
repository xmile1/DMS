import db from '../models';

const RoleCtrl = {


  /**
   * getRoles - Get all Roles
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @returns {Void} Returns void
   */
  getRoles(req, res) {
    db.Roles.findAll({})
    .then((role) => {
      res.status(201)
      .send(role);
    });
  },

  /**
   * getRole - get Role by Id
   * @param {Object} req Request Object
   * @param {Object} res Response Object
   * @returns {Void} Returns void
   */
  getRole(req, res) {
    return db.Roles.findById(req.params.id)
    .then((role) => {
      if (!role.title) {
        return res.status(404)
        .send(
          { message: `Role with Id:${req.params.id} does not exist` });
      }
      res.status(201)
      .send(role);
    })
    .catch((err) => {
      res.status(404)
      .send(
        { message: 'Error Occured',
          details: err });
    });
  },

  /**
   * createRoles - Creates a new role
   * @param {Object} req Request Object
   * @param {Object} res Response Object
   * @returns {Void} Returns void
   */
  createRoles(req, res) {
    db.Roles.findOne({ where: { title: req.body.title } })
    .then((role) => {
      if (role) {
        return res.status(202)
          .send({
            message: `${req.body.title} already exists`
          });
      }
      db.Roles.create(req.body)
      .then((newRole) => {
        res.status(201)
        .send(newRole);
      })
      .catch((err) => {
        res.status(400)
        .send({ message: 'error occured', details: err });
      });
    });
  },

  /**
   * updateRoles - Update role based on provided parameters
   * @param {Object} req Request Object
   * @param {Object} res Response Object
   * @returns {Void} Returns void
   */
  updateRoles(req, res) {
    db.Roles.find({ where: {
      $or: [{ id: req.params.id },
        { title: req.params.id }]
    } }).then((role) => {
      role.update(req.body)
      .then((updatedRole) => {
        res.send({ message: `${req.params.id} updated`,
          data: updatedRole
        });
      });
    })
    .catch((err) => {
      res.send({ message: 'Role does not exist',
        details: err
      });
    });
  },

  /**
   * deleteRoles - Delete Role based on id or title
   * @param {Object} req Request Object
   * @param {Object} res Response Object
   * @returns {Void} Returns void
   */
  deleteRoles(req, res) {
    db.Roles.find({ where: {
      $or: [{ id: req.params.id },
        { title: req.params.id }]
    } }).then((role) => {
      role.destroy()
      .then(() => {
        res.send({ message: `Role ${req.params.id} deleted` });
      });
    }).catch((err) => {
      res.send({ message: 'Error Occured', details: err });
    });
  }
};

export default RoleCtrl;
