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
    static async listProjectByRoles(roles, userId) {
        const connect = await mysql.createConnection(mySQLConnection);
        try {
            let sql = "";

            if (roles === "Admin") {
                sql = "SELECT * FROM project";
            }

            sql = `SELECT *
                   FROM project
                   WHERE deptId IN (SELECT deptId FROM members 
                                    WHERE memberId = ?)`;
            const [result] = await connect.execute(sql, [userId]);
            return result;
        } catch (error) {
            throw error;
        } finally {
            connect.end();
        }

    }


    // Create a new project
    static async create(project) {
        const connect = await mysql.createConnection(mySQLConnection);
        const arrProject = [
            project.projectId,
            project.projectName,
            project.deptId,
            project.insTm,
            project.updTm,
            project.version,
            project.leaderId,
            project.minExp,
            project.completedAt
        ];


        try {
            const sql = 'INSERT INTO project VALUES (?,?,?,?,?,?,?,?,?)'
            const [result] = await connect.execute(sql, arrProject);

            console.log({ result });
            if (result.affectedRows !== 1) {
                throw (new Error('CREAT_PROJECT_FAILED'));
            }
            return;
        } catch (error) {
            throw error;
        } finally {
            connect.end();
        }
    }


    // Create auto projectId
    static async createAutoProjectId() {
        const connect = await mysql.createConnection(mySQLConnection);
        try {
            const sql = `SELECT projectId
                         FROM project
                         ORDER BY projectId DESC LIMIT 1`;
            const [result] = await connect.execute(sql);
            if (result.length !== 0) {
                const projectIdSplit = result[0].projectId.split("PR");
                const projectIdAutoChange = +projectIdSplit[1] + 1;
                return ("PR00" + projectIdAutoChange);
            }
            return ("PR001");
        } catch (error) {
            throw error;
        } finally {
            connect.end();
        }
    }


    // Check project is existing
    // static isExistProject(project_id, results) {
    //     const sql = "SELECT * FROM project WHERE project_id = ? "
    //     connect.query(
    //         sql,
    //         project_id,
    //         (err, result) => {
    //             if (err) {
    //                 return results(err, false);
    //             }

    //             if (isEmpty(result)) {
    //                 console.log("Project_Id is empty");
    //                 return results(null, false);
    //             } else {

    //                 console.log("Project_Id is exists");
    //                 return results(null, true, result);
    //             }
    //         }
    //     )
    // }


    // Check name is unique
    static async isExistName(projectName) {
        const connect = await mysql.createConnection(mySQLConnection);
        try {
            const sql = "SELECT 1 FROM project WHERE projectName = ? LIMIT 1"

            const [result] = await connect.execute(sql, [projectName]);

            if (result.length > 0) {
                throw (new Error("PROJECT_NAME_EXIST"))
            }
            return;
        } catch (error) {
            throw error;
        } finally {
            connect.end();
        }
    }


    // Search project by project_id, project_name, difficulty, dept_id
    // static searchProject(inputSearch, results) {
    //     const sql = "SELECT * FROM project WHERE project_id = ? OR project_name LIKE CONCAT( ? ) OR difficulty LIKE CONCAT( ? ) OR dept_id = ?"

    //     connect.query(
    //         sql,
    //         [inputSearch, '%' + inputSearch + '%', '%' + inputSearch + '%', inputSearch],
    //         (err, result) => {
    //             if (err) {
    //                 console.log("error: ", err);
    //                 return results(err, null);
    //             }
    //             return results(null, result);
    //         }
    //     )
    // }


    // Delete project by Id
    // static deleteById(id, results) {
    //     const sql = "DELETE FROM project WHERE project_id = ?"
    //     connect.query(
    //         sql,
    //         id,
    //         (err) => {
    //             if (err) {
    //                 console.log("error: ", err);
    //                 return results(err, null);
    //             }
    //             return results(null, true);
    //         }
    //     )
    // }


    // Update project by Id
    // static updateById(project, results) {
    //     const sql = "UPDATE project SET project_name = ? , difficulty = ?, upd_tm = ?, version = ? WHERE project_id = ?"
    //     connect.query(
    //         sql,
    //         [project.project_name, project.difficulty, project.upd_tm, project.version, project.project_id],
    //         (err) => {
    //             if (err) {
    //                 console.log("error: ", err);
    //                 return results(err, null);
    //             }
    //             return results(null, true);
    //         }
    //     )
    // }

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