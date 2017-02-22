import UsersRoutes from './UsersRoutes';
import DocumentsRoutes from './DocumentsRoutes';
import RolesRoutes from './RolesRoutes';
import searchRoutes from './SearchRoutes';

// setup routes using router
const Routes = (router) => {
  UsersRoutes(router);
  DocumentsRoutes(router);
  RolesRoutes(router);
  searchRoutes(router);
};

export default Routes;
