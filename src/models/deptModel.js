const connect = require('./connection')

class DeptModel {

    constructor(DeptModel) {
        this.deptId = DeptModel.deptId;
        this.deptName = DeptModel.deptName;
        this.authorId = DeptModel.authorId;
    }


    // Create Dept
    static createDept(dept, callback) {
        const deptEntity = {
            deptId: dept.deptId,
            deptName: dept.deptName,
            authorId: dept.authorId
        }

        const sql = 'INSERT INTO dept SET ?'
        connect.query(
            sql,
            deptEntity,
            (err) => {
                if (err) {
                    return callback(err);
                }
                return callback(null, { hasCreateDept: true });
            }
        )
    }


    // List of Depts
    static getDepts({ userId, roles }, callback) {
        let sql = "";
        if (roles === 'Admin') {
            sql = `SELECT * FROM dept`
        } else {
            sql = `SELECT memberId, position, dept.deptId, deptName, authorId FROM members
                JOIN dept ON members.deptId = dept.deptId
                WHERE memberId = ?`;
        }

        connect.query(
            sql,
            userId,
            function (err, result) {
                if (err) {
                    return callback(err);
                }
                return callback(null, result);
            }
        )
    }


    // List Dept sorts by deptId
    static getNewDeptId(callback) {
        const sql = `SELECT deptId, deptName 
                     FROM dept 
                     ORDER BY deptId LIMIT 1`;
        connect.query(
            sql,
            function (err, result) {
                if (err) {
                    return callback(new Error(err.message));
                }
                let newDeptId;
                if (result.length === 0) {
                    newDeptId = 'D0001';
                } else {
                    newDeptId = +result[result.length - 1].deptId.split("D")[1] + 1
                }
                return callback(null, newDeptId);
            }
        )
    }


    // Check dept_Id is exists
    static isExistDept(deptId, callback) {
        const sql = "SELECT 1 FROM dept WHERE deptId = ?"
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


    // Check DeptName is existing 
    static getDeptByName(deptName, callback) {
        const sql = "SELECT 1 FROM dept WHERE deptName = ?"
        connect.query(
            sql,
            deptName,
            (err, result) => {
                if (err) {
                    return callback(err);
                }

                return callback(null, result);
            }
        )
    }


    // Search dept by deptName
    static searchDeptByName(inputName, callback) {
        sql = "SELECT * FROM dept WHERE deptName = ?"
        connect.query(
            sql,
            ['%' + inputName + '%'],
            (err, result) => {
                if (err) {
                    return callback(err);
                }
                return callback(null, result);
            }
        )
    }


    // Delete dept by Id
    static deleteById(deptId, callback) {
        const sql = "DELETE FROM dept WHERE deptId = ?"
        connect.query(
            sql,
            deptId,
            (err) => {
                if (err) {
                    console.log("error: ", err);
                    return callback(err, null);
                }
                return callback(null, true);
            }
        )
    }


    // Update dept by Id
    static updateById(dept, callback) {
        const sql = "UPDATE dept SET deptName = ? WHERE deptId = ?"
        connect.query(
            sql,
            [dept.deptName, dept.deptId],
            (err, result) => {
                if (err) {
                    console.log("error: ", err);
                    return callback(err);
                }
                return callback(null, result);
            }
        )
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