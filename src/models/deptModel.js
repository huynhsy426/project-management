const connect = require('./connection')

class DeptModel {

    constructor(DeptModel) {
        this.deptId = DeptModel.deptId;
        this.deptName = DeptModel.deptName;
        this.authorId = DeptModel.authorId;
    }


    // Create Dept
    static createDept(dept, callback) {
        console.log(dept);
        const sql = 'INSERT INTO dept SET ?'
        connect.query(
            sql,
            dept,
            (err) => {
                if (err) {
                    return callback(err);
                }
                return callback(null, { hasCreateDept: true });
            }
        )
    }


    // List of Depts
    static listDeptsByRole(callback) {
        const sql = "SELECT * FROM dept"
        connect.query(
            sql,
            function (err, result) {
                if (err) {
                    return callback(err, null)
                }
                return callback(null, result)
            }
        )
    }


    // List Dept sorts by deptId
    static listDeptsSortId(callback) {
        const sql = "SELECT deptId FROM dept ORDER BY deptId";
        connect.query(
            sql,
            function (err, result) {
                if (err) {
                    return callback(new Error(err.message));
                }
                return callback(null, result);
            }
        )
    }


    // Check dept_Id is exists
    static isExistDept(dept_id, callback) {
        const sql = "SELECT 1 FROM dept WHERE deptId = ? "
        connect.query(
            sql,
            dept_id,
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
    static isExistDeptName(deptName, callback) {
        const sql = "SELECT 1 FROM dept WHERE deptName = ? "
        connect.query(
            sql,
            deptName,
            (err, result) => {
                if (err) {
                    return callback(err);
                }

                return isEmpty(result) ?
                    callback(null, { isDeptNameExist: false }) :
                    callback(new Error("DEPTNAME_UNIQUE"))
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
    static deleteById(dept_id, callback) {
        const sql = "DELETE FROM dept WHERE deptId = ?"
        connect.query(
            sql,
            dept_id,
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
    static updateById(project, callback) {
        const sql = "UPDATE dept SET deptName = ? WHERE deptId = ?"
        connect.query(
            sql,
            [dept.deptName, dept.dept_id],
            (err) => {
                if (err) {
                    console.log("error: ", err);
                    return callback(err, null);
                }
                return callback(null, true);
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