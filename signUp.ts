import * as funcs from './config';
import { bodyOfAuth } from './config';
import { APIGatewayEvent } from 'aws-lambda';
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
require('cross-fetch/polyfill');

interface ResultSignUp {
    user: { username: string }
}
exports.handler = async (event: APIGatewayEvent) => {
    let userPool = new AmazonCognitoIdentity.CognitoUserPool(funcs.poolData);
    let eventBody = event.body as unknown as bodyOfAuth;

    let attributeList: any[] = [];

    let dataEmail = {
        Name: 'email',
        Value: eventBody.email,
    };
    let dataName = {
        Name: 'name',
        Value: eventBody.email,
    };
    let attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
    let attributeName = new AmazonCognitoIdentity.CognitoUserAttribute(dataName);

    attributeList.push(attributeEmail);
    attributeList.push(attributeName);

    return new Promise((resolve, reject) =>
        userPool.signUp(eventBody.email, eventBody.password, attributeList, null, function (err: string, result: ResultSignUp) {
            if (err) {
                console.error("err", err);
                reject({ message: "Something went wrong", error: err });
                return;
            }
            console.log(result);
            let cognitoUser = result.user;
            console.log('Username is ' + cognitoUser.username);
            resolve({ message: "User created", username: cognitoUser.username });
        }));
};
