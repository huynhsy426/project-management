const connect = require('./connection')

class DeptModel {

    constructor(DeptModel) {
        this.deptId = DeptModel.deptId;
        this.deptName = DeptModel.deptName;
        this.authorId = DeptModel.authorId;
    }


    // Create Dept
    static createDept(dept, callback) {
        console.log("createDept")
        const deptEntity = {
            deptId: dept.deptId,
            deptName: dept.deptName,
            authorId: dept.authorId
        }

        const sql = 'INSERT INTO dept SET ?'
        connect.query(
            sql,
            deptEntity,
            (err, result) => {
                if (err) {
                    return callback(err);
                }

                return callback(null, result);
            }
        )
    }


    // List of Depts
    static listDeptsByRole({ memberId, roles }, callback) {
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
            memberId,
            function (err, listDeptByUser) {
                if (err) {
                    return callback(err);
                }
                return callback(null, listDeptByUser);
            }
        )
    }


    // List Dept sorts by deptId
    static createAutoDeptId(callback) {
        const sql = `SELECT deptId 
                     FROM dept
                     ORDER BY deptId DESC LIMIT 1`;
        connect.query(
            sql,
            function (err, result) {
                if (err) {
                    return callback(err);
                }
                if (result.length !== 0) {
                    const deptIdSplit = result[0].deptId.split("D");
                    const deptIdAutoChange = +deptIdSplit[1] + 1;
                    return callback(null, "D000" + deptIdAutoChange);
                }
                return callback(null, "D0001");

            }
        )
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

    static isExistDeptName(deptName, callback) {
        const sql = "SELECT 1 FROM dept WHERE deptName = ? LIMIT 1";
        connect.query(
            sql,
            deptName,
            (err, resultDeptName) => {
                if (err) {
                    return callback(err);
                }

                if (!isEmpty(resultDeptName)) {
                    return callback(new Error("DEPTNAME_UNIQUE"));
                }
                return callback();
            }
        )
    }


    // Search dept by deptName
    static searchDeptByName(inputName, callback) {
        sql = "SELECT * FROM dept WHERE deptName = ? LIMIT 1"
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
                const isUpdate = result.affectedRows !== 0;
                return callback(null, isUpdate);
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