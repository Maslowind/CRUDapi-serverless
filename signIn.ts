import * as funcs from './config';
import { bodyOfAuth } from './config';
import { APIGatewayEvent } from 'aws-lambda';
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
require('cross-fetch/polyfill');

interface ResultSignIn {
    message: string;
    accessToken?: string;
    error?: string
}
interface CognitoUserSession {
    idToken: { jwtToken: string }
}

exports.handler = async (event: APIGatewayEvent) => {
    let eventBody = event.body as unknown as bodyOfAuth;
    let authenticationData = {
        Username: eventBody.email,
        Password: eventBody.password,
    };
    let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

    let userPool = new AmazonCognitoIdentity.CognitoUserPool(funcs.poolData);
    let userData = {
        Username: eventBody.email,
        Pool: userPool,
    };
    let res: ResultSignIn = { message: '' };
    let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    return new Promise((resolve, reject) =>
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result: CognitoUserSession) {
                let accessToken = result.idToken.jwtToken;
                res.message = "Successfully logged!";
                res.accessToken = accessToken;
                resolve(res)
            },
            onFailure: function (err: string) {
                console.log(err)
                res.message = "Something went wrong";
                res.error = err;
                reject(res);
            },
        }));
};
