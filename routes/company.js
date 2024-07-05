const Express = require('express');


const userAuth = require('../middleware/userAuth');
const companyController = require('../controllers/companyController');


const router = Express.Router();



router.post('/get-companies',userAuth,companyController.getAllCompanies);


router.post('/get-company',userAuth,companyController.getCompanyByName);


router.post('/add-company',userAuth,companyController.postSaveCompany);







module.exports = router;