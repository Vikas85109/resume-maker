const nodemailer = require('nodemailer');
const { getPool } = require('../config/database');

// Create transporter (configure based on your email provider)
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Replace template variables
const replaceVariables = (template, variables) => {
  let result = template;
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, value);
  }
  return result;
};

// Get email template by slug
const getTemplate = async (slug) => {
  const pool = getPool();
  const [templates] = await pool.query(
    'SELECT * FROM email_templates WHERE slug = ? AND is_active = TRUE',
    [slug]
  );
  return templates[0] || null;
};

// Log email
const logEmail = async (userId, templateId, toEmail, subject, body, status, errorMessage = null) => {
  try {
    const pool = getPool();
    await pool.query(
      `INSERT INTO email_logs (user_id, template_id, to_email, subject, body, status, error_message, sent_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, templateId, toEmail, subject, body, status, errorMessage, status === 'sent' ? new Date() : null]
    );
  } catch (error) {
    console.error('Failed to log email:', error.message);
  }
};

// Send email using template
const sendTemplateEmail = async (templateSlug, toEmail, variables, userId = null) => {
  try {
    const template = await getTemplate(templateSlug);
    if (!template) {
      throw new Error(`Email template '${templateSlug}' not found`);
    }

    const subject = replaceVariables(template.subject, variables);
    const body = replaceVariables(template.body, variables);

    // Check if SMTP is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('📧 Email would be sent (SMTP not configured):');
      console.log('  To:', toEmail);
      console.log('  Subject:', subject);

      await logEmail(userId, template.id, toEmail, subject, body, 'pending', 'SMTP not configured');

      return { success: true, message: 'Email queued (SMTP not configured)' };
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'ResumeBuilder'}" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: subject,
      html: body
    };

    await transporter.sendMail(mailOptions);
    await logEmail(userId, template.id, toEmail, subject, body, 'sent');

    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Send email error:', error);
    await logEmail(userId, null, toEmail, '', '', 'failed', error.message);
    return { success: false, message: error.message };
  }
};

// Send custom email (without template)
const sendCustomEmail = async (toEmail, subject, body, userId = null) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('📧 Email would be sent (SMTP not configured):');
      console.log('  To:', toEmail);
      console.log('  Subject:', subject);

      await logEmail(userId, null, toEmail, subject, body, 'pending', 'SMTP not configured');

      return { success: true, message: 'Email queued (SMTP not configured)' };
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME || 'ResumeBuilder'}" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: subject,
      html: body
    };

    await transporter.sendMail(mailOptions);
    await logEmail(userId, null, toEmail, subject, body, 'sent');

    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Send custom email error:', error);
    await logEmail(userId, null, toEmail, subject, body, 'failed', error.message);
    return { success: false, message: error.message };
  }
};

// Send welcome email
const sendWelcomeEmail = async (user) => {
  return sendTemplateEmail('welcome', user.email, {
    name: user.name,
    email: user.email
  }, user.id);
};

// Send payment confirmation email
const sendPaymentConfirmationEmail = async (user, transaction, invoice) => {
  return sendTemplateEmail('payment_confirmation', user.email, {
    name: user.name,
    amount: `₹${transaction.amount}`,
    plan_name: transaction.plan_name || 'Premium Plan',
    invoice_number: invoice.invoice_number
  }, user.id);
};

// Send password reset email
const sendPasswordResetEmail = async (user, resetLink) => {
  return sendTemplateEmail('password_reset', user.email, {
    name: user.name,
    reset_link: resetLink
  }, user.id);
};

// Send ticket created notification
const sendTicketCreatedEmail = async (user, ticket) => {
  return sendTemplateEmail('ticket_created', user.email, {
    name: user.name,
    ticket_number: ticket.ticket_number,
    subject: ticket.subject
  }, user.id);
};

// Send ticket reply notification
const sendTicketReplyEmail = async (user, ticket, message) => {
  return sendTemplateEmail('ticket_reply', user.email, {
    name: user.name,
    ticket_number: ticket.ticket_number,
    message: message
  }, user.id);
};

module.exports = {
  sendTemplateEmail,
  sendCustomEmail,
  sendWelcomeEmail,
  sendPaymentConfirmationEmail,
  sendPasswordResetEmail,
  sendTicketCreatedEmail,
  sendTicketReplyEmail,
  getTemplate,
  replaceVariables
};
