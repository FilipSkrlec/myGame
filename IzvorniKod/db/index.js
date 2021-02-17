const {Pool} = require('pg');

const pool = new Pool({
	//database connection data is not displayed in public source code
    host: "",
    user: "",
    database: "",
    port: "5432",
    password: "",
    ssl: {
        rejectUnauthorized:false
    }
});

module.exports = {
    query: (text, params) => {
        const start = Date.now();
        return pool.query(text, params)
            .then(res => {
                const duration = Date.now() - start;
                return res;
            });
    },
    pool: pool
}

