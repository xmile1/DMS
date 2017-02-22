import SearchCtrl from '../controller/SearchCtrl';
import Auth from '../middlewares/Auth';

// Search routes, Please take a look at the Search controller for details
const SearchRoutes = (router) => {
  router.route('/search/users/:term')
  .get(Auth.verifyToken, Auth.verifyAdmin, SearchCtrl.allUsers);

  router.route('/search/roles/:term')
  .get(Auth.verifyToken, Auth.verifyAdmin, SearchCtrl.allRoles);

  router.route('/search/document/:userId/:term')
  .get(Auth.verifyToken, SearchCtrl.userDocuments);

  router.route('/search/documents/:term')
  .get(Auth.verifyToken, Auth.verifyAdmin, SearchCtrl.allDocuments);

  router.route('/search/documents/:userId/:term')
  .get(Auth.verifyToken, SearchCtrl.allUserDocuments);
};

export default SearchRoutes;
