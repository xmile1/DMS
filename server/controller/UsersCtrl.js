import jwt from 'jsonwebtoken';
import db from '../models';
import Helpers from '../helpers/Helpers';

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
          return res.status(409)
            .send({
              message: 'Email already exists'
            });
        }
        if (req.body.RoleId === '1') {
          return res.status(403)
            .send({
              message: 'You cannot signup as an Admin'
            });
        }
        const { username, fullNames, email, password } = req.body;
        const userToCreate = { username, fullNames, email, password };
        db.Users.create(userToCreate)
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
              res.status(500)
              .send({
                message: 'Unexpected error occured creating user'
              });
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
        res.status(200)
        .send({ user: userDetails(user), token, expiresIn: '2 days' });
      } else {
        res.status(400)
            .send({ message: 'Authentication failed!' });
      }
    });
  },

  /**
   * logout - Logs out a user
   * @param {Object} req Request Object
   * @param {Object} res Response Object
   * @returns {void} Returns void
   */
  logout(req, res) {
    db.InvalidTokens.create({ token: req.headers['x-access-token']
    || req.headers.authorization });
    db.InvalidTokens.destroy({ where: {
      createdAt: { $lt: new Date() - (48 * 60 * 60 * 1000) } } });
    return res.status(200).send({ message:
      `User with id:${req.decoded.UserId} logged out` });
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
      .then(usersList => res.status(200).send(usersList));
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
        return res.status(404)
        .send({ message: `User ${req.params.id} cannot be found` });
      }
      res.status(200).send(user);
    });
  },

  /**
   * searchUsers - Search list of user where the search term
   * matches the fullnames
   * @param {Object} req Request Object
   * @param {Object} res Response Object
   * @returns {void} Returns void
   */
  searchUsers(req, res) {
    req.body.entity = 'Users';
    req.body.columnToSearch = 'fullNames';
    Helpers.search(req, res).then((result) => {
      res.status(200).send(result);
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
        if (Helpers.isAdmin(req, res)
        || Helpers.isOwner(req, res)) {
          db.Users.find({ where: {
            id: req.params.id } })
            .then((user) => {
              user.update(req.body)
                .then(updatedUser => res
                  .status(200).send({ message: `${req.params.id} updated`,
                    data: userDetails(updatedUser)
                  }));
            });
        } else {
          return (res.status(403)
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
    if (Helpers.isOwner(req, res)) {
      return res.status(403).send({ message: 'You cannot Delete the Admin' });
    }
    db.Users.find({ where: {
      id: req.params.id } })
      .then((user) => {
        user.destroy()
      .then(() => {
        res.status(200).send({ message: `${req.params.id} has been deleted` });
      });
      });
  }
};

export default UsersCtrl;
