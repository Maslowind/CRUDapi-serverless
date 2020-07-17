import * as funcs from '../config';
import { APIGatewayEvent } from 'aws-lambda';
import AWS from 'aws-sdk';
import Boom from '@hapi/boom';

function getId() {
    return Math.random().toString(9).substr(2, 15);
};

export interface BodyOfCreateUrl {
    contentType: string;
}

exports.handler = async (event: APIGatewayEvent) => {
    let eventBody = event.body as unknown as BodyOfCreateUrl;
    let contentType = eventBody.contentType;
    let contentTypeArray = contentType.split('/');
    let type = contentTypeArray[1];
    if (contentTypeArray[0] !== 'image') {
        throw Boom.badRequest(`Content-type must be 'image/*'`);
    }
    let username = funcs.getUsername(event.headers.Authorization);
    let filename = `${username}&&${getId()}.${type}`;

    let s3 = new AWS.S3();
    const s3Params = {
        Bucket: process.env.BUCKET_NAME,
        Fields: {
            acl: 'public-read',
            key: filename,
            'Content-Type':contentType
        },
        Conditions: [
            ["content-length-range", 0, 10000000], // 10 Mb                    
        ],
        Expires: 900
    };
    return s3.createPresignedPost(s3Params);

}