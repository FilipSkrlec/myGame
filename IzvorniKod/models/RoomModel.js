const db = require('../db');
const { use } = require('../routes/home.routes');

module.exports = class Room {
    
    constructor(id, size) {
        this.id = id;
        this.size = size;
        this.exists = undefined;
    }

    static async fetchById(id) {
        let results = await dbGetRoomById(id)
        let newRoom = new Room()

        if( results.length > 0 ) {
            newRoom = new Room(results[0].id, results[0].size)
            newRoom.exists = true;
            return newRoom
        }

    }

    static async enterNewRoom(room) {
        let result = await dbNewRoom(room)
        if(result !== undefined) {
            return true;
        }
    }


    static async deleteRoom(id) {
        let result = await dbDeleteRoom(room)
        if(result === true) {
            return true;
        }
    }

    static async joinRoom(id, username) {
        let result = await dbJoinRoom(id, username)
        if(result === true) {
            return true;
        }
    }

    static async joinRoomLeaderboard(id, username) {
        let result = await dbJoinRoomLeaderboard(id, username)
        if(result === true) {
            return true;
        }
    }

    static async getRoomPopulation(id) {
        let results = await dbGetRoomPopulation(id)
        if (results.length > 0) {
            return results;
        }
    }

    static async getRoomPopulationUsernames(id) {
        let results = await dbGetAllUsernames(id)
        if (results.length > 0) {
            return results;
        }
    }

    static async getRoomByUser(username) {
        let results = await dbGetRoomByUser(username)
        if (results.length > 0) {
            return results[0].roomid;
        }
    }

    static async getAllQuestions() {
        let results = await dbGetAllQuestions()
        if (results.length > 0) {
            return results;
        }
    }
    
    static async getAllUnansweredQuestions(roomId) {
        let results = await dbGetAllUnansweredQuestions(roomId)
        if (results.length > 0) {
            return results;
        }
    }
    
    static async saveAnswer(roomId, questionId, username, answerUsername) {
        let result = await dbSaveAnswer(roomId, questionId, username, answerUsername)
        if(result !== undefined) {
            return true;
        }
    }

    static async getNumberOfAnswers(roomId, questionId) {
        let results = await dbNumberOfAnswers(roomId, questionId)
        if (results.length > 0) {
            return results[0].count;
        }
    }

    static async markQuestionAsAnswered(roomid, questionid) {
        let result = await dbMarkQuestionAsAnswered(roomid, questionid)
        if(result === true) {
            return true;
        }
    }

    static async getAllAnswers(roomid, questionid) {
        let results = await dbGetAllAnswers(roomid, questionid)
        if (results.length > 0) {
            return results;
        }
    }

    static async getCurrentQuestion(roomid) {
        let results = await dbCurrentQuestion(roomid)
        if (results.length > 0) {
            return results;
        }
    }

    static async addPoints(roomid, username, points) {
        let results = await dbAddPoints(roomid, username, points)
        if(results === true) {
            return true;
        }
    }

    static async getScore(roomid, username) {
        let results = await dbGetScore(roomid, username)
        if (results.length > 0) {
            return results;
        }
    }

    isPersisted() {
        return this.exists !== undefined
    }

    static async generateId() {
        var id = Math.random().toString(36).slice(2);
        return id.substr(0, 10)
    }

}

dbGetRoomById = async (id) => {
    const sql = `SELECT id, size
    FROM room WHERE id = '` + id + `'`;
    try {
        const result = await db.query(sql, []);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
};

dbNewRoom = async (room) => {
    const sql = "INSERT INTO room (id, size) VALUES ('" + room.id + "', '" + room.size + "') RETURNING id";
    try {
        const result = await db.query(sql, []);
        return result.rows[0].id;
    } catch (err) {
        console.log(err);
        throw err
    }
}

dbDeleteRoom = async (id) => {
    const sql = "DELETE FROM room WHERE id = '" + id + "'";
    try {
        const result = await db.query(sql, []);
        return true;
    } catch (err) {
        console.log(err);
        throw err
    }
}

dbJoinRoom = async (id, username) => {
    const sql = "INSERT INTO roomusers (roomid, username) VALUES ('" + id + "', '" + username + "') RETURNING roomid";
    try {
        const result = await db.query(sql, []);
        return true;
    } catch (err) {
        console.log(err);
        throw err
    }
}

dbJoinRoomLeaderboard = async (id, username) => {
    const sql = "INSERT INTO roomleaderboard (roomid, username, score) VALUES ('" + id + "', '" + username + "', 0) RETURNING roomid";
    try {
        const result = await db.query(sql, []);
        return true;
    } catch (err) {
        console.log(err);
        throw err
    }
}

dbGetRoomPopulation = async (id) => {
    const sql = "SELECT firstname FROM users INNER JOIN roomusers ON users.username = roomusers.username WHERE roomusers.roomid = '" + id + "'";
    try {
        const result = await db.query(sql, []);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
}

dbGetAllUsernames = async (id) => {
    const sql = "SELECT users.username FROM users INNER JOIN roomusers ON users.username = roomusers.username WHERE roomusers.roomid = '" + id + "'";
    try {
        const result = await db.query(sql, []);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
}

dbGetRoomByUser = async (username) => {
    const sql = "SELECT roomid FROM roomusers WHERE username = '" + username + "'";
    try {
        const result = await db.query(sql, []);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
}

dbGetAllQuestions = async () => {
    const sql = "SELECT id, text FROM question";
    try {
        const result = await db.query(sql, []);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
}

dbGetAllUnansweredQuestions = async (roomId) => {
    const sql = `SELECT question.id, question.text FROM question 
    WHERE question.id NOT IN (SELECT DISTINCT questionid FROM roomquestions WHERE roomid = '` + roomId + `')`;
    try {
        const result = await db.query(sql, []);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
}

dbSaveAnswer = async (roomId, questionId, username, answerUsername) => {
    const sql = `INSERT INTO roomquestions(roomid, questionid, username, answerusername)
    VALUES('` + roomId + `',` + questionId + `,'` + username + `','`+ answerUsername + `') RETURNING roomid`;
    try {
        const result = await db.query(sql, []);
        return result.rows[0];
    } catch (err) {
        console.log(err);
        throw err
    }
}

dbNumberOfAnswers = async (roomId, questionId) => {
    const sql = `SELECT COUNT(username) FROM roomquestions
    WHERE roomid = '` + roomId + `' AND questionid = ` + questionId;
    try {
        const result = await db.query(sql, []);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
}

dbMarkQuestionAsAnswered = async (roomid, questionid) => {
    const sql = "INSERT INTO previousquestions (roomid, questionid) VALUES ('" + roomid + "', " + questionid + ") RETURNING roomid";
    try {
        const result = await db.query(sql, []);
        return true;
    } catch (err) {
        console.log(err);
        throw err
    }
}

dbGetAllAnswers = async (roomid, questionid) => {
    const sql = `SELECT roomquestions.username, users1.firstname , roomquestions.answerusername, users2.firstname AS answerfirstname
    FROM roomquestions INNER JOIN users users1 ON roomquestions.username = users1.username 
    INNER JOIN users users2 ON roomquestions.answerusername = users2.username
    WHERE roomid = '` + roomid + `' AND questionid = ` + questionid;
    try {
        const result = await db.query(sql, []);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
}

dbCurrentQuestion = async (roomid) => {
    const sql = `SELECT DISTINCT question.id, question.text 
    FROM roomquestions INNER JOIN question ON roomquestions.questionid = question.id
    WHERE roomid = '` + roomid + `' AND roomquestions.questionid NOT IN 
    (SELECT questionid FROM previousquestions WHERE roomid = '` + roomid + `')`;
    try {
        const result = await db.query(sql, []);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
}

dbAddPoints = async (roomid, username, points) => {
    const sql = "UPDATE roomleaderboard SET score = score + " + points + " WHERE roomid = '" + roomid + "' AND username = '" + username + "' RETURNING roomid";
    try {
        const result = await db.query(sql, []);
        return true;
    } catch (err) {
        console.log(err);
        throw err
    }
}

dbGetScore = async (roomid, username) => {
    const sql = `SELECT score
    FROM roomleaderboard WHERE roomid = '` + roomid + `' AND username = '` + username + `'`;
    try {
        const result = await db.query(sql, []);
        return result.rows;
    } catch (err) {
        console.log(err);
        throw err
    }
}
