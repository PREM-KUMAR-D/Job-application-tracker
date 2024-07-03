const Express = require('express');

const profileController = require('../controllers/profileController');
const userAuth = require('../middleware/userAuth');


const router = Express.Router();

router.get('/get-profiles',userAuth,profileController.getProfiles);

router.post('/add-profile',userAuth,profileController.addProfile);

router.post('/edit-profile',userAuth,profileController.editProfile);

router.delete('/delete-profile/:name',userAuth,profileController.deleteProfile);

module.exports = router;