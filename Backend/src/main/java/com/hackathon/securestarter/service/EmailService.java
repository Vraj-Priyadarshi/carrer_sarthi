package com.hackathon.securestarter.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.email.from:noreply@careersaarthi.com}")
    private String fromEmail;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    /**
     * Send verification email to new user
     */
    public void sendVerificationEmail(String toEmail, String token) {
        try {
            String verificationUrl = frontendUrl + "/verify?token=" + token;
            String subject = "Verify Your Email - Career Saarthi";
            String body = buildVerificationEmailHtml(verificationUrl);
            sendHtmlEmail(toEmail, subject, body);
            log.info("Verification email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send verification email to: {}", toEmail, e);
        }
    }

    /**
     * Send password reset email
     */
    public void sendPasswordResetEmail(String toEmail, String token) {
        try {
            String resetUrl = frontendUrl + "/reset-password?token=" + token;
            String subject = "Reset Your Password - Career Saarthi";
            String body = buildPasswordResetEmailHtml(resetUrl);
            sendHtmlEmail(toEmail, subject, body);
            log.info("Password reset email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send password reset email to: {}", toEmail, e);
        }
    }

    /**
     * Send welcome email after successful verification
     */
    public void sendWelcomeEmail(String toEmail, String firstName) {
        try {
            String subject = "Welcome to Career Saarthi!";
            String body = buildWelcomeEmailHtml(firstName);
            sendHtmlEmail(toEmail, subject, body);
            log.info("Welcome email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send welcome email to: {}", toEmail, e);
        }
    }

    /**
     * Send HTML email
     */
    private void sendHtmlEmail(String to, String subject, String htmlBody) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlBody, true);
        mailSender.send(message);
    }

    /**
     * Email template base wrapper
     */
    private String wrapInTemplate(String content) {
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Career Saarthi</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a;">
                <table role="presentation" style="width: 100%%; border-collapse: collapse;">
                    <tr>
                        <td align="center" style="padding: 40px 20px;">
                            <table role="presentation" style="max-width: 600px; width: 100%%; border-collapse: collapse;">
                                <!-- Header -->
                                <tr>
                                    <td style="text-align: center; padding-bottom: 30px;">
                                        <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff;">
                                            <span style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Career Saarthi</span>
                                        </h1>
                                        <p style="margin: 8px 0 0; font-size: 14px; color: #94a3b8;">AI-Powered Career Intelligence</p>
                                    </td>
                                </tr>
                                <!-- Content Card -->
                                <tr>
                                    <td style="background: linear-gradient(145deg, #1e293b, #0f172a); border-radius: 16px; border: 1px solid #334155; padding: 40px;">
                                        %s
                                    </td>
                                </tr>
                                <!-- Footer -->
                                <tr>
                                    <td style="text-align: center; padding-top: 30px;">
                                        <p style="margin: 0; font-size: 12px; color: #64748b;">
                                            Career Saarthi - Your AI Career Guide
                                        </p>
                                        <p style="margin: 8px 0 0; font-size: 12px; color: #475569;">
                                            Healthcare | Agriculture | Urban Technology
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """.formatted(content);
    }

    /**
     * Build verification email HTML
     */
    private String buildVerificationEmailHtml(String verificationUrl) {
        String content = """
            <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 600; color: #ffffff;">Verify Your Email</h2>
            <p style="margin: 0 0 20px; font-size: 16px; color: #cbd5e1; line-height: 1.6;">
                Thank you for joining Career Saarthi! You're one step away from unlocking AI-powered career insights tailored to Healthcare, Agriculture, and Urban Technology sectors.
            </p>
            <p style="margin: 0 0 30px; font-size: 16px; color: #cbd5e1; line-height: 1.6;">
                Please verify your email address by clicking the button below:
            </p>
            <table role="presentation" style="width: 100%%; border-collapse: collapse;">
                <tr>
                    <td align="center">
                        <a href="%s" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #6366f1); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                            Verify Email Address
                        </a>
                    </td>
                </tr>
            </table>
            <p style="margin: 30px 0 0; font-size: 14px; color: #94a3b8; line-height: 1.6;">
                This link will expire in 24 hours. If you didn't create an account with Career Saarthi, you can safely ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #334155; margin: 30px 0;">
            <p style="margin: 0; font-size: 12px; color: #64748b;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="%s" style="color: #3b82f6; word-break: break-all;">%s</a>
            </p>
            """.formatted(verificationUrl, verificationUrl, verificationUrl);
        return wrapInTemplate(content);
    }

    /**
     * Build password reset email HTML
     */
    private String buildPasswordResetEmailHtml(String resetUrl) {
        String content = """
            <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 600; color: #ffffff;">Reset Your Password</h2>
            <p style="margin: 0 0 20px; font-size: 16px; color: #cbd5e1; line-height: 1.6;">
                We received a request to reset the password for your Career Saarthi account. Click the button below to create a new password:
            </p>
            <table role="presentation" style="width: 100%%; border-collapse: collapse;">
                <tr>
                    <td align="center" style="padding: 10px 0 30px;">
                        <a href="%s" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #6366f1); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                            Reset Password
                        </a>
                    </td>
                </tr>
            </table>
            <div style="background-color: rgba(251, 191, 36, 0.1); border: 1px solid rgba(251, 191, 36, 0.3); border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                <p style="margin: 0; font-size: 14px; color: #fbbf24;">
                    <strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
                </p>
            </div>
            <hr style="border: none; border-top: 1px solid #334155; margin: 20px 0;">
            <p style="margin: 0; font-size: 12px; color: #64748b;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="%s" style="color: #3b82f6; word-break: break-all;">%s</a>
            </p>
            """.formatted(resetUrl, resetUrl, resetUrl);
        return wrapInTemplate(content);
    }

    /**
     * Build welcome email HTML
     */
    private String buildWelcomeEmailHtml(String firstName) {
        String name = firstName != null && !firstName.isEmpty() ? firstName : "there";
        String content = """
            <h2 style="margin: 0 0 20px; font-size: 24px; font-weight: 600; color: #ffffff;">Welcome to Career Saarthi!</h2>
            <p style="margin: 0 0 20px; font-size: 16px; color: #cbd5e1; line-height: 1.6;">
                Hi %s,
            </p>
            <p style="margin: 0 0 20px; font-size: 16px; color: #cbd5e1; line-height: 1.6;">
                Your email has been verified and your account is now active. You're ready to explore AI-powered career guidance in emerging tech sectors.
            </p>
            <div style="background-color: rgba(59, 130, 246, 0.1); border-radius: 12px; padding: 24px; margin: 20px 0;">
                <h3 style="margin: 0 0 16px; font-size: 18px; font-weight: 600; color: #3b82f6;">What you can do now:</h3>
                <ul style="margin: 0; padding-left: 20px; color: #cbd5e1; line-height: 1.8;">
                    <li>Complete your profile to get personalized recommendations</li>
                    <li>Discover skill gaps and learning paths</li>
                    <li>Explore careers in Healthcare, Agriculture, and Urban Tech</li>
                    <li>Get AI-powered course and project suggestions</li>
                </ul>
            </div>
            <table role="presentation" style="width: 100%%; border-collapse: collapse;">
                <tr>
                    <td align="center" style="padding: 10px 0;">
                        <a href="%s/login" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #6366f1); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600;">
                            Go to Dashboard
                        </a>
                    </td>
                </tr>
            </table>
            <p style="margin: 30px 0 0; font-size: 14px; color: #94a3b8; line-height: 1.6;">
                If you have any questions, feel free to reach out. We're here to help you shape your future in emerging technology.
            </p>
            """.formatted(name, frontendUrl);
        return wrapInTemplate(content);
    }
}