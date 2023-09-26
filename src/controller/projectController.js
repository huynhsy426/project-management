const {
    listProjectService,
    createProjectService,
    searchProjectService,
    deleteByIdService,
    updateProjectByIdService
} = require("../services/projectService")


// list Project
const listProject = (req, res) => {
    listProjectService(
        function (err, result) {
            console.log(result)
            if (err) {
                return res.status(400).json({
                    errorMessage: err
                })
            }
            console.log(typeof result, "asdasdkjh")
            return res.status(200).json({
                projectList: result
            })
        }
    )
}


// create Project
const createProject = (req, res) => {
    const today = new Date();
    const getToDay = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
    const projectModel = {
        project_id: req.body.project_id,
        project_name: req.body.project_name,
        dept_id: req.body.dept_id,
        difficulty: req.body.difficulty,
        ins_tm: getToDay,
        upd_tm: null,
        version: 1
    }

    createProjectService(
        projectModel,
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    errorMessage: err
                })
            }
            if (result === "isExistName") {
                return res.status(400).json({
                    CreateMessage: "Project Name is exist"
                })
            }

            if (result === "isDeptExist") {
                return res.status(400).json({
                    CreateMessage: "Dept_id is not exist"
                })
            }

            if (result) {
                return res.status(400).json({
                    CreateMessage: "Duplicate Project"
                })
            } else {
                return res.status(200).json({
                    CreateMessage: "Project is created successfully"
                })
            }
        }
    )
}


// Search Project
const searchProjects = (req, res) => {
    searchProjectService(
        req.query.inputSearch,
        function (err, searchResult) {
            if (err) {
                return res.status(400).json({
                    errorMessage: err
                })
            }
            return res.status(200).json({
                projectList: searchResult
            })
        }
    )
}


// delete project
const deleteById = (req, res) => {
    console.log('deleteById')
    console.log(req.params.project_id, "param")


    deleteByIdService(
        req.params.project_id,
        function (err, result) {
            if (err) {
                return res.status(400).json({
                    errorMessage: err
                })
            }
            if (!result) {
                return res.status(200).json({
                    errorMessage: "project not found"
                })
            }
            return res.status(200).json({
                projectList: result,
                successMessage: "Delete project successfully"
            })
        }
    )
}


// Update project
const updateById = (req, res) => {
    console.log(req.body.project, "body")

    const today = new Date();
    const getToDay = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`

    const projectModel = {
        project_id: req.body.project_id,
        project_name: req.body.project_name,
        dept_id: req.body.dept_id,
        difficulty: req.body.difficulty,
        ins_tm: req.body.ins_tm,
        upd_tm: getToDay,
        version: req.body.version
    }

    console.log(projectModel, "projectModel")

    updateProjectByIdService(
        projectModel,
        function (err, result) {
            if (err) {
                return res.status(400).json({
                    errorMessage: err
                })
            }

            if (result) {
                return res.status(200).json({
                    successMessage: "Update project successfully"
                })
            } else {
                return res.status(400).json({
                    errorMessage: "Project not found"
                })
            }
        }
    )

}


module.exports = {
    listProject,
    createProject,
    searchProjects,
    deleteById,
    updateById
}