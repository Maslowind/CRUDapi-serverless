import jwt from 'jsonwebtoken';

export interface BodyOfAuth {
    email: string;
    password: string;
}
export interface ResOfRDS {
    rowCount: Number;
    rows: [DbStructure];
}
export interface DbStructure {
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

export let getUsername = (id_token: string) => {
    try {
        let jwtDecode = jwt.decode(id_token, { complete: true }) as null | { payload: { email: string } };
        return jwtDecode?.payload.email;
    } catch{
        return null;
    }

}

