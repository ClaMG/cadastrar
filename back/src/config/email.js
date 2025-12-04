import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    auth: {
        user: 'erickclarkemoura@gmail.com',
        pass: "pudv uvbn lirv vqwi" // Use variáveis de ambiente (process.env.EMAIL_PASS)
    }
});