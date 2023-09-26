const connect = require('./connection')

class DeptModel {

    constructor(DeptModel) {
        this.dept_id = DeptModel.dept_id;
        this.dept_name = DeptModel.dept_name;
    }


    // List of Depts
    static listDepts(results) {
        const sql = "SELECT * FROM dept"
        connect.query(
            sql,
            function (err, result) {
                if (err) {
                    return results(err, null)
                }
                return results(null, result)
            }
        )
    }


    // Create Dept
    static createDept(dept, results) {
        const sql = 'INSERT INTO dept SET ?'
        connect.query(
            sql,
            dept,
            (err) => {
                if (err) {
                    return results(err, null)
                }

                return results(null, true);
            }
        )
    }


    // Check dept_Id is exists
    static isExistDept(dept_id, results) {
        const sql = "SELECT 1 FROM dept WHERE deptId = ? "
        connect.query(
            sql,
            dept_id,
            (err, result) => {
                if (err) {
                    return results(err, false);
                }

                if (isEmpty(result)) {
                    console.log("dept_id not exists");
                    return results(null, false);
                } else {
                    console.log("dept_id is exists");
                    return results(null, true);
                }
            }
        )
    }


    // Check DeptName is existing 
    static isExistDeptName(dept_name, results) {
        const sql = "SELECT 1 FROM dept WHERE deptName = ? "
        connect.query(
            sql,
            dept_name,
            (err, result) => {
                if (err) {
                    return results(err, false);
                }

                if (isEmpty(result)) {
                    console.log("dept_name not exists");
                    return results(null, false);
                } else {
                    console.log("dept_name is exists");
                    return results(null, true);
                }
            }
        )
    }

    // Search dept by dept_name
    static searchDeptByName(inputName, results) {
        sql = "SELECT * FROM dept WHERE deptName = ?"
        connect.query(
            sql,
            '%' + inputName + '%',
            (err, result) => {
                if (err) {
                    return results(err, null);
                }
                return results(null, result);
            }
        )
    }


    // Delete dept by Id
    static deleteById(dept_id, results) {
        const sql = "DELETE FROM dept WHERE deptId = ?"
        connect.query(
            sql,
            dept_id,
            (err) => {
                if (err) {
                    console.log("error: ", err);
                    return results(err, null);
                }
                return results(null, true);
            }
        )
    }


    // Update dept by Id
    static updateById(project, results) {
        const sql = "UPDATE dept SET deptName = ? WHERE deptId = ?"
        connect.query(
            sql,
            [dept.dept_name, dept.dept_id],
            (err) => {
                if (err) {
                    console.log("error: ", err);
                    return results(err, null);
                }
                return results(null, true);
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