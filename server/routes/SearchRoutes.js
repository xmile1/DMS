import RolesCtrl from '../controller/RolesCtrl';
import UsersCtrl from '../controller/UsersCtrl';
import DocumentsCtrl from '../controller/DocumentsCtrl';
import Auth from '../middlewares/Auth';

// Search routes, Please take a look at the Search controller for details
const SearchRoutes = (router) => {
  router.route('/search/users')
  .get(Auth.verifyToken, Auth.verifyAdmin, UsersCtrl.searchUsers);

  router.route('/search/roles')
  .get(Auth.verifyToken, Auth.verifyAdmin, RolesCtrl.searchRoles);

  router.route('/search/document/:userId')
  .get(Auth.verifyToken, DocumentsCtrl.searchUserDocuments);

  router.route('/search/documents')
  .get(Auth.verifyToken, Auth.verifyAdmin, DocumentsCtrl.searchDocuments);

  router.route('/search/documents/:userId')
  .get(Auth.verifyToken, DocumentsCtrl.searchAllUserDocuments);
};

export default SearchRoutes;
