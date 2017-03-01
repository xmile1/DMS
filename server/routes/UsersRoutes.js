import UsersCtrl from '../controller/UsersCtrl';
import Auth from '../middlewares/Auth';

// User routes, Please take a look at the User controller for details
const UsersRoutes = (router) => {
  router.route('/users')
    .post(UsersCtrl.signUp)
    .get(Auth.verifyToken, Auth.verifyAdmin, UsersCtrl.allUsers);

  router.route('/users/:id')
    .get(Auth.verifyToken, UsersCtrl.getUser)
    .put(Auth.verifyToken, UsersCtrl.updateUser)
    .delete(Auth.verifyToken, Auth.verifyAdmin, UsersCtrl.deleteUser);

  router.route('/users/login')
    .post(UsersCtrl.login);

  router.route('/users/logout')
    .post(Auth.verifyToken, UsersCtrl.logout);
};

export default UsersRoutes;
