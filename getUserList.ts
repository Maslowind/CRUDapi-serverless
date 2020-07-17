import * as funcs from './config';
import { DbStructure} from './config';
import { APIGatewayEvent } from 'aws-lambda';
const pg = require('pg');
const Boom = require('@hapi/boom');

export const handler = async (event: APIGatewayEvent) => {
    const pool = new pg.Pool(funcs.poolConfig);
    let username = funcs.getUsername(event.headers.Authorization);
    let result = await pool.query(`SELECT * FROM public.crudts WHERE username = '${username}'`)
        .catch((err: string) => {
            console.error(err)
            return Boom.boomify(err, { statusCode: 400 });
        });
    pool.end();
    if (result.rows !== undefined) {
        let finRes: Array<DbStructure> = [];
        result.rows.forEach(function (entry: DbStructure) {
            finRes.push({ filename: entry.filename, url: entry.url })
        })
        return finRes;
    }
    return result;
}