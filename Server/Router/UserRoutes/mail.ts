import Router from "express";
import moment from 'moment';
import nodemailer from 'nodemailer';
import { userModel } from "../../database";

export const mailRouter = Router();

mailRouter.post("/", async function (req, res) {
    const { mailData } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000);

    const otpHtml = `<!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; max-width: 650px; margin: 0 auto; padding: 0; background-color: #f5f7fa; color: #333; }
            .container { background-color: #ffffff; border-radius: 10px; box-shadow: 0 3px 10px rgba(0,0,0,0.1); overflow: hidden; margin: 20px; }
            .header { background-color: #8bb87b; padding: 25px; text-align: center; }
            .logo img { max-width: 200px; }
            .content { padding: 30px; }
            .greeting { font-size: 18px; font-weight: 500; margin-bottom: 20px; }
            .message { margin-bottom: 25px; }
            .otp-section { background-color: #f8f9fa; border: 1px solid #ddd; padding: 20px; margin: 20px 0; text-align: center; border-radius: 5px; }
            .otp-code { font-size: 28px; letter-spacing: 5px; font-weight: bold; color: #586994; font-family: monospace; margin: 15px 0; }
            .expires { color: #777; font-size: 14px; margin-top: 10px; }
            .sign-off { margin-top: 30px; }
            .footer { background-color: #B4C4AE; padding: 20px; text-align: center; font-size: 13px; color: #333; border-top: 1px solid #8bb87b; }
            .social-links { margin: 15px 0; }
            .social-links a { margin: 0 10px; text-decoration: none; color: #586994; font-weight: bold; }
            .button { display: inline-block; background-color: #8bb87b; color: black !important; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold; margin-top: 10px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">
                    <img src="https://i.postimg.cc/G2Gdrhxb/logopng.png" alt="EduVoy.ai">
                </div>
            </div>
    
            <div class="content">
                <div class="greeting">Hello,</div>
                
                <div class="message">
                    <p>We've received a request to log in to your EduVoy.ai account. To verify your identity, please use the one-time password (OTP) below:</p>
                </div>
                
                <div class="otp-section">
                    <div class="otp-code">${otp.toString()}</div>
                    <div class="expires">This code will expire in 10 minutes</div>
                </div>
                
                <div class="message">
                    <p>If you didn't request this code, please ignore this email or contact our support team immediately as someone may be trying to access your account.</p>
                    
                    <a href="http://localhost:5173/contact" class="button">Contact Support</a>
                </div>
                
                <div class="sign-off">
                    <p>Best regards,<br>
                    The EduVoy.ai Security Team</p>
                </div>
            </div>
    
            <div class="footer">
                <div class="social-links">
                    <a href="#">Facebook</a> | <a href="#">Twitter</a> | <a href="#">LinkedIn</a>
                </div>
                <p>© 2025 EduVoy.ai | All Rights Reserved</p>
                <p><a href="http://localhost:5173">EduVoy.ai</a> | <a href="http://localhost:5173/privacy">Privacy Policy</a></p>
            </div>
        </div>
    </body>
    </html>`

    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const info = await transporter.sendMail({
            from: `${process.env.EMAIL_NAME} ${process.env.EMAIL}`,
            to: mailData.email,
            subject: 'Verification Code: Complete Your EduVoy.ai Login',
            html: otpHtml,
        });

        await userModel.updateOne({
            email : mailData.email
        }, {
            otp,
            otpExpiry: moment().add(10, 'minutes').unix()
        });

        res.json({
            Message: "Mail Has Been Send Successfully!"
        });
    } catch (error) {
        res.status(500).json({
            Message: "Error While Sending Mail",
            Error: `Error With Api: ${error}`
        });
    }
});