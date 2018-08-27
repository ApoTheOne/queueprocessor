'use strict';
const sqs = require('./sqs');
const s3 = require('./s3');

const sqsUrl = 'https://sqs.us-east-1.amazonaws.com/338805238106/test.fifo';
const s3Url = 'process-emails-dev';

module.exports.process = (event, context, callback) => {
    sqs.getMessages(sqsUrl, function(err, data) {
        if (err) {
            console.log(`Error in getting messages ${err}`);
            callback(err);
        } else if (data.Messages) {
            console.log(data.Messages, null, 2);
            s3.putObject(s3Url, data.Messages[0], function(err, data) {
                if (err) {
                    console.log(`Error while uploading data to s3: ${err}`);
                    callback(err);
                } else {
                    const response = {
                        statusCode: 200,
                        body: JSON.stringify(data)
                    };
                    callback(response);
                }
            });
        }
    });
};
