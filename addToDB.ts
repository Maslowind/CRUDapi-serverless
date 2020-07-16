import * as funcs from './config';
import { resOfRDS} from './config';
import { SNSEvent } from 'aws-lambda';
const pg = require('pg');

export interface bodyOfAddToDB {
    s3: { object: { key: string } };
}

exports.handler = async (event: SNSEvent) => {
    let eventRecords = event.Records[0] as unknown as bodyOfAddToDB;
    let filename = eventRecords.s3.object.key;
    let decodedFilename = decodeURIComponent(filename);
    let generatedURL = `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${filename}`
    const pool = new pg.Pool(funcs.poolConfig);
    let username = decodedFilename.split('&&')[0];
    if (username !== undefined) {
        await pool.query(`INSERT INTO crudts (username, filename, url) VALUES ('${username}', '${decodedFilename}', '${generatedURL}')`) //test insert to table
            .then((res: resOfRDS) => {
                console.log(res);
                pool.end();
            })
            .catch((err: string) => {
                console.error(err);
                pool.end();
            });

        return {
            message: 'File uploaded successfully.',
        }
    }

}