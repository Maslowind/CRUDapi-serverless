import * as funcs from '../config';
import { DbStructure, ErrorInterface } from '../config';
import { APIGatewayEvent } from 'aws-lambda';
const pg = require('pg');
const Boom = require('@hapi/boom');

interface ResponseBody {
    rows: [DbStructure]
}

export const handler = async (event: APIGatewayEvent) => {
    const pool = new pg.Pool(funcs.poolConfig);
    let username = funcs.getUsername(event.headers.Authorization);
    let response: ResponseBody = await pool.query(`SELECT * FROM public.crudts WHERE username = '${username}'`)
        .catch((err: ErrorInterface) => {
            throw Boom.badRequest(err.message);
        });
    pool.end();
    if (response.rows !== undefined) {
        let finRes: Array<DbStructure> = [];
        response.rows.forEach(function (entry: DbStructure) {
            finRes.push({ filename: entry.filename, url: entry.url })
        })
        return finRes;
    }
    return response;
}