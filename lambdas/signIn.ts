import * as funcs from '../config';
import { BodyOfAuth, ErrorInterface } from '../config';
import { APIGatewayEvent } from 'aws-lambda';
import Boom from '@hapi/boom';

exports.handler = async (event: APIGatewayEvent) => {
    let eventBody = event.body as unknown as BodyOfAuth;
    let cognito = funcs.cognito;

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
