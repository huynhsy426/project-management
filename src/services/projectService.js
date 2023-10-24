const projectModel = require("../models/projectModel");
const memberModel = require("../models/memberModel");


const listProjectByRoles = async (roles, userId) => {
   try {
      let result = null;
      if (roles === "Admin") {
         result = await this.projects.find(
            {},
            { projectName: 1, deptId: 1, insTm: 1, updTm: 1, version: 1, LeaderId: 1, minExp: 1, completedAt: 1 }
         );
      } else {
         const listMember = await this.members.find({ memberId: userId });
         const listDeptId = listMember.map((member) => {
            return member.deptId;
         })
         console.log({ listDeptId })
         result = await this.projects.find({
            deptId: { $in: listDeptId }
         })

      }
      console.log({ result1111: result })
      return result;
   } catch (error) {
      throw error;
   }
};


const create = async (project) => {
   try {
      const arrProject = [
         {
            projectName: project.projectName,
            deptId: project.deptId,
            insTm: project.insTm,
            updTm: project.updTm,
            version: project.version,
            leaderId: project.leaderId,
            minExp: project.minExp,
            completedAt: project.completedAt
         }
      ];

      const result = await this.projects.insertMany(arrProject);
      project.projectId = result._id;
      return;

   } catch (error) {
      throw error;
   }
};


const isExistName = async (projectName) => {
   try {
      const result = await this.projects.findOne(
         { projectName: projectName },
         { 1: 1 }
      )
      console.log({ result })
      if (result !== null) {
         throw (new Error("PROJECT_NAME_EXIST"))
      }
      return;
   } catch (error) {
      throw error;
   }
};


const checkMinExpForProject = async (minExp, deptId) => {
   try {
      const result = await memberModel.findOne({ deptId: deptId })
         .populate({ path: 'memberId', match: { exp: { $lt: minExp } } })

      console.log({ result })
      if (result.memberId.length > 0) {
         throw new Error("INVALID_SELECT_DEPT_BY_MIN_EXP");
      }
      return;
   } catch (error) {
      throw error;
   }
};


const checkMemberIndept = async (authorId, deptId) => {
   try {
      const result = await memberModel.findOne(
         { memberId: authorId, deptId: deptId },
         { 1: 1 }
      );

      if ([result].length === 0) {
         throw new Error("MEMBER_NOT_IN_DEPT_FOR_PROJECT");
      }
      return;
   } catch (error) {
      throw error;
   }
};

module.exports = {
   // List all projects
   listProjectByRoles: (roles, userId) => {
      return listProjectByRoles(roles, userId);
   },


   // Create a new project
   create: async (project) => {
      console.log({ project })
      try {
         await isExistName(project.projectName);
         await checkMinExpForProject(project.minExp, project.deptId);
         await checkMemberIndept(project.leaderId, project.deptId);
         await create(project);
      } catch (err) {
         throw err;
      }
   },


   // Search project by project_id, project_name, difficulty, dept_id
   searchProjectService: (inputSearch, results) => {
      projectModel.searchProject(
         inputSearch,
         function (err, result) {
            if (err) {
               return results(err, null)
            }
            return results(null, result)
         }
      )
   },


   // Delete project by Id
   deleteByIdService: (project_id, results) => {

      projectModel.isExistProject(
         project_id,
         function (err, result) {
            if (err) {
               return results(err, null)
            }

            if (result) {
               projectModel.deleteById(
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

   },


   // Update project by Id
   updateProjectByIdService: (project, results) => {
      projectModel.isExistProject(
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

               projectModel.updateByID(
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
   }
}