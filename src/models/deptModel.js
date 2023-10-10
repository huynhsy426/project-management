const mySQLConnection = require('./connection')
const mysql = require('mysql2/promise');

class DeptModel {

    constructor(DeptModel) {
        this.deptId = DeptModel.deptId;
        this.deptName = DeptModel.deptName;
        this.authorId = DeptModel.authorId;
    }


    // Create Dept
    static async createDept(dept) {
        const connect = await mysql.createConnection(mySQLConnection);
        const sql = 'INSERT INTO dept VALUES (?, ?, ?)';
        try {
            const [result] = await connect.execute(
                sql,
                [dept.deptId, dept.deptName, dept.authorId]
            );
            if (result.affectedRows !== 1) {
                throw (new Error('CREAT_DEPT_FAILED'));
            }
            return;
        } catch (error) {
            throw error;
        } finally {
            connect.end();
        }
    }


    // List of Depts
    static async listDeptsByRoles(userId, roles) {
        const connect = await mysql.createConnection(mySQLConnection);
        try {
            let sql = "";

            if (roles === "Admin") {
                sql = `SELECT * FROM dept`
            }
            sql = `SELECT memberId, position, dept.deptId, deptName, authorId 
                   FROM members
                   JOIN dept ON members.deptId = dept.deptId
                   WHERE memberId = ?`;
            const [listDeptsByUser] = await connect.execute(
                sql,
                [userId]
            )
            return listDeptsByUser;
        } catch (error) {
            throw error;
        } finally {
            connect.end();
        }
    }


    // List Dept sorts by deptId
    static async createAutoDeptId() {
        const connect = await mysql.createConnection(mySQLConnection);

        try {
            const sql = `SELECT deptId 
            FROM dept
            ORDER BY deptId DESC LIMIT 1`;
            const [result] = await connect.execute(sql);
            if (result.length !== 0) {
                const deptIdSplit = result[0].deptId.split("D");
                const deptIdAutoChange = +deptIdSplit[1] + 1;
                return ("D000" + deptIdAutoChange);
            }
            return ("D0001");
        } catch (error) {
            throw error;
        } finally {
            connect.end();
        }
    }


    // Check dept_Id is exists
    static async isExistDept(deptId, callback) {
        const connect = await mysql.createConnection(mySQLConnection);
        const sql = "SELECT 1 FROM dept WHERE deptId = ? LIMIT 1";

        const result = await connect.execute(
            sql,
            [deptId]
        )
        return isEmpty(result)
            ? callback(null, { isdeptExist: false })
            : callback(null, { isdeptExist: true })
    }

    static async isExistDeptName(deptName) {
        const connect = await mysql.createConnection(mySQLConnection);

        try {
            const sql = "SELECT 1 FROM dept WHERE deptName = ? LIMIT 1";
            const [resultDeptName] = await connect.execute(sql, [deptName]);
            if (!isEmpty(resultDeptName)) {
                throw (new Error("DEPTNAME_UNIQUE"));
            }
            return;
        } catch (error) {
            throw error;
        } finally {
            connect.end();
        }
    }


    // Search dept by deptName
    static async searchDeptByName(inputName) {
        const connect = await mysql.createConnection(mySQLConnection);

        try {
            const sql = "SELECT * FROM dept WHERE deptName LIKE (?) LIMIT 1";
            const [result] = await connect.execute(
                sql,
                ['%' + inputName + '%']
            );
            return result;
        } catch (error) {
            throw error;
        } finally {
            connect.end();
        }
    }


    // Delete dept by Id
    static async deleteById(deptId) {
        const connect = await mysql.createConnection(mySQLConnection);

        try {
            const sql = "DELETE FROM dept WHERE deptId = ?";
            const [result] = await connect.execute(
                sql,
                [deptId]
            );
            if (result.affectedRows === 0) {
                return;
            }
            return (result);
        } catch (error) {
            throw error;
        } finally {
            connect.end();
        }
    }


    // Update dept by Id
    static async updateById({ deptId, deptName }) {
        const connect = await mysql.createConnection(mySQLConnection);

        try {
            const sql = "UPDATE dept SET deptName = ? WHERE deptId = ?";
            const result = await connect.execute(
                sql,
                [deptName, deptId]
            )

            const isUpdate = result.affectedRows !== 0;
            return (isUpdate);
        } catch (error) {
            throw error;
        } finally {
            connect.end();
        }
    }
}


function isEmpty(obj) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}


module.exports = DeptModel