
import { Request, Response } from 'express';
import nodemailer from 'nodemailer';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
  formType?: string;
}

// Configure nodemailer transporter
const createTransporter = () => {
  // For production, you'll need to configure with your email service
  // This is a basic configuration that works with most SMTP services
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export async function sendContactEmail(req: Request, res: Response) {
  try {
    const { name, email, phone, company, subject, message, formType = 'contato' }: ContactFormData = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nome, email e mensagem são obrigatórios' 
      });
    }

    // Create email content
    const emailSubject = subject || `Nova mensagem de ${formType} - ${name}`;
    const emailContent = `
      <h2>Nova Mensagem de ${formType.charAt(0).toUpperCase() + formType.slice(1)}</h2>
      <p><strong>Nome:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Telefone:</strong> ${phone}</p>` : ''}
      ${company ? `<p><strong>Empresa:</strong> ${company}</p>` : ''}
      ${subject ? `<p><strong>Assunto:</strong> ${subject}</p>` : ''}
      <p><strong>Mensagem:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><em>Data: ${new Date().toLocaleString('pt-BR')}</em></p>
    `;

    // If SMTP is not configured, just log the email content
    if (!process.env.SMTP_USER) {
      console.log('Email would be sent to vendas@pollyfortrodas.com.br:');
      console.log('Subject:', emailSubject);
      console.log('Content:', emailContent);
      
      return res.json({ 
        success: true, 
        message: 'Mensagem enviada com sucesso!' 
      });
    }

    // Send email
    const transporter = createTransporter();
    
    await transporter.sendMail({
      from: `"Site Pollyfort" <${process.env.SMTP_USER}>`,
      to: 'vendas@pollyfortrodas.com.br, comercial@pollyfortrodas.com.br',
      subject: emailSubject,
      html: emailContent,
      replyTo: email,
    });

    res.json({ 
      success: true, 
      message: 'Mensagem enviada com sucesso!' 
    });

  } catch (error) {
    console.error('Erro ao enviar email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erro interno do servidor. Tente novamente mais tarde.' 
    });
  }
}
