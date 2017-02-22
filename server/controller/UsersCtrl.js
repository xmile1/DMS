import jwt from 'jsonwebtoken';
import db from '../models';

const secret = process.env.SECRET || 'just another open secret';

const userDetails = newUser => ({
  id: newUser.id,
  username: newUser.username,
  fullNames: newUser.fullNames,
  email: newUser.email,
  RoleId: newUser.RoleId,
  createdAt: newUser.createdAt,
  updatedAt: newUser.updatedAt
});

const UsersCtrl = {

  /**
   * signUp - Create a user
   * @param {Object} req Request Object
   * @param {Object} res Response Object
   * @returns {void} Returns void
   */
  signUp(req, res) {
    db.Users.findOne({
      where: {
        email: req.body.email
      }
    })
      .then((userExist) => {
        if (userExist) {
          return res.status(201)
            .send({
              message: `${req.body.email} already exists`
            });
        }
        db.Users.create(req.body)
            .then((newUser) => {
              const token = jwt.sign({
                UserId: newUser.id,
                RoleId: newUser.RoleId
              }, secret, {
                expiresIn: '2 days'
              });
              const user = userDetails(newUser);
              res.status(201)
                .send({
                  user,
                  token,
                  expiresIn: '2 days'
                });
            })
            .catch((err) => {
              res.send({
                message: 'Error occured creating user',
                details: err
              });
            });
      })
      .catch((err) => {
        res.send({ error: {
          message: 'Error occured checking existing user',
          details: err }
        });
      });
  },

  /**
   * login - Login Authentication for users
   * @param {Object} req Request Object
   * @param {Object} res Response Object
   * @returns {void} Returns void
   */
  login(req, res) {
    db.Users.findOne({
      where: {
        $or: [{ email: req.body.username },
          { username: req.body.username }]
      }
    }).then((user) => {
      if (user && user.validPassword(req.body.password)) {
        const token = jwt.sign({
          UserId: user.id,
          RoleId: user.RoleId
        }, secret, { expiresIn: '2 days' });
        res.send({ user: userDetails(user), token, expiresIn: '2 days' });
      } else {
        res.status(401)
            .send({ message: 'Authentication failed!' });
      }
    }).catch(() => {
    });
  },

  /**
   * logout - Logs out a user
   * @param {Object} req Request Object
   * @param {Object} res Response Object
   * @returns {void} Returns void
   */
  logout(req, res) {
    res.send({ message: `User with id:${req.decoded.UserId} logged out` });
  },


  /**
   * allUsers - Gets all user details
   * @param {Object} req Request Object
   * @param {Object} res Response Object
   * @returns {void} Returns void
   */
  allUsers(req, res) {
    db.Users.findAll({ fields: [
      'id',
      'username',
      'fullName',
      'email',
      'RoleId',
      'createdAt',
      'updatedAt'
    ] })
      .then((usersList) => {
        res.send(usersList);
      });
  },


  /**
   * getUser - Get a single user based on email or username
   * @param {Object} req Request Object
   * @param {Object} res Response Object
   * @returns {void} Returns void
   */
  getUser(req, res) {
    db.Users.findOne({
      where: {
        $or: [{ email: req.params.id },
          { username: req.params.id }]
      }
    }).then((user) => {
      if (!user) {
        return res.status(401)
        .send({ message: `User ${req.params.id} cannot be found` });
      }
      res.send(user);
    });
  },

  /**
   * updateUser - Update user details
   * @param {Object} req Request Object
   * @param {Object} res Response Object
   * @returns {void} Returns void
   */
  updateUser(req, res) {
    db.Roles.findById(req.decoded.RoleId)
      .then((role) => {
        if (role.title === 'Admin'
        || String(req.decoded.UserId) === req.params.id) {
          db.Users.find({ where: {
            id: req.params.id } })
            .then((user) => {
              user.update(req.body)
                .then(updatedUser => res
                  .send({ message: `${req.params.id} updated`,
                    data: userDetails(updatedUser)
                  }));
            });
        } else {
          return (res.status(401)
         .send({ message: 'Unauthorized Access' }));
        }
      });
  },

  /**
   * deleteUser - Delete a user
   * @param {Object} req Request Object
   * @param {Object} res Response Object
   * @returns {void} Returns void
   */
  deleteUser(req, res) {
    db.Roles.findById(req.decoded.RoleId)
      .then((role) => {
        if (role.title === 'Admin') {
          db.Users.find({ where: {
            id: req.params.id } })
      .then((user) => {
        user.destroy()
      .then(() => {
        res.status(201).send({ message: `${req.params.id} has been deleted` });
      });
      });
        } else {
          res.status(401).send({ message: 'Unauthorized Access' });
        }
      });
  }
};

export default UsersCtrl;
