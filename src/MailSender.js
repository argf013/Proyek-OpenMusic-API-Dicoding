const nodemailer = require('nodemailer');

class MailSender {
    constructor() {
        this._transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_ADDRESS,
                pass: process.env.MAIL_PASSWORD,
            },
        });
    }

    sendEmail(targetEmail, playlistName, content) {
        const message = {
            from: 'OpenMusic Api',
            to: targetEmail,
            subject: `Ekspor Lagu dari Playlist bernama ${playlistName}`,
            text: 'Berikut adalah file nya: ',
            attachments: [
                {
                    filename: `${playlistName}.json`,
                    content,
                },
            ],
        };

        return this._transporter.sendMail(message);
    }
}

module.exports = MailSender;