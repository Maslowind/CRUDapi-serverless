import { bodyOfAuth } from './config';
import { APIGatewayEvent } from 'aws-lambda';
const AWS = require('aws-sdk');
require('cross-fetch/polyfill');

exports.handler = async (event: APIGatewayEvent) => {
    let eventBody = event.body as unknown as bodyOfAuth;
    let cognito = new AWS.CognitoIdentityServiceProvider();
    let result: any = {};
    console.log(cognito);
    await cognito.signUp({
        ClientId: String(process.env.CLIENT_ID),
        Username: eventBody.email,
        Password: eventBody.password,
    }).promise()
        .then((res: string) => result = res)
        .catch((err: string) => result = err)
    return result;
};
