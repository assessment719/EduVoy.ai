import cron from 'node-cron';
import moment from 'moment';
import { userModel } from '../../database';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const getEmailTemplate = (studentName: string, engLishTest: string, startTime: string): string => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { 
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
                line-height: 1.7; 
                max-width: 600px; 
                margin: 0 auto; 
                padding: 0; 
                background-color: #f5f7fa;
                color: #333;
            }
            
            .email-wrapper {
                background-color: #ffffff;
                border-radius: 16px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                overflow: hidden;
                margin: 30px 20px;
                border: 1px solid #e8ecf0;
            }
            
            .header {
                background-color: #8bb87b;
                padding: 40px 30px;
                text-align: center;
                position: relative;
            }
            
            .header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="80" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grain)"/></svg>');
                opacity: 0.3;
            }
            
            .logo {
                position: relative;
                z-index: 1;
            }
            
            .logo img {
                max-width: 200px;
                height: auto;
            }
            
            .brand-name {
                color: white;
                font-size: 28px;
                font-weight: 700;
                margin-top: 10px;
                letter-spacing: -0.5px;
                display: none;
            }
            
            .tagline {
                color: rgba(255,255,255,0.9);
                margin-top: 5px;
                font-size: 18px;
                font-weight: 600;
            }
            
            .content {
                padding: 45px 40px;
            }
            
            .greeting {
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 25px;
                color: #2c3e50;
            }
            
            .main-message {
                font-size: 16px;
                margin-bottom: 30px;
                color: #34495e;
                background: #f8f9fa;
                padding: 25px;
                border-radius: 12px;
                border-left: 4px solid #8bb87b;
            }
            
            .cta-section {
                background: #ffffff;
                border: 2px solid #e8ecf0;
                padding: 30px;
                margin: 30px 0;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            }
            
            .section-title {
                font-size: 18px;
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 20px;
                text-align: center;
            }
            
            .feature-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin: 25px 0;
            }
            
            .feature-item {
                display: flex;
                align-items: center;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 8px;
                border-left: 3px solid #8bb87b;
                transition: transform 0.2s ease;
            }
            
            .feature-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            
            .feature-icon {
                font-size: 20px;
                margin-right: 12px;
                width: 24px;
                text-align: center;
            }
            
            .feature-text {
                font-size: 14px;
                font-weight: 500;
                color: #2c3e50;
            }
            
            .primary-button {
                display: inline-block;
                background-color: #8bb87b;
                color: black !important;
                padding: 14px 28px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 600;
                font-size: 15px;
                text-align: center;
                box-shadow: 0 4px 12px rgba(139, 184, 123, 0.3);
                transition: all 0.3s ease;
                border: none;
                cursor: pointer;
            }
            
            .primary-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(139, 184, 123, 0.4);
            }
            
            .secondary-button {
                display: inline-block;
                background: transparent;
                color: #586994 !important;
                padding: 12px 24px;
                border: 2px solid #586994;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 600;
                font-size: 14px;
                text-align: center;
                transition: all 0.3s ease;
                margin-left: 15px;
            }
            
            .secondary-button:hover {
                background: #586994;
                color: white !important;
            }
            
            .motivation-box {
                background: #B4C4AE;
                padding: 25px;
                border-radius: 12px;
                margin: 25px 0;
                text-align: center;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            
            .motivation-text {
                font-size: 16px;
                font-weight: 500;
                color: #2c3e50;
                margin-bottom: 15px;
            }
            
            .stats-highlight {
                font-size: 18px;
                font-weight: 700;
                color: #586994;
            }
            
            .sign-off {
                margin-top: 35px;
                padding-top: 25px;
                border-top: 1px solid #e8ecf0;
            }
            
            .signature {
                font-size: 15px;
                color: #2c3e50;
                font-weight: 500;
            }
            
            .team-name {
                color: #586994;
                font-weight: 600;
            }
            
            .footer {
                background-color: #B4C4AE;
                padding: 30px;
                text-align: center;
                font-size: 13px;
                color: #333;
                border-top: 1px solid #8bb87b;
            }
            .social-links {
                margin: 15px 0;
            }

            .social-links a {
                margin: 0 10px;
                text-decoration: none;
                color: #586994;
                font-weight: bold;
            }
            
            @media (max-width: 600px) {
                .content {
                    padding: 30px 25px;
                }
                
                .feature-grid {
                    grid-template-columns: 1fr;
                }
                
                .secondary-button {
                    margin-left: 0;
                    margin-top: 10px;
                    display: block;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-wrapper">
            <div class="header">
                <div class="logo">
                    <img src="https://i.postimg.cc/G2Gdrhxb/logopng.png" alt="EduVoy.ai" />
                </div>
                <div class="brand-name">EduVoy.ai</div>
                <div class="tagline">Bridging Dreams with Global Opportunities</div>
            </div>
            
            <div class="content">
                <div class="greeting">Dear ${studentName},</div>
                
                <div class="main-message">
                    <p>This is your friendly reminder from <strong>EduVoy.ai</strong> to help you stay on track with your <strong>${engLishTest}</strong> for studying abroad! 🌍</p>
                    <p>Consistency is the key to success, and we're here to make your daily practice effective and engaging.</p>
                </div>
                
                <div class="cta-section">
                    <div class="section-title">📚 Today's Study Session Awaits You!</div>
                    
                    <div class="feature-grid">
                        <div class="feature-item">
                            <div class="feature-icon">🎧</div>
                            <div class="feature-text">Practice Listening Skills</div>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">📖</div>
                            <div class="feature-text">Reading Comprehension</div>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">✍️</div>
                            <div class="feature-text">Writing Task Practice</div>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">🗣️</div>
                            <div class="feature-text">Speaking Preparation</div>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">📅</div>
                            <div class="feature-text">Review Study Schedule</div>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">📈</div>
                            <div class="feature-text">Track Mock Test Progress</div>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 25px;">
                        <a href="http://localhost:5173/test-practice" class="primary-button">Start Practicing at ${startTime}</a>
                        <a href="http://localhost:5173/dashboard" class="secondary-button">View My Progress</a>
                    </div>
                </div>
                
                <div class="motivation-box">
                    <div class="motivation-text">
                        <strong>Daily Study Reminder:</strong> Just <span class="stats-highlight">30 minutes</span> of focused practice every day can make a significant difference in your test results!
                    </div>
                    <div style="font-size: 14px; margin-top: 10px; opacity: 0.8;">
                        Stay consistent, stay motivated – your dream university is within reach! 🎯
                    </div>
                </div>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #8bb87b; margin: 25px 0;">
                    <p style="margin: 0; font-size: 15px;"><strong>Need Help or Guidance?</strong> If you have any doubts or need personalized study tips, our support team is just a click away.</p>
                    <div style="margin-top: 15px;">
                        <a href="http://localhost:5173/contact" class="secondary-button" style="margin-left: 0;">Get Support</a>
                    </div>
                </div>
                
                <div class="sign-off">
                    <div class="signature">
                        All the best with your preparation,<br>
                        <div class="team-name">The EduVoy.ai Team</div>
                    </div>
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
    </html>
    `;
};

const subjects = [
    '⏰ Time to Practice! Your Study Session Starts Soon',
    '🚀 Boost Your Skills Today – Study Session Reminder',
    '🌍 Stay on Track with Your Test Prep – Let’s Begin!',
    '📚 Just 30 Minutes a Day = ELT Mastery',
    '✨ Get Closer to Your Dream University Today!',
    'Hey Applicant, Your English Practice Time Is Coming Up!',
    'Heads Up! Your Study Slot Starts in 30 Minutes',
    'Stay Sharp! It’s Almost Time for Your Daily Prep',
    '⏳ Don’t Miss Your Learning Moment – Session Reminder',
    '💪 Study. Practice. Achieve. Your Prep Time Is Now!'
]

const timeSlots: { value: string, label: string }[] = [
    { value: "07:30", label: "8:00 AM" },
    { value: "08:30", label: "9:00 AM" },
    { value: "09:30", label: "10:00 AM" },
    { value: "10:30", label: "11:00 AM" },
    { value: "11:30", label: "12:00 PM" },
    { value: "12:30", label: "1:00 PM" },
    { value: "13:30", label: "2:00 PM" },
    { value: "14:30", label: "3:00 PM" },
    { value: "15:30", label: "4:00 PM" },
    { value: "16:30", label: "5:00 PM" },
    { value: "17:30", label: "6:00 PM" },
    { value: "18:30", label: "7:00 PM" }
];

cron.schedule('*/30 7-18 * * *', async () => {
    const startTime = moment().format('HH:mm');
    const endTime = moment().add(30, 'minutes').format('HH:mm');

    console.log(`🕒 Checking study reminders between ${startTime} and ${endTime}`);

    try {
        const students = await userModel.find({
            $or: [
                { "englishTests.ielts.studyTiming": { $gte: startTime, $lte: endTime } },
                { "englishTests.toefl.studyTiming": { $gte: startTime, $lte: endTime } },
                { "englishTests.pte.studyTiming": { $gte: startTime, $lte: endTime } },
                { "englishTests.duolingo.studyTiming": { $gte: startTime, $lte: endTime } }
            ]
        });

        if (students.length === 0) {
            console.log('ℹ️ No matching students at this time.');
            return;
        }

        for (const student of students) {
            const sheduledEnglishTests: string[] = [];

            const ieltsTiming = student.englishTests?.ielts?.studyTiming ?? '00:00';
            const toeflTiming = student.englishTests?.toefl?.studyTiming ?? '00:00';
            const pteTiming = student.englishTests?.pte?.studyTiming ?? '00:00';
            const duolingoTiming = student.englishTests?.duolingo?.studyTiming ?? '00:00';

            if (ieltsTiming >= startTime && ieltsTiming <= endTime) sheduledEnglishTests.push('International English Language Testing System');
            if (toeflTiming >= startTime && toeflTiming <= endTime) sheduledEnglishTests.push('Test of English as a Foreign Language');
            if (pteTiming >= startTime && pteTiming <= endTime) sheduledEnglishTests.push('Pearson Test of English');
            if (duolingoTiming >= startTime && duolingoTiming <= endTime) sheduledEnglishTests.push('Duolingo English Test');

            for (const englishTest of sheduledEnglishTests) {
                let testName: 'ielts' | 'toefl' | 'pte' | 'duolingo' = 'ielts';

                switch (englishTest) {
                    case 'International English Language Testing System':
                        testName = 'ielts';
                        break;
                    case 'Test of English as a Foreign Language':
                        testName = 'toefl';
                        break;
                    case 'Pearson Test of English':
                        testName = 'pte';
                        break;
                    default:
                        testName = 'duolingo';
                }

                const timingValue = student.englishTests?.[testName]?.studyTiming;
                const timingLabel = timeSlots.find(slot => slot.value === timingValue)?.label ?? 'Not set';

                const emailHTML = getEmailTemplate(`${student.firstName} ${student.lastName}`, englishTest, timingLabel);

                const randomNo = Math.floor(Math.random() * subjects.length);

                const info = await transporter.sendMail({
                    from: `${process.env.EMAIL_NAME} ${process.env.EMAIL}`,
                    to: student.email,
                    subject: subjects[randomNo],
                    html: emailHTML,
                });

                console.log(`✅ Sent ${englishTest} reminder to ${student.firstName} ${student.lastName} at ${student.email}`);
            }
        }
    } catch (error) {
        console.error('❌ Failed to send study reminders:', error);
    }
});
