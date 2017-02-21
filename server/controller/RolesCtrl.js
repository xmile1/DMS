import db from '../models';

const RoleCtrl = {
  getRoles: (req, res) => {
    db.Roles.findAll({})
    .then((role) => {
      res.status(201)
      .send(role);
    });
  },
  getRole: (req, res) => {
    db.Roles.findById(req.params.id)
    .then((role) => {
      if (!role.title) {
        res.status(404)
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
  createRoles: (req, res) => {
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
  updateRoles: (req, res) => {
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
  deleteRoles: (req, res) => {
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
