import nodemailer from "nodemailer";

const sendPasswordResetEmail = async (email, resetToken) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: process.env.EMAIL_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request - CarePoint',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Password Reset</title>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                        .content { background-color: #ffffff; padding: 30px; border: 1px solid #e9ecef; }
                        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #6c757d; }
                        .btn { display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; }
                        .btn:hover { background-color: #0056b3; }
                        .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 4px; margin: 20px 0; }
                        .security-note { background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 20px 0; font-size: 14px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1 style="margin: 0; color: #007bff;">🔒 Password Reset Request</h1>
                        </div>
                        
                        <div class="content">
                            <h2>Hello,</h2>
                            
                            <p>We received a request to reset your password for your CarePoint account associated with <strong>${email}</strong>.</p>
                            
                            <p>If you made this request, click the button below to reset your password:</p>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${resetUrl}" class="btn">Reset My Password</a>
                            </div>
                            
                            <p>Or copy and paste this link into your browser:</p>
                            <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 4px; font-family: monospace;">
                                ${resetUrl}
                            </p>
                            
                            <div class="warning">
                                <strong>⚠️ Important Security Information:</strong>
                                <ul>
                                    <li>This link will expire in <strong>1 hour</strong></li>
                                    <li>This link can only be used once</li>
                                    <li>If you didn't request this reset, please ignore this email</li>
                                </ul>
                            </div>
                            
                            <div class="security-note">
                                <strong>🛡️ Security Tips:</strong>
                                <ul>
                                    <li>Choose a strong password with at least 6 characters including numbers</li>
                                    <li>Don't reuse your current password</li>
                                    <li>Never share your password with anyone</li>
                                    <li>Consider using a password manager</li>
                                </ul>
                            </div>
                            
                            <p>If you continue to have problems, please contact our support team.</p>
                            
                            <p>Best regards,<br>
                            <strong>The CarePoint Team</strong></p>
                        </div>
                        
                        <div class="footer">
                            <p>This is an automated message, please do not reply to this email.</p>
                            <p>If you didn't request this password reset, you can safely ignore this email.</p>
                            <p>&copy; ${new Date().getFullYear()} CarePoint. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Password reset email sent:', result.messageId);
        return true;
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw new Error('Failed to send password reset email');
    }
};

export default sendPasswordResetEmail;
