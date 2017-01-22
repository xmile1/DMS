import usersCtrl from '../controller/UserCtrl';

const userRoutes = (router) => {
  router.route('/users')
  .post(usersCtrl.signUp);

  router.route('/login')
  .post(usersCtrl.login);
};

export default userRoutes;
