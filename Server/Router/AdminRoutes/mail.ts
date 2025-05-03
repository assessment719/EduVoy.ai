import Router from "express";
import { adminAuth } from "./../../Auth/admin";
import nodemailer from 'nodemailer';

export const mailRouter = Router();

mailRouter.post("/", adminAuth, async function (req, res) {
    const { mailData } = req.body;

    const queryHtml = `<!DOCTYPE html>
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
            .query-section { background-color: #f8f9fa; border-left: 4px solid #586994; padding: 15px; margin-bottom: 20px; border-radius: 0 4px 4px 0; }
            .query-header { font-weight: 600; color: #586994; margin-bottom: 10px; }
            .answer-section { background-color: #f5f7f5; border-left: 4px solid #8bb87b; padding: 15px; margin-bottom: 20px; border-radius: 0 4px 4px 0; }
            .answer-header { font-weight: 600; color: #8bb87b; margin-bottom: 10px; }
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
                <div class="greeting">Dear ${mailData.fullName},</div>
                
                <div class="message">
                    <p>Thank you for reaching out to EduVoy.ai Support. We've reviewed your inquiry and provided the information below.</p>
                </div>
                
                <div class="query-section">
                    <div class="query-header">Your Question:</div>
                    <p>${mailData.message}</p>
                </div>
                
                <div class="answer-section">
                    <div class="answer-header">Our Response:</div>
                    <p>${mailData.answer}</p>
                </div>
                
                <div class="message">
                    <p>We hope this information helps resolve your concern. If you need any further assistance or have additional questions, please don't hesitate to reply to this email or use our live chat on the website.</p>
                    
                    <a href="http://localhost:5173/contact" class="button">Contact Support</a>
                </div>
                
                <div class="sign-off">
                    <p>Best regards,<br>
                    The EduVoy.ai Support Team</p>
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
            subject: `EduVoy.ai Support: Response to Your Inquiry #${mailData.id}`,
            html: queryHtml
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