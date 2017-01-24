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

const usersCtrl = {
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
            });
      }).catch((err) => {
        // console.log(err);
      });
  },
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

        res.send({ token, expiresIn: '2 days' });
      } else {
        res.status(401)
            .send({ message: 'Authentication failed!' });
      }
    });
  },
  logout(req, res) {
    res.send({ message: `${req.body} logged out` });
  },
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
  getUser(req, res) {
    db.Users.findOne({
      where: {
        $or: [{ email: req.params.id },
          { username: req.params.id }]
      }
    }).then((user) => {
      if (!user) {
        return res.status(401)
        .send({ mesage: `User ${res.param.username} cannot be found` });
      }
      res.send(user);
    });
  },
  updateUser(req, res) {
    db.Users.find({ where: {
      $or: [{ email: req.params.id },
        { username: req.params.id }]
    } }).then((user) => {
      user.update(req.body)
      .then((updatedUser) => {
        res.send({ message: `${req.params.id} updated`,
          data: userDetails(updatedUser)
        });
      });
    });
  },
  deleteUser(req, res) {
    db.Users.find({ where: {
      $or: [{ email: req.params.id },
        { username: req.params.id }]
    } }).then((user) => {
      user.destroy()
      .then((deletedUser) => {
        res.send(`${req.params.id} has been deleted`);
      });
    });
  }

};

export default usersCtrl;
