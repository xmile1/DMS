import usersCtrl from '../controller/UserCtrl';
import Auth from '../middlewares/authentication';

const userRoutes = (router) => {
  router.route('/users')
    .post(usersCtrl.signUp)
    .get(Auth.verifyToken, Auth.verifyAdmin, usersCtrl.allUsers);

  router.route('/users/:id')
    .get(Auth.verifyToken, usersCtrl.getUser)
    .put(Auth.verifyToken, usersCtrl.updateUser)
    .delete(Auth.verifyToken, usersCtrl.deleteUser);

  router.route('/users/login')
    .post(usersCtrl.login);

  router.route('/users/logout')
    .post(usersCtrl.logout);
};

export default userRoutes;
