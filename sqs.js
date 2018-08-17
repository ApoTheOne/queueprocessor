'use strict';

const AWS = require('aws');
const sqs = new AWS.SQS();
const maxNumberOfMessages = 1;

module.exports.getMessages = function getMessage(queueUrl, callback) {
    var sqsParams = {
        QueueUrl: queueUrl,
        MaxNumberOfMessages: maxNumberOfMessages
    };
    sqs.receiveMessage(sqsParams, function(error, data) {
        if (error) {
            console.log('Error while receiving message: ', error);
            callback(error);
        } else if (data.Messages) {
            console.log(data.Messages, null, 2);
            //To do: put in S3
            deleteMessage(queueUrl, data.Messages[0].ReceiptHandle, callback);
        }
    });
};

module.exports.deleteMessage = function deleteMsg(
    queueUrl,
    receiptHandle,
    callback
) {
    var deleteParams = {
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle
    };
    sqs.deleteMessage(deleteParams, function(err, data) {
        if (err) {
            console.log(`Error while deleting message : ${err}`);
            callback(err);
        } else {
            console.log(`Message deleted: ${deleteParams.ReceiptHandle}`);
            callback(null, {
                statusCode: 200,
                body: 'Message processed and deleted.'
            });
        }
    });
};
