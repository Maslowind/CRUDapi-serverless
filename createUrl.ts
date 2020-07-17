import * as funcs from './config';
import { APIGatewayEvent } from 'aws-lambda';
const AWS = require('aws-sdk');
const Boom = require('@hapi/boom');

function getId() {
    return Math.random().toString(9).substr(2, 15);
};

export interface BodyOfCreateUrl {
    'content-type': string;
}

exports.handler = async (event: APIGatewayEvent) => {
    let eventBody = event.body as unknown as BodyOfCreateUrl;
    let contentType = eventBody['content-type'].split('/')[1];
    if (eventBody['content-type'].split('/')[0] !== 'image') {
        let err = new Error(`Content-type must be 'image/*'`);
        return Boom.boomify(err, { statusCode: 400 });
    }

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