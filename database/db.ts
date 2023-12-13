//const { host } = require('pg/lib/defaults');

const Pool = require('pg').Pool;
const Client = require('pg')


export const pool: typeof Client = new Pool({
    user: 'postgres',
    password: 'Shiva@123',
    database: 'Library_Management_System',
    host: 'localhost',
    port: 5432
});
