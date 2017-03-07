import RolesCtrl from '../controller/RolesCtrl';
import Auth from '../middlewares/Auth';

// Roles routes, Please take a look at the Roles controller for details
const RoleRoutes = (router) => {
  router.route('/roles')
  .get(Auth.verifyToken, Auth.verifyAdmin, RolesCtrl.getRoles)
  .post(Auth.verifyToken, Auth.verifyAdmin, RolesCtrl.createRoles);

  router.route('/roles/:id')
  .get(Auth.verifyToken, Auth.verifyAdmin, Auth.roleExist, RolesCtrl.getRole)
  .put(Auth.verifyToken, Auth.verifyAdmin, Auth.roleExist,
  RolesCtrl.updateRoles)
  .delete(Auth.verifyToken, Auth.verifyAdmin, Auth.roleExist,
  RolesCtrl.deleteRoles);
};

export default RoleRoutes;
