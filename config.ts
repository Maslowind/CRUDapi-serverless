import jwt from 'jsonwebtoken';

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



export let getUsername = (id_token: string) => {
    try {
        let jwtDecode: (string | { [key: string]: any; } | null) | { payload: { email: string } } = jwt.decode(id_token, { complete: true });
        console.log(jwtDecode)
        if (jwtDecode === null) return null;
        else return (jwtDecode as any).payload.email;
    } catch{
        return null;
    }

}

