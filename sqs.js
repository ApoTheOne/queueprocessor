'use strict';

const AWS = require('aws-sdk');
const sqs = new AWS.SQS();
const maxNumberOfMessages = 1;

module.exports.getMessages = function getMessages(queueUrl, cb) {
    const sqsParams = {
        QueueUrl: queueUrl,
        MaxNumberOfMessages: maxNumberOfMessages
    };
    sqs.receiveMessage(sqsParams, function(error, data) {
        if (error) {
            console.error(error, null, 2);
            cb(error, null, 2);
        } else if (data.Messages) {
            console.log(data.Messages, null, 2);
            cb(null, data);
        }
    });
};

module.exports.deleteMessage = function deleteMessage(
    queueUrl,
    receiptHandle,
    cb
) {
    const deleteParams = {
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle
    };
    sqs.deleteMessage(deleteParams, function(err, data) {
        if (err) {
            console.error(err, null, 2);
            cb(err);
        } else {
            cb(null, {
                statusCode: 200,
                body: 'Message processed and deleted.'
            });
        }
    });
};
