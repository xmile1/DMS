import jwt from 'jsonwebtoken';
import db from '../models';

const secret = process.env.SECRET || 'just another open secret';

const userDetails = newUser => ({
  id: newUser.id,
  username: newUser.username,
  fullNames: newUser.firstName,
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
          return res.status()
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
  }
};

export default usersCtrl;
