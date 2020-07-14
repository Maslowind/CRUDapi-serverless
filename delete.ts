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
            console.log(res.rowCount);
            pool.end();
            if (res.rowCount !== 0) {
                await s3.deleteObject(s3Params, function (err: any, data: any) {
                    if (err) {
                        console.error("s3", err);
                        response = {
                            statusCode: 400,
                            body: err
                        }
                    } else {
                        response = {
                            statusCode: 200,
                            message: "File deleted successfully.",
                            body: data
                        }
                    }
                }).promise()
            }
            else {
                response = {
                    statusCode: 400,
                    message: "Something went wrong.",
                    body: res
                }
            }
        })
        .catch((err: any) => {
            console.error("pool", err);
            pool.end();
            response = {
                statusCode: 400,
                message: "Something went wrong.",
                body: err
            }
        });

    return response;

}