import * as funcs from './config';
const AWS = require('aws-sdk');

function getId() {
    return Math.random().toString(9).substr(2, 15);
};

exports.handler = async (event: any) => {
    let username = funcs.getUsername(event.headers.Authorization);
    let filename = `${username}&&${getId()}.png`;

    let s3 = new AWS.S3();
    const s3Params = {
        Bucket: process.env.BUCKET_NAME,
        Fields: {
            acl: 'public-read',
            key: filename,
        },
        Conditions: [
            ["content-length-range", 0, 10000000], // 10 Mb                    
        ],
        Expires: 900
    };
    return await s3.createPresignedPost(s3Params);

}