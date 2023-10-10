const mySQLConnection = require('./connection')
const mysql = require('mysql2/promise');

class ProjectModel {

    constructor(ProjectModel) {
        this.projectId = ProjectModel.projectId;
        this.projectName = ProjectModel.projectName;
        this.deptId = ProjectModel.deptId;
        this.insTm = ProjectModel.insTm;
        this.updTm = ProjectModel.updTm;
        this.version = ProjectModel.version;
        this.leaderId = ProjectModel.leaderId;
        this.minExp = ProjectModel.minExp;
        this.completedAt = ProjectModel.completedAt;
    }

    // List of project
    static async listProject() {
        const connect = await mysql.createConnection(mySQLConnection);
        try {
            const sql = "SELECT * FROM project";
            const [result] = await connect.execute(sql);
            return result;
        } catch (error) {
            throw error;
        } finally {
            connect.end();
        }

    }


    // Create a new project
    static async createProject(project) {
        const connect = await mysql.createConnection(mySQLConnection);
        try {
            const sql = 'INSERT INTO project SET ?'
            const [result] = await connect.execute(sql, [project]);
            console.log(result);
        } catch (error) {
            throw error;
        } finally {
            connect.end();
        }
    }


    // Check project is existing
    static isExistProject(project_id, results) {
        const sql = "SELECT * FROM project WHERE project_id = ? "
        connect.query(
            sql,
            project_id,
            (err, result) => {
                if (err) {
                    return results(err, false);
                }

                if (isEmpty(result)) {
                    console.log("Project_Id is empty");
                    return results(null, false);
                } else {

                    console.log("Project_Id is exists");
                    return results(null, true, result);
                }
            }
        )
    }


    // Check name is unique
    static isExistNameProject(project_name, results) {
        const sql = "SELECT 1 FROM project WHERE project_name = ? "
        connect.query(
            sql,
            project_name,
            (err, result) => {
                if (err) {
                    return results(err, false);
                }

                if (isEmpty(result)) {
                    console.log("Project_name not exists");
                    return results(null, false);
                } else {
                    console.log("Project_name is exists");
                    return results(null, true);
                }
            }
        )
    }


    // Check dept_Id is exists
    static isExistDept(dept_id, results) {
        const sql = "SELECT 1 FROM dept WHERE dept_id = ? "
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




    // Search project by project_id, project_name, difficulty, dept_id
    static searchProject(inputSearch, results) {
        const sql = "SELECT * FROM project WHERE project_id = ? OR project_name LIKE CONCAT( ? ) OR difficulty LIKE CONCAT( ? ) OR dept_id = ?"

        connect.query(
            sql,
            [inputSearch, '%' + inputSearch + '%', '%' + inputSearch + '%', inputSearch],
            (err, result) => {
                if (err) {
                    console.log("error: ", err);
                    return results(err, null);
                }
                return results(null, result);
            }
        )
    }


    // Delete project by Id
    static deleteById(id, results) {
        const sql = "DELETE FROM project WHERE project_id = ?"
        connect.query(
            sql,
            id,
            (err) => {
                if (err) {
                    console.log("error: ", err);
                    return results(err, null);
                }
                return results(null, true);
            }
        )
    }


    // Update project by Id
    static updateById(project, results) {
        const sql = "UPDATE project SET project_name = ? , difficulty = ?, upd_tm = ?, version = ? WHERE project_id = ?"
        connect.query(
            sql,
            [project.project_name, project.difficulty, project.upd_tm, project.version, project.project_id],
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


module.exports = ProjectModel;