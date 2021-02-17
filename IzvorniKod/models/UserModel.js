const db = require('../db')

module.exports = class User {
    
    constructor(username, firstname) {
        this.username = username;
        this.firstname = firstname;
        this.exists = undefined;
    }

    //dohvat korisnika na osnovu korisničkog imena 
    static async fetchByUsername(username) {
        let results = await dbGetUserByName(username)
        let newUser = new User()

        if( results.length > 0 ) {
            newUser = new User(results[0].username, results[0].firstname)
            newUser.exists = true;
        }
        return newUser
    }

    static async enterNewUser(user) {
        let result = await dbNewUser(user)
        if(result !== undefined) {
            return true;
        }
    }


    static async deleteUser(username) {
        let result = await dbDeleteUser(username)
        if(result === true) {
            return true;
        }
    }

    isPersisted() {
        return this.exists !== undefined
    }

}

dbGetUserByName = async (username) => {
    const sql = `SELECT username, firstname
    FROM users WHERE username = '` + username + `'`;
    try {
        const result = await db.query(sql, []);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
};

dbNewUser = async (user) => {
    const sql = "INSERT INTO users (username, firstname) VALUES ('" + user.username + "', '" + user.firstname + "') RETURNING username";
    try {
        const result = await db.query(sql, []);
        return result.rows[0].username;
    } catch (err) {
        console.log(err);
        throw err
    }
}

dbDeleteUser = async (username) => {
    const sql = "DELETE FROM users WHERE username = '" + username + "'";
    try {
        const result = await db.query(sql, []);
        return true;
    } catch (err) {
        console.log(err);
        throw err
    }
}