import * as funcs from '../config';
import { ErrorInterface } from '../config';
import { APIGatewayEvent } from 'aws-lambda';
import pg from 'pg';
import AWS from 'aws-sdk';
import Boom from '@hapi/boom';
import { DeleteObjectRequest } from 'aws-sdk/clients/s3';

export interface BodyOfDelete {
    filename: string;
}

exports.handler = async (event: APIGatewayEvent) => {
    let eventBody = event.body as unknown as BodyOfDelete;
    const pool = new pg.Pool(funcs.poolConfig);
    let username = funcs.getUsername(event.headers.Authorization);

    const s3Params: DeleteObjectRequest = {
        Bucket: process.env.BUCKET_NAME!,
        Key: eventBody.filename
    };
    const s3 = new AWS.S3();

    let deleteRes = await pool.query(`DELETE from public.crudts WHERE filename='${eventBody.filename}' AND username='${username}'`)
        .catch((err: ErrorInterface) => {
            throw Boom.badImplementation(err.message);
        });

    pool.end();
    if (deleteRes.rowCount === 0) {
        throw Boom.badRequest('Object not found');
    }
    await s3.deleteObject(s3Params).promise();
    return { message: "File deleted successfully" };

}