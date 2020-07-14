import * as funcs from './config';
const pg = require('pg');

exports.handler = async (event:any) => {
    let filename = event.Records[0].s3.object.key;
    let decodedFilename =decodeURIComponent(filename);
    let generatedURL = `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${filename}`
    const pool = new pg.Pool(funcs.poolConfig);
    let username = decodedFilename.split('&&')[0];
    if (username !== undefined) {
        await pool.query(`INSERT INTO crudts (username, filename, url) VALUES ('${username}', '${decodedFilename}', '${generatedURL}')`) //test insert to table
            .then((res: any) => {
                console.log(res);
                pool.end();
            })
            .catch((err: any) => {
                console.error(err);
                pool.end();
            });

        return {
            statusCode: 200,
            message: "File uploaded successfully.",
        }
    }else return {
        statusCode: 400,
        message: "Something went wrong.",
    }

}