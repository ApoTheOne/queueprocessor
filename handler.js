'use strict';
const AWS = require('aws-sdk');
const mailer = require('nodemailer');

const s3 = new AWS.S3();
const sqs = new AWS.SQS();

var sqsParams = {
    QueueUrl: process.env.sqsUrl
};

module.exports.process = (event, context, callback) => {
    sqs.receiveMessage(sqsParams, function(err, data) {
        if (err) {
            console.log('Receive Error', err);
        } else if (data.Messages) {
            var deleteParams = {
                QueueUrl: sqsParams.QueueUrl,
                ReceiptHandle: data.Messages[0].ReceiptHandle
            };
            var startDateTime = Date.now();
            console.log(data.Messages, null, 2);

            const response = {
                statusCode: 200,
                body: JSON.stringify(data.Messages[0])
            };

            sendEmail();
            deleteMsg();

            function sendEmail() {
                nodemailer.createTestAccount((err, account) => {
                    let transporter = nodemailer.createTransport({
                        host: '145.224.216.21',
                        port: 25,
                        secure: false
                    });

                    var mailMsg = JSON.parse(data.Messages[0]);

                    let mailOptions = {
                        from: mailMsg.from,
                        to: mailMsg.to,
                        subject: mailMsg.subject,
                        html: mailMsg.body
                    };

                    transporter.sendEmail(mailOptions, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                        console.log(`Message sent ${info.messageId}`);
                        console.log(
                            `Preview URL : ${nodemailer.getTestMessageUrl(
                                info
                            )}`
                        );
                    });
                });
            }

            function deleteMsg() {
                sqs.deleteMessage(deleteParams, function(err, data) {
                    if (err) {
                        console.log(`Oooops error : ${err}`);
                        callback(err);
                    } else {
                        console.log(
                            `Message deleted: ${
                                deleteParams.ReceiptHandle
                            } after ${Math.floor(
                                (Date.now() - startDateTime) / 1000
                            )} seconds. Remaining Time : ${context.getRemainingTimeInMillis()}`
                        );
                        callback(null, response);
                    }
                });
            }
        }
    });

    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
