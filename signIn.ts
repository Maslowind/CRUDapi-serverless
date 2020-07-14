import * as funcs from './config';
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
require('cross-fetch/polyfill');

interface Result {
    message: string;
    accessToken?: string;
    error?: any
}

exports.handler = async (event: any) => {
    let authenticationData = {
        Username: event.body.email,
        Password: event.body.password,
    };
    let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

    let userPool = new AmazonCognitoIdentity.CognitoUserPool(funcs.poolData);
    let userData = {
        Username: event.body.email,
        Pool: userPool,
    };
    let res: Result = { message: '' };
    let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    return new Promise((resolve, reject) =>
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result: any) {
                let accessToken = result.getIdToken().getJwtToken();
                res.message = "Successfully logged!";
                res.accessToken = accessToken;
                resolve(res)
            },
            onFailure: function (err: any) {
                res.message = "Something went wrong";
                res.error = err;
                reject(res);
            },
        }));
};
