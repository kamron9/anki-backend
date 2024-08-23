const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'ariel16@ethereal.email',
		pass: 'DeaDxJb85jUR8kWz7r',
	},
})

const sendEmail = (to, subject, text) => {
	const mailOptions = {
		from: 'kamronalimov80@gmail.com',
		to,
		subject,
		text,
	}

	return transporter.sendMail(mailOptions)
}

module.exports = sendEmail
