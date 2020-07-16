import * as funcs from './config';
import { resOfRDS } from './config';
import { APIGatewayEvent } from 'aws-lambda';
const pg = require('pg');
const AWS = require('aws-sdk');

export interface bodyOfDelete {
    filename: string;
}
exports.handler = async (event: APIGatewayEvent) => {
    let response;
    let eventBody = event.body as unknown as bodyOfDelete;

    const pool = new pg.Pool(funcs.poolConfig);
    let username = funcs.getUsername(event.headers.Authorization);
    const s3Params = {
        Bucket: process.env.BUCKET_NAME,
        Key: eventBody.filename
    };
    const s3 = new AWS.S3();
    await pool.query(`DELETE from public.crudts WHERE filename='${eventBody.filename}' AND username='${username}'`)
        .then(async (res: resOfRDS) => {
            pool.end();
            if (res.rowCount !== 0) {
                await s3.deleteObject(s3Params, () => {
                    response = {
                        message: "File deleted successfully."
                    }
                }).promise()
            }
            else {
                response = {
                    message: "Something went wrong.",
                    body: res
                }
            }
        })
        .catch((err: string) => {
            pool.end();
            response = {
                message: "Something went wrong.",
                body: err
            }
        });

    return response;

}