import DocumentsCtrl from '../controller/DocumentsCtrl';
import Auth from '../middlewares/auth';

// Document routes, Please take a look at the Document controller for details
const DocumentsRoutes = (router) => {
  router.route('/documents')
  .post(Auth.verifyToken, DocumentsCtrl.createDocument)
  .get(Auth.verifyToken, Auth.verifyAdmin, DocumentsCtrl.getAllDocuments);

  router.route('/documents/:id')
  .get(Auth.verifyToken, DocumentsCtrl.getDocument)
  .put(Auth.verifyToken, DocumentsCtrl.updateDocument)
  .delete(Auth.verifyToken, DocumentsCtrl.deleteDoc);

  router.route('/users/:id/documents/all')
  .get(Auth.verifyToken, DocumentsCtrl.getAllUserDocuments);

  router.route('/users/:id/documents')
  .get(Auth.verifyToken, DocumentsCtrl.getUserDocuments);
};

export default DocumentsRoutes;
