import jwt from 'jsonwebtoken';
import { PoolConfig } from 'pg';
import AWS from 'aws-sdk';

export let cognito = new AWS.CognitoIdentityServiceProvider();

export let s3 = new AWS.S3();
    

export interface BodyOfAuth {
    email: string;
    password: string;
}
export interface DbStructure {
    username?: string;
    filename: string;
    url: string;
}
export interface ErrorInterface {
    message:string
}

export let poolConfig: PoolConfig = {
    host: process.env.RDS_HOSTNAME!,
    user: process.env.RDS_USERNAME!,
    password: process.env.RDS_PASSWORD!,
    port: Number(process.env.RDS_PORT) ,
    database: process.env.RDS_DB!
};

export let getUsername = (id_token: string) => {
    try {
        let jwtDecode = jwt.decode(id_token, { complete: true }) as null | { payload: { email: string } };
        return jwtDecode?.payload.email;
    } catch{
        return null;
    }

}

