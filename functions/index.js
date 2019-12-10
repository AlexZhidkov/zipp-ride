'use strict';

const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
// Configure the email transport using the default SMTP transport and a GMail account.
// For Gmail, enable these:
// 1. https://www.google.com/settings/security/lesssecureapps
// 2. https://accounts.google.com/DisplayUnlockCaptcha
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const emailReceiver = functions.config().email.receiver;

const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmailEmail,
        pass: gmailPassword,
    },
});

// Your company name to include in the emails
const APP_NAME = 'ZIPP Ride';

/**
 * Sends an email for each new document in firestore collection.
 */
exports.sendEmail = functions.region('asia-east2').firestore
    .document('events/{emailId}')
    .onCreate((snap, context) => {
        return sendNotificationEmail(snap.data());
    });

// Sends a notification email
async function sendNotificationEmail(event) {
    const mailOptions = {
        from: `${APP_NAME}`,
        to: emailReceiver,
    };

    mailOptions.subject = event.event;
    mailOptions.text = JSON.stringify(event.data);
    const booking = event.data;
    mailOptions.text =
        `Booking Time: ${booking.timeString},` +
        `Pick-up Address: ${booking.pickup} , ` +
        `Destination: ${booking.destination} , ` +
        `Number of Seats: ${booking.seats} , ` +
        `Customer Name: ${booking.name} , ` +
        `Phone Number: ${booking.phone} , ` +
        `Email: ${booking.email} , ` +
        `Booking created: ${booking.createdOnString}`;
    mailOptions.html =
        `<p>Booking Time: ${booking.timeString} </p>` +
        `<p>Pick-up Address: ${booking.pickup}</p>` +
        `<p>Destination: ${booking.destination}</p>` +
        `<p>Number of Seats: ${booking.seats}</p>` +
        `<p>Customer Name: ${booking.name}</p>` +
        `<p>Phone Number: ${booking.phone}</p>` +
        `<p>Email: ${booking.email}</p>` +
        `<p>Booking created: ${booking.createdOnString}</p>`;

    await mailTransport.sendMail(mailOptions);
    console.log('Notification email sent to:', emailReceiver);
    return null;
}

