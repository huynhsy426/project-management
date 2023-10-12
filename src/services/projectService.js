const ProjectModel = require("../models/projectModel");
const DeptModel = require("../models/deptModel");

class ProjectService {

   constructor() { }

   // List all projects
   listProjectByRoles = (roles, userId) => {
      return ProjectModel.listProjectByRoles(roles, userId);
   }


   // Create a new project
   create = async (project) => {
      console.log({ project })
      try {
         await ProjectModel.isExistName(project.projectName);
         await DeptModel.checkMinExpForProject(project.minExp, project.deptId);
         await DeptModel.checkMemberIndept(project.leaderId, project.deptId);
         const newProjectId = await ProjectModel.createAutoProjectId();
         project.projectId = newProjectId;
         await ProjectModel.create(project);
      } catch (err) {
         throw err;
      }
   };


   // Search project by project_id, project_name, difficulty, dept_id
   searchProjectService = (inputSearch, results) => {
      ProjectModel.searchProject(
         inputSearch,
         function (err, result) {
            if (err) {
               return results(err, null)
            }
            return results(null, result)
         }
      )
   };


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
                     return results(null, deleteResult)
                  }
               )
            } else {
               return results(null, result)
            }
         }
      )

   };


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

               ProjectModel.updateByID(
                  projectDB,
                  function (err, updateResult) {
                     if (err) {
                        return results(err, null)
                     }
                     return results(null, updateResult)
                  }
               )
            } else {
               return results(null, result)
            }
         }
      )
   };


}

module.exports = new ProjectService()