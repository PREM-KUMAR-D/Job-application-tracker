const Express = require('express');

const applicationController = require('../controllers/applicationController');
const userAuth = require('../middleware/userAuth');
const multerUpload = require('../middleware/multer');


const router = Express.Router();



router.post('/apply',userAuth,multerUpload.single('file'),applicationController.addApplication);







module.exports = router;