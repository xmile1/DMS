import jwt from 'jsonwebtoken';
import db from '../models';

const secret = process.env.SECRET || 'just another open secret';
const Auth = {
  verifyToken(req, res, next) {
    const token = req.headers.authorization || req.headers['x-access-token'];
    if (!token) {
      return res.status(401).send({ message: 'Unauthorized Access' });
    }

    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: 'Invalid Token' });
      }
      req.decoded = decoded;
      next();
    });
  },
  verifyAdmin(req, res, next) {
    db.Role.findById(req.decoded.RoleId)
       .then((role) => {
         if (role.title === 'admin') {
           next();
         } else {
           return res.status(403).send({ message: 'Admin access is required!' });
         }
       });
  }
};

export default Auth;
