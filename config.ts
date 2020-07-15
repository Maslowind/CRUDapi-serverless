import jwt from 'jsonwebtoken';

interface dataOfPool {
    UserPoolId: string;
    ClientId: string;
}
export interface bodyOfAuth {
    email: string;
    password: string;
}
export interface resOfRDS {
    rowCount: Number;
    rows: [dbStructure];
}
export interface dbStructure {
    username?: String;
    filename: string;
    url: string;
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
        let jwtDecode: (string | { [key: string]: any; } | null) | { payload: { name: string } } = jwt.decode(id_token, { complete: true });
        if (jwtDecode === null) return null;
        else return (jwtDecode as any).payload.name;
    } catch{
        return null;
    }

}

