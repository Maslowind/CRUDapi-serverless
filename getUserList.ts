import * as funcs from './config';
import { DbStructure, ResOfRDS} from './config';
import { APIGatewayEvent } from 'aws-lambda';
const pg = require('pg');

export const handler = async (event: APIGatewayEvent) => {
    let response;
    const pool = new pg.Pool(funcs.poolConfig);
    let username = funcs.getUsername(event.headers.Authorization);
    let result: Array<DbStructure> = [];
    await pool.query(`SELECT * FROM public.crudts WHERE username = '${username}'`)
        .then((res: ResOfRDS) => {
            console.log(res)
            pool.end();
            res.rows.forEach(function (entry: DbStructure) {
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