const jwt = require('jsonwebtoken');

interface dataOfPool {
    UserPoolId: string;
    ClientId: string;
}


export let poolConfig = {
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DB
};
export let poolData: dataOfPool = {
    UserPoolId: String(process.env.USER_POOL_ID), // Your user pool id here
    ClientId: String(process.env.CLIENT_ID), // Your client id here
}


export let getUsername = (id_token: string) => {
    try {
        return jwt.decode(id_token, { complete: true }).payload.name;
    } catch{
        return null;
    }

}

