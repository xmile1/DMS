import DocumentsCtrl from '../controller/DocumentsCtrl';
import Auth from '../middlewares/Auth';

// Document routes, Please take a look at the Document controller for details
const DocumentsRoutes = (router) => {
  router.route('/documents')
  .post(Auth.verifyToken, DocumentsCtrl.createDocument)
  .get(Auth.verifyToken, Auth.verifyAdmin, DocumentsCtrl.getAllDocuments);

  router.route('/documents/:id')
  .get(Auth.verifyToken, Auth.documentExist, Auth.fullDocumentRight,
    DocumentsCtrl.getDocument)
  .put(Auth.verifyToken, Auth.documentExist, Auth.documentRight,
    DocumentsCtrl.updateDocument)
  .delete(Auth.verifyToken, Auth.documentExist, Auth.documentRight,
    DocumentsCtrl.deleteDoc);

  router.route('/users/:id/documents/all')
  .get(Auth.verifyToken, Auth.documentRight,
    DocumentsCtrl.getAllUserDocuments);

  router.route('/users/:id/documents')
  .get(Auth.verifyToken, Auth.documentRight,
    DocumentsCtrl.getUserDocuments);
};

export default DocumentsRoutes;
