const { where } = require('sequelize');
const Profile = require('../models/profile');

exports.addProfile = async (req,res,next)=>{

    try {
        const userId = req.user.userId;
        const name = req.body.name;
        const resume = req.body.resume;
        const goals = req.body.goals;

        const created =await Profile.create({
            name:name,
            resumeLink: resume,
            carrerGoals: goals,
            userUserId: userId

        });


        res.status(201).json({message:"Profile created" , success: true  });






    } catch (error) {
        if (error.toString() === 'SequelizeUniqueConstraintError: Validation error') {
            res.status(403).json({ message: "Profile already exists! Please add a profile with different name"  , success: false});
            return;
        }

        console.log(err);
        return res.status(500).json({message: 'Something went wrong', success: false});
    }


}

exports.deleteProfile = async(req,res,next)=>{

    try {
        const userId = req.user.userId;
        const name = req.query.name;
        await Profile.destroy({
            where:{
                userUserId: userId,
                name: name
            }
        });

        res.status(200).json({ success: true, message: "Delete Profile" });
        
    } catch (error) {
        console.log(err);
        return res.status(500).json({message: 'Something went wrong', success: false});
    }

}


exports.editProfile = async(req,res,next)=>{

    try {
        const userId = req.user.userId;
        const name = req.body.name;
        const resume = req.body.resume;
        const goals = req.body.goals;


        const updated = await Profile.update({
            name: name,
            resumeLink: resume,
            carrerGoals: goals   
        },{
            where: {
                userUserId: userId,
                name:name
            }
        });

        if(!updated){
            res.status(400).json({ success: false, message: "Profile not found" }); 
        }

        res.status(200).json({ success: true, message: "Updated Profile ", updated: updated });

        
    } catch (error) {
        console.log(err);
        return res.status(500).json({message: 'Something went wrong', success: false});
    }
    
}

exports.getProfiles = async(req,res,next)=>{

    try {
        const userId = req.user.userId;
        const profiles =await  Profile.findAll({
            where:{
                userUserId: userId
            }
        });

        res.status(200).json({ message: "Profiles fetched", success: true, profiles : profiles });



    } catch (error) {
        
        console.log(error);
        return res.status(500).json({message: 'Something went wrong', success: false});
    }

}