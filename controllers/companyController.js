const Company = require('../models/company');
const Application = require('../models/application');

exports.postSaveCompany = async (req, res, next) => {

    try {
        
        const { name, email, phone, companySize, industry, notes } = req.body;
        const applicationId  = req.body.applicationId;
     

     
        const created = await Company.create({
            name: name,
            email: email,
            phone: phone,
            companySize: companySize,
            industry: industry,
            notes: notes,
            
        });
        
        const application = await Application.findByPk(applicationId);

        created.addApplication(application);


        
        res.status(200).json({ message: "Company added ", created: created, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong', success: false });
    }

}


exports.getCompanyByName = async (req, res, next) => {

    try {
        const companyName = req.body.name;
        
        const profile = req.body.profile;
        const company = await Company.findOne({ 
            where: { name: companyName} ,
             include: {
                model: Application,
                where: {
                    profileId: profile
                }
            }
        });

        if (!company) {
            return res.status(404).json({ message: 'Company not found', success: false });
        }

        res.status(200).json({ company: company, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong', success: false });
    }
}

exports.getAllCompanies = async (req, res, next) => {
    try {

        
        const profile = req.body.profile;
        const company = await Company.findAll({ 
            include: {
                model: Application,
                where: {
                    profileId: profile
                }
            }
         });

        if (!company) {
            return res.status(404).json({ message: 'Company not found', success: false });
        }

        res.status(200).json({ companies: company, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong', success: false });
    }
}