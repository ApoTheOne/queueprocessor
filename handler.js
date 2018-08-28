'use strict';
const sqs = require('./sqs');
const s3 = require('./s3');

const sqsUrl = process.env.sqsUrl;
const s3Url = process.env.s3Url;

module.exports.process = (event, context, callback) => {
    sqs.getMessages(sqsUrl, function(err, data) {
        if (err) {
            console.error(err, null, 2);
            callback(err);
        } else if (data.Messages) {
            console.log(data.Messages, null, 2);
            const receiptHandle = data.Messages[0].ReceiptHandle;
            s3.putObject(s3Url, data.Messages[0], function(err, data) {
                if (err) {
                    console.error(err, null, 2);
                    callback(err);
                } else {
                    sqs.deleteMessage(sqsUrl, receiptHandle, function(
                        error,
                        response
                    ) {
                        if (error) {
                            console.error(error, null, 2);
                            callback(error);
                        } else {
                            callback(null, response);
                        }
                    });
                }
            });
        }
    });
};
