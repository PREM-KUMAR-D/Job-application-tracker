const brevo = require('@getbrevo/brevo');
const axios = require('axios')

const Reminder = require('../models/reminder');


let defaultClient = brevo.ApiClient.instance;
let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_KEY;


exports.remindAfterPost = async (req, res, next) => {

    try {

        const applicationId = req.body.applicationId;
        const date = req.body.date;
        const email = req.body.email;
        const d = new Date(date);
        const dUnix = Math.floor(d.getTime() / 1000);


        if ((Date.now() - dUnix) <= 0) {
            res.status(400).json({ message: "Please enter after how many days the reminder should go off!", success: false });
        }

        let apiInstance = new brevo.TransactionalEmailsApi();
        let sendSmtpEmail = new brevo.SendSmtpEmail();
        

        sendSmtpEmail.subject = "{{params.subject}}";
        sendSmtpEmail.htmlContent = "<h1> Reminder to check you application <h1>";
        sendSmtpEmail.sender = { "name": "Admin", "email": "premkumar88845@gmail.com" };
        sendSmtpEmail.to = [
            { "email": email, "name": "Subscriber" }
        ];
        sendSmtpEmail.params = { "subject": "Password reset link for Expense Tracker", "email": email };
        sendSmtpEmail.scheduledAt = d.toISOString();

        const returnData = await apiInstance.sendTransacEmail(sendSmtpEmail);






        // const emailCampaignData = {
        //     sender: { name: 'Your Name', email: 'your-email@example.com' },
        //     name: 'Scheduled Email Campaign',
        //     subject: 'Reminder for you Job Application',
        //     htmlContent: '<h1> please check that your application status has changed <h1>',
        //     to: email,
        //     scheduledAt: d.toISOString(),
        // };

        // const response = await axios.post(
        //     'https://api.sendinblue.com/v3/emailCampaigns',
        //     emailCampaignData,
        //     {
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'api-key': process.env.BREVO_KEY,
        //         },
        //     }
        // );

        const {id} = await Reminder.create({
            remindAfter: d.toDateString(),
            applicationId: applicationId
        });

        res.status(201).json({message:"Reminder created" , success: true , remindId: id});


    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong', success: false });
    }


}