import * as funcs from './config';
import { APIGatewayEvent } from 'aws-lambda';
const pg = require('pg');
const AWS = require('aws-sdk');
const Boom = require('@hapi/boom');

export interface BodyOfDelete {
    filename: string;
}

exports.handler = async (event: APIGatewayEvent) => {
    let response;
    let eventBody = event.body as unknown as BodyOfDelete;
    const pool = new pg.Pool(funcs.poolConfig);
    let username = funcs.getUsername(event.headers.Authorization);

    const s3Params = {
        Bucket: process.env.BUCKET_NAME,
        Key: eventBody.filename
    };
    const s3 = new AWS.S3();

    let deleteRes = await pool.query(`DELETE from public.crudts WHERE filename='${eventBody.filename}' AND username='${username}'`)
        .catch((err: String) => {
            response = Boom.boomify(err, { statusCode: 500, message: "Something went wrong" });
        });

    pool.end();
    console.log(deleteRes);
    console.log(deleteRes.rowCount);
    if (deleteRes.rowCount === 0) {
        let err = new Error('Object not found');
        response = Boom.boomify(err, { statusCode: 404 });
    } else {
        await s3.deleteObject(s3Params).promise();
        response = { message: "File deleted successfully" };
    }
    return response;
}