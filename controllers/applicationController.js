const Application = require('../models/application');
const Profile = require('../models/profile');
const fs = require('fs');
const AWS = require('aws-sdk');

exports.addApplication = async (req, res, next) => {

    try {
        const userId = req.user.userId;
        const companyName = req.body.companyName;
        const date = req.body.date;
        const notes = req.body.notes;
        const status = req.body.status;
        const profileId = req.body.profileId;


        const file = req.file;

        const fileContent = fs.readFileSync(file.path);


        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_S3_REGION
        });

        const bucketName = 'expense.tracker.demo';

        const params = {
            Bucket: bucketName,
            Key: file.filename,
            Body: fileContent
            // ContentType: 'text/html'
        };


        s3.upload(params, async (err, uploadData) => {
            if (err) {
                console.error("Error uploading data: ", err);
                return res.status(500).json({ error: err, success: false, message: 'Something went wrong' });
            }


            await Application.create({
                companyName: companyName,
                date: date,
                status: status,
                notes: notes,
                uploadLink: uploadData.Location,
                profileId: profileId

            });





            fs.unlinkSync(file.path);


            res.status(201).json({ message: "Applied", success: true });
        });










    } catch (error) {
        if (error.toString() === 'SequelizeUniqueConstraintError: Validation error') {
            res.status(403).json({ message: "Profile already exists! Please add a profile with different name", success: false });
            return;
        }

        console.log(error);
        return res.status(500).json({ message: 'Something went wrong', success: false });
    }


}

exports.deleteApplication = async (req,res,next)=>{



}


exports.updateApplication = async(req,res,next)=>{
    
}






exports.getApplications = async (req, res, next) => {

    try {
        const userId = req.user.userId;
        const profileId = req.query.profileId;


        const profile = await Profile.findByPk(profileId);

        const profileCheck = await req.user.hasProfile(profile);

        if(!profileCheck){
            return res.status(403).json({ message: 'Not Authorized', success: false });    
        }


        const applications = await Application.findAll({
            where: {
                profileId: profileId
            }
        });

        res.status(200).json({ message: "applications fetched", success: true, applications: applications });



    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong', success: false });
    }

}