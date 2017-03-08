import db from '../models';
import Helpers from '../Helpers/Helpers';

const RoleCtrl = {


  /**
   * getRoles - Get all Roles
   * @param {Object} req Request object
   * @param {Object} res Response object
   * @returns {void} Returns void
   */
  getRoles(req, res) {
    db.Roles.findAll()
    .then((role) => {
      res.status(201)
      .send(role);
    });
  },

  /**
   * getRole - get Role by Id
   * @param {Object} req Request Object
   * @param {Object} res Response Object
   * @returns {void} Returns void
   */
  getRole(req, res) {
    res.status(200)
      .send(req.body.role);
  },

  /**
   * createRoles - Creates a new role
   * @param {Object} req Request Object
   * @param {Object} res Response Object
   * @returns {void} Returns void
   */
  createRoles(req, res) {
    db.Roles.findOne({ where: { title: req.body.title } })
    .then((role) => {
      if (role) {
        return res.status(409)
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
        res.status(500)
        .send({ message: 'error occurred' });
      });
    });
  },

  /**
  * searchRoles - Search list of role where the search term
  * matches the Role title
  * @param {Object} req Request Object
  * @param {Object} res Response Object
  * @returns {void} returns void
  */
  searchRoles(req, res) {
    req.body.entity = 'Roles';
    req.body.columnToSearch = 'title';
    Helpers.search(req, res).then((result) => {
      res.status(200).send(result);
    });
  },

  /**
   * updateRoles - Update role based on provided parameters
   * @param {Object} req Request Object
   * @param {Object} res Response Object
   * @returns {void} Returns void
   */
  updateRoles(req, res) {
    req.body.role.update(req.body)
    .then(updatedRole => res
    .status(200)
    .send({ message: `${req.params.id} updated`,
      data: updatedRole
    })).catch((err) => {
      res.status(500)
          .send({ message: 'error occurred' });
    });
  },

  /**
   * deleteRoles - Delete Role based on id or title
   * @param {Object} req Request Object
   * @param {Object} res Response Object
   * @returns {void} Returns void
   */
  deleteRoles(req, res) {
    req.body.role.destroy()
    .then(() => {
      res.status(200)
      .send({ message: `Role ${req.params.id} deleted` });
    });
  }
};

export default RoleCtrl;
