import { BodyOfAuth } from './config';
import { APIGatewayEvent } from 'aws-lambda';
const AWS = require('aws-sdk');
const Boom = require('@hapi/boom');

exports.handler = async (event: APIGatewayEvent) => {
    let eventBody = event.body as unknown as BodyOfAuth;
    let cognito = new AWS.CognitoIdentityServiceProvider();

    const payload = {
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: String(process.env.CLIENT_ID),
        AuthParameters: {
            USERNAME: eventBody.email,
            PASSWORD: eventBody.password,
        }
    }

    let result = await cognito.initiateAuth(payload).promise()
        .catch((err: string) => {
            return Boom.boomify(err, { statusCode: 400 });
        })
    return result;
};
