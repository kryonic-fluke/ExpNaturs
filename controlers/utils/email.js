/*eslint-disable*/
const nodemailer = require('nodemailer');

const sendEmail  =async options=>{
    //1) create a transproter (service that sends the emailer)
        const transporter= nodemailer.createTransport({
          host:process.env.EMAIL_HOST,
          port:process.env.EMAIL_PORT,
            auth:{
                user:process.env.EMAIL_USERNAME,
                pass:process.env.EMAIL_PASSWORD
                
            }

            //active in gmail "less secure app option"
        })


    //2)Define the email option
        const mailOptions ={
            from:'Suyash <hello@suyash.io>',   
            to:options.email,
            subject:options.subject,
            text:options.message,
            // html:options.email,

        }

    //3)send emial with nodemailer

   await transporter.sendMail(mailOptions);

}


module.exports = sendEmail;