const Express = require('express');

const profileController = require('../controllers/profileController');
const userAuth = require('../middleware/userAuth');
const multerUpload = require('../middleware/multer');


const router = Express.Router();

router.get('/get-profiles',userAuth,profileController.getProfiles);

router.post('/add-profile',userAuth,multerUpload.single('resumeLink'),profileController.addProfile);

router.post('/edit-profile',userAuth,multerUpload.single('resumeLink'),profileController.editProfile);

router.delete('/delete-profile',userAuth,profileController.deleteProfile);

module.exports = router;