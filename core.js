const sqs = require('./sqs');
const s3 = require('./s3');

const sqsUrl = process.env.sqsUrl;
const s3Url = process.env.s3Url;

module.exports.execute = function execute(callback) {
    sqs.getMessages(sqsUrl, function(getMsgErr, data) {
        if (getMsgErr) {
            console.error(getMsgErr, null, 2);
            callback(getMsgErr);
        } else if (data.Messages) {
            console.log(data.Messages, null, 2);
            const receiptHandle = data.Messages[0].ReceiptHandle;
            s3.putObject(s3Url, data.Messages[0], function(putObjErr, data) {
                if (putObjErr) {
                    console.error(putObjErr, null, 2);
                    callback(putObjErr);
                } else {
                    sqs.deleteMessage(sqsUrl, receiptHandle, function(
                        deletionErr,
                        response
                    ) {
                        if (deletionErr) {
                            console.error(deletionErr, null, 2);
                            callback(deletionErr);
                        } else {
                            callback(null, response);
                        }
                    });
                }
            });
        }
    });
};
