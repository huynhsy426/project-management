const ProjectModel = require("../models/projectModel")


class ProjectService {

    constructor() { }

    // List all projects
    listProjectService = (results) => {
        ProjectModel.listProject(
            function (err, result) {
                if (err) {
                    return results(err, null)
                }
                console.log(typeof result, "service")
                return results(null, result)
            }
        )
    }


    // Create a new project
    createProjectService = (project, results) => {
        ProjectModel.isExistProject(
            project.project_id,
            function (err, result) {
                console.log(result, 'result')


                if (err) {
                    return results(err, null)
                }

                if (!result) {
                    let countError = 0;
                    ProjectModel.isExistNameProject(
                        project.project_name,
                        function (err, isExistName) {
                            if (err) {
                                return results(err, null)
                            }
                            console.log(isExistName, "isExistNameaaaa")
                            if (isExistName) {
                                countError++;
                                console.log(countError, "name already exists")
                                return results(null, "isExistName")
                            }
                            else {
                                ProjectModel.isExistDept(
                                    project.dept_id,
                                    function (err, isDeptExist) {
                                        if (err) {
                                            return results(err, null)
                                        }

                                        console.log(isDeptExist, "deptasdasd")
                                        if (!isDeptExist) {
                                            countError++;
                                            console.log(countError, "dept not exists")
                                            return results(null, "isDeptExist")
                                        } else {
                                            console.log(countError, "count error: ")
                                            if (countError === 0) {
                                                console.log(countError, "count error in create")
                                                ProjectModel.createProject(
                                                    project,
                                                    function (err, createResult) {
                                                        if (err) {
                                                            return results(err, null);
                                                        }
                                                        return results(null, !createResult)
                                                    }
                                                )
                                            }
                                        }
                                    }
                                )
                            }
                        }
                    )
                } else {
                    return results(null, result)
                }
            }
        )
    }


    // Search project by project_id, project_name, difficulty, dept_id
    searchProjectService = (inputSearch, results) => {
        console.log(typeof inputSearch, "input search")
        ProjectModel.searchProject(
            inputSearch,
            function (err, result) {
                if (err) {
                    return results(err, null)
                }
                console.log(result)
                return results(null, result)
            }
        )
    }


    // Delete project by Id
    deleteByIdService = (project_id, results) => {

        ProjectModel.isExistProject(
            project_id,
            function (err, result) {
                if (err) {
                    return results(err, null)
                }

                if (result) {
                    ProjectModel.deleteById(
                        project_id,
                        function (err, deleteResult) {
                            if (err) {
                                return results(err, null)
                            }
                            console.log(deleteResult)
                            return results(null, deleteResult)
                        }
                    )
                } else {
                    return results(null, result)
                }
            }
        )

    }


    // Update project by Id
    updateProjectByIdService = (project, results) => {
        ProjectModel.isExistProject(
            project.project_id,
            function (err, result, projectEntity) {
                if (err) {
                    return results(err, null)
                }

                if (result) {
                    const projectDB = {
                        project_id: project.project_id,
                        project_name: project.project_name,
                        dept_id: projectEntity['0'].dept_id,
                        difficulty: project.difficulty,
                        ins_tm: projectEntity['0'].ins_tm,
                        upd_tm: project.upd_tm,
                        version: projectEntity['0'].version - 0 + 1
                    }

                    console.log(projectDB)

                    ProjectModel.updateByID(
                        projectDB,
                        function (err, updateResult) {
                            if (err) {
                                return results(err, null)
                            }
                            console.log(updateResult)
                            return results(null, updateResult)
                        }
                    )
                } else {
                    return results(null, result)
                }
            }
        )
    }


}

module.exports = new ProjectService()