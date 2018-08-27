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
            console.log('Error while receiving message: ', error);
            cb(error);
        } else if (data.Messages) {
            console.log(data.Messages, null, 2);
            cb(null, data);
        }
    });
};

module.exports.deleteMessage = function deleteMsg(queueUrl, receiptHandle, cb) {
    const deleteParams = {
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle
    };
    sqs.deleteMessage(deleteParams, function(err, data) {
        if (err) {
            console.log(`Error while deleting message : ${err}`);
            cb(err);
        } else {
            console.log(`Message deleted: ${deleteParams.ReceiptHandle}`);
            cb(null, {
                statusCode: 200,
                body: 'Message processed and deleted.'
            });
        }
    });
};
