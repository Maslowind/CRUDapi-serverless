import * as funcs from './config';
import { APIGatewayEvent } from 'aws-lambda';
const AWS = require('aws-sdk');

function getId() {
    return Math.random().toString(9).substr(2, 15);
};

export interface bodyOfCreateUrl {
    'content-type': string;
}

exports.handler = async (event: APIGatewayEvent) => {
    console.log(event);
    let eventBody = event.body as unknown as bodyOfCreateUrl;
    let contentType = eventBody['content-type'].split('/')[1];
    if (eventBody['content-type'].split('/')[0] !== 'image')
        return { message: `Content-type must be 'image/*'` }
    let username = funcs.getUsername(event.headers.Authorization);
    let filename = `${username}&&${getId()}.${contentType}`;

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