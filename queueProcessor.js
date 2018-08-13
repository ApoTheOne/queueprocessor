'use strict';
const AWS = require('aws-sdk');
const sqs = new AWS.SQS();
const s3 = new AWS.S3();
const s3Url = process.env.S3_BUCKET;
const sqsUrl = process.env.SQS_URL;

module.exports.process = (event, context, callback) => {
    //Step 1: receive message from SQS
    var reqParams = {
        QueueUrl: sqsUrl,
        ReceiveRequestAttemptId: 'reqAttemptId'
    };

    sqs.receiveMessage(reqParams, function(err, data) {
        if (err) console.log(err, err.stack);
        // an error occurred
        else console.log(data); // successful response
    });

    //Step 2: Put in S3

    //Step 3: Delete SQS message
    var params = {
        QueueUrl: 'sqsUrl',
        ReceiptHandle: data.ReceiptHandle
    };
    sqs.deleteMessage(params, function(err, data) {
        if (err) console.log(err, err.stack);
        // an error occurred
        else console.log(data); // successful response
    });

    // Return response
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Message read from SQS, deleted from SQS and moved to S3'
        })
    };

    callback(null, response);

    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // callback(null, { message: 'Go Serverless v1.0! Your function executed successfully!', event });
};
