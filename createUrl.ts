import * as funcs from './config';
const AWS = require('aws-sdk');

function getId() {
    return Math.random().toString(9).substr(2, 15);
};

exports.handler = async (event: any) => {
    console.log(event);
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
    let uploadURL = await s3.createPresignedPost(s3Params);
    let res = {
        statusCode: 200,
        uploadURL
    }
    return res;

}