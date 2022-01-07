const postgres = require('postgres');

const sql = postgres('postgres://farms:farms@localhost:5432/farms');

export default sql;
