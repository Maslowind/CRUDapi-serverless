import * as funcs from './config';
import { dbStructure, resOfRDS} from './config';
import { APIGatewayEvent } from 'aws-lambda';
const pg = require('pg');

export const handler = async (event: APIGatewayEvent) => {
    let response;
    const pool = new pg.Pool(funcs.poolConfig);
    let username = funcs.getUsername(event.headers.Authorization);
    let result: Array<dbStructure> = [];
    await pool.query(`SELECT * FROM public.crudts WHERE username = '${username}'`)
        .then((res: resOfRDS) => {
            console.log(res)
            pool.end();
            res.rows.forEach(function (entry: dbStructure) {
                result.push({ filename: entry.filename, url: entry.url })
            })
            response = {
                body: result
            }
        })
        .catch((err: string) => {
            console.log(err)
            pool.end();
            response = {
                body: err
            };
        });
    return response;

}