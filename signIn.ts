import { bodyOfAuth } from './config';
import { APIGatewayEvent } from 'aws-lambda';
const AWS = require('aws-sdk');
require('cross-fetch/polyfill');

interface ResultSignIn {
    message?: string;
    IdToken?: string;
    error?: string
}
interface AuthenticationRes {
    AuthenticationResult:{IdToken:string}
}
exports.handler = async (event: APIGatewayEvent) => {
    let eventBody = event.body as unknown as bodyOfAuth;
    let cognito = new AWS.CognitoIdentityServiceProvider();
    const payload = {
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: String(process.env.CLIENT_ID),
        AuthParameters: {
            USERNAME: eventBody.email,
            PASSWORD: eventBody.password,
        }
    }
    let result: ResultSignIn = {};
    await cognito.initiateAuth(payload).promise()
        .then((res: AuthenticationRes) => {
            result.message = "Successfully logged"
            result.IdToken = res.AuthenticationResult.IdToken;
        })
        .catch((err: string) => {
            result.message = "Something went wrong"
            result.error = err;
        })
    return result;
};
