const connect = require('./connection')

class DeptModel {

    constructor(DeptModel) {
        this.deptId = DeptModel.deptId;
        this.deptName = DeptModel.deptName;
        this.authorId = DeptModel.authorId;
    }


    // Create Dept
    static createDept(dept) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO dept SET ?';

            connect.query(
                sql,
                dept,
                (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    if (result.affectedRows !== 1) {
                        return reject(new Error('CREAT_DEPT_FAILED'));
                    }

                    return resolve();
                }
            )
        })
    }


    // List of Depts
    static listDeptsByRoles(userId, roles) {
        return new Promise((resolve, reject) => {
            let sql = "";

            if (roles === "Admin") {
                sql = `SELECT * FROM dept`
            }
            sql = `SELECT memberId, position, dept.deptId, deptName, authorId 
                   FROM members
                   JOIN dept ON members.deptId = dept.deptId
                   WHERE memberId = ?`;


            connect.query(
                sql,
                userId,
                function (err, listDeptByUser) {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(listDeptByUser);
                }
            )
        })
    }


    // List Dept sorts by deptId
    static createAutoDeptId() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT deptId 
            FROM dept
            ORDER BY deptId DESC LIMIT 1`;
            connect.query(
                sql,
                function (err, result) {
                    if (err) {
                        return reject(err);
                    }
                    if (result.length !== 0) {
                        const deptIdSplit = result[0].deptId.split("D");
                        const deptIdAutoChange = +deptIdSplit[1] + 1;
                        return resolve("D000" + deptIdAutoChange);
                    }
                    return resolve("D0001");
                }
            )
        })

    }


    // Check dept_Id is exists
    static isExistDept(deptId, callback) {
        const sql = "SELECT 1 FROM dept WHERE deptId = ? LIMIT 1";
        connect.query(
            sql,
            deptId,
            (err, result) => {
                if (err) {
                    return callback(err);
                }

                return isEmpty(result) ?
                    callback(null, { isdeptExist: false }) :
                    callback(null, { isdeptExist: true })
            }
        )
    }

    static isExistDeptName(deptName) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT 1 FROM dept WHERE deptName = ? LIMIT 1";
            connect.query(
                sql,
                deptName,
                (err, resultDeptName) => {
                    if (err) {
                        return reject(err);
                    }

                    if (!isEmpty(resultDeptName)) {
                        return reject(new Error("DEPTNAME_UNIQUE"));
                    }
                    return resolve();
                }
            )
        })
    }


    // Search dept by deptName
    static searchDeptByName(inputName) {
        console.log("Input name: " + inputName)
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM dept WHERE deptName LIKE (?) LIMIT 1"
            connect.query(
                sql,
                ['%' + inputName + '%'],
                (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(result);
                }
            )
        })
    }


    // Delete dept by Id
    static deleteById(deptId) {
        return new Promise((resolve, reject) => {
            const sql = "DELETE FROM dept WHERE deptId = ?"
            connect.query(
                sql,
                deptId,
                (err, result) => {
                    if (err) {
                        console.log("error: ", err);
                        return reject(err);
                    }
                    if (result.affectedRows === 0) {
                        return resolve();
                    }
                    return resolve(result);
                }
            )
        })
    }


    // Update dept by Id
    static updateById({ deptId, deptName }) {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE dept SET deptName = ? WHERE deptId = ?"
            connect.query(
                sql,
                [deptName, deptId],
                (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    const isUpdate = result.affectedRows !== 0;
                    return resolve(isUpdate);
                }
            )
        })
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