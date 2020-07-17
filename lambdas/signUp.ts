import { BodyOfAuth, ErrorInterface } from '../config';
import { APIGatewayEvent } from 'aws-lambda';
import AWS from 'aws-sdk';
import Boom from '@hapi/boom';
import { SignUpRequest } from 'aws-sdk/clients/cognitoidentityserviceprovider';

exports.handler = async (event: APIGatewayEvent) => {
    let eventBody = event.body as unknown as BodyOfAuth;
    let cognito = new AWS.CognitoIdentityServiceProvider();

    const payload:SignUpRequest = {
        ClientId: process.env.CLIENT_ID!,
        Username: eventBody.email,
        Password: eventBody.password,
    }
    return await cognito.signUp(payload).promise()
        .catch((err: ErrorInterface) => {
            throw Boom.badRequest(err.message);
        })
};
