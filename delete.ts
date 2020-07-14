import * as funcs from './config';
const pg = require('pg');
const AWS = require('aws-sdk');

AWS.config = {
    accessKeyId: process.env.ACCESS_ID,
    secretAccessKey: process.env.SECRET_ID,
};

exports.handler = async (event: any) => {
    let response;

    const pool = new pg.Pool(funcs.poolConfig);
    let username = funcs.getUsername(event.headers.Authorization);
    const s3Params = {
        Bucket: process.env.BUCKET_NAME,
        Key: event.body.filename
    };
    const s3 = new AWS.S3({
        accessKeyId: process.env.ACCESS_ID,
        secretAccessKey: process.env.SECRET_ID
    });
    await pool.query(`DELETE from public.crudts WHERE filename='${event.body.filename}' AND username='${username}'`)
        .then(async (res: any) => {
            pool.end();
            if (res.rowCount !== 0) {
                await s3.deleteObject(s3Params, function (err: any, data: any) {
                    if (err) {
                        response =  err;
                    } else {
                        response = {
                            message: "File deleted successfully.",
                            body: data
                        }
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
        .catch((err: any) => {
            pool.end();
            response = {
                message: "Something went wrong.",
                body: err
            }
        });

    return response;

}