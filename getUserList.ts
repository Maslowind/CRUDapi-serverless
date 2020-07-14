import * as funcs from './config';
const pg = require('pg');

interface Result {
    filename: string;
    url: string;
}

exports.handler = async (event: any) => {
    let response;
    const pool = new pg.Pool(funcs.poolConfig);
    let username = funcs.getUsername(event.headers.Authorization);
    let result: Array<Result> = [];
    await pool.query(`SELECT * FROM public.crudts WHERE username = '${username}'`)
        .then((res: any) => {
            console.log(res.rows);
            pool.end();
            res.rows.forEach(function (entry: any) {
                result.push({ filename: entry.filename, url: entry.url })
            })
            response = {
                statusCode: 200,
                body: result
            }
        })
        .catch((err: any) => {
            console.error(err);
            pool.end();
            response = {
                statusCode: 400,
                body: err
            };
        });
        console.log(response)
    return response;

}