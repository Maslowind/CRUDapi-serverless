import * as funcs from './config';
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
require('cross-fetch/polyfill');

exports.handler = async (event: any) => {
    let userPool = new AmazonCognitoIdentity.CognitoUserPool(funcs.poolData);

    let attributeList: any[] = [];

    let dataEmail = {
        Name: 'email',
        Value: event.body.email,
    };

    let dataName = {
        Name: 'name',
        Value: event.body.email,
    };
    let attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);
    let attributeName = new AmazonCognitoIdentity.CognitoUserAttribute(dataName);

    attributeList.push(attributeEmail);
    attributeList.push(attributeName);

    return new Promise((resolve, reject) =>
        userPool.signUp(event.body.email, event.body.password, attributeList, null, function (err: any, result: any) {
            if (err) {
                console.error("err", err);
                reject({ message: "Something went wrong", error: err });
                return;
            }
            let cognitoUser = result.user;
            console.log('Username is ' + cognitoUser.getUsername());
            resolve({ message: "User created", username: cognitoUser.getUsername() });
        }));
};

