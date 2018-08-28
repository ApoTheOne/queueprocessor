'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

module.exports.putObject = function putObject(s3Url, body, cb) {
    const jsonBody = JSON.parse(body.Body);
    const bufferObject = new Buffer.from(jsonBody.body, 'utf-8');
    const reqParams = {
        Bucket: s3Url,
        Key: 'mail.html',
        Body: bufferObject
    };

    s3.putObject(reqParams, function(error, data) {
        if (error) {
            console.error(error, null, 2);
            cb(error);
        } else if (data) {
            cb(null, data);
        }
    });
};
