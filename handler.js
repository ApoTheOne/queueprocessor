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

            deleteMsg();

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
