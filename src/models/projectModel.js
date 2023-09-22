const connect = require('./connection')

class ProjectModel {

    constructor(ProjectModel) {
        this.project_id = ProjectModel.project_id;
        this.project_name = ProjectModel.project_name;
        this.dept_id = ProjectModel.dept_id;
        this.difficulty = ProjectModel.difficulty;
        this.ins_tm = ProjectModel.ins_tm;
        this.upd_tm = ProjectModel.upd_tm;
        this.version = ProjectModel.version;
    }


    // List of project
    static listProject(results) {
        const sql = "SELECT * FROM project";
        connect.query(
            sql,
            (err, result) => {
                if (err) {
                    console.log("error: ", err);
                    return results(err, null);
                }
                console.log(typeof result, "type of result : " + result)
                return results(null, result);
            }
        )
    }


    // Create a new project
    static createProject(project, results) {
        const sql = 'INSERT INTO project SET ?'
        connect.query(
            sql,
            project,
            (err) => {
                if (err) {
                    console.log("error: ", err);
                    return results(err, null);
                }

                return results(null, true);
            }
        )
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