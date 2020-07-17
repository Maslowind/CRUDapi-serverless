import { BodyOfAuth, ErrorInterface } from '../config';
import { APIGatewayEvent } from 'aws-lambda';
import AWS from 'aws-sdk';
import Boom from '@hapi/boom';

exports.handler = async (event: APIGatewayEvent) => {
    let eventBody = event.body as unknown as BodyOfAuth;
    let cognito = new AWS.CognitoIdentityServiceProvider();

    const payload = {
        AuthFlow: "USER_PASSWORD_AUTH",
        ClientId: process.env.CLIENT_ID!,
        AuthParameters: {
            USERNAME: eventBody.email,
            PASSWORD: eventBody.password,
        }
    }
    return await cognito.initiateAuth(payload).promise()
        .catch((err: ErrorInterface) => {
            throw Boom.badRequest(err.message);
        })

};
