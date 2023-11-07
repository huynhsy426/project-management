const ProjectModel = require("../models/projectModel");
const DeptModel = require("../models/deptModel");


const listProjectByRoles = async (roles, userId) => {
   let result = null;
   if (roles === "Admin") {
      result = await ProjectModel.find(
         {},
         { projectName: 1, deptId: 1, insTm: 1, updTm: 1, version: 1, LeaderId: 1, minExp: 1, completedAt: 1 }
      );
   } else {
      const listDept = await DeptModel.find(
         { "members.memberId": userId },
         { _id: 1 }
      );

      const listDeptId = listDept.map((dept) => {
         return dept._id;
      })

      const query = { deptId: { $in: listDeptId } }
      result = await ProjectModel.find(
         query,
         { _id: 0 }
      )

   }
   return result;
};


const create = async (project) => {
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

   const result = await ProjectModel.insertMany(arrProject);
   project.projectId = result._id;
   return;

};


const isExistName = async (projectName) => {
   const result = await ProjectModel.findOne(
      { projectName: projectName },
      { _id: 1 }
   ).lean();

   if (result) {
      throw (new Error("PROJECT_NAME_EXIST"))
   }
   return;
};


const checkMinExpForProject = async (minExp, deptId) => {
   const result = await DeptModel.findOne(
      { _id: deptId },
      { members: 1, _id: 0 }
   )
      .populate(
         {
            path: 'members.memberId',
            select: 'exp -_id'
         })

   const arrMembers = result.members;
   const listMinExp = arrMembers.filter(member => {
      const exp = member.memberId.exp;
      return exp < minExp;
   })

   if (listMinExp.length > 0) {
      throw new Error("INVALID_SELECT_DEPT_BY_MIN_EXP");
   }
   return;
};


const checkMemberIndept = async (authorId, deptId) => {
   const result = await DeptModel.findOne(
      { _id: deptId, "members.memberId": authorId },
      { _id: 1 }
   ).lean();

   if (!result) {
      throw new Error("MEMBER_NOT_IN_DEPT_FOR_PROJECT");
   }
   return;
};


const checkDeptExist = async (deptId) => {
   const result = await DeptModel.findOne(
      { _id: deptId },
      { _id: 1 }
   ).lean();

   if (!result) {
      throw new Error("DEPT_NOT_EXIST");
   }
   return;
}

module.exports = {
   // List all projects
   listProjectByRoles: (roles, userId) => {
      return listProjectByRoles(roles, userId);
   },


   // Create a new project
   create: async (project) => {
      await checkDeptExist(project.deptId);
      await isExistName(project.projectName);
      await checkMinExpForProject(project.minExp, project.deptId);
      await checkMemberIndept(project.leaderId, project.deptId);
      await create(project);
      return;
   },


   // Search project by project_id, project_name, difficulty, dept_id
   // searchProject: (inputSearch, results) => {
   //    projectModel.searchProject(
   //       inputSearch,
   //       function (err, result) {
   //          if (err) {
   //             return results(err, null)
   //          }
   //          return results(null, result)
   //       }
   //    )
   // },


   // Delete project by Id
   // deleteById: (project_id, results) => {

   //    projectModel.isExistProject(
   //       project_id,
   //       function (err, result) {
   //          if (err) {
   //             return results(err, null)
   //          }

   //          if (result) {
   //             projectModel.deleteById(
   //                project_id,
   //                function (err, deleteResult) {
   //                   if (err) {
   //                      return results(err, null)
   //                   }
   //                   return results(null, deleteResult)
   //                }
   //             )
   //          } else {
   //             return results(null, result)
   //          }
   //       }
   //    )

   // },


   // // Update project by Id
   // updateProjectById: (project, results) => {
   //    projectModel.isExistProject(
   //       project.project_id,
   //       function (err, result, projectEntity) {
   //          if (err) {
   //             return results(err, null)
   //          }

   //          if (result) {
   //             const projectDB = {
   //                project_id: project.project_id,
   //                project_name: project.project_name,
   //                dept_id: projectEntity['0'].dept_id,
   //                difficulty: project.difficulty,
   //                ins_tm: projectEntity['0'].ins_tm,
   //                upd_tm: project.upd_tm,
   //                version: projectEntity['0'].version - 0 + 1
   //             }

   //             projectModel.updateByID(
   //                projectDB,
   //                function (err, updateResult) {
   //                   if (err) {
   //                      return results(err, null)
   //                   }
   //                   return results(null, updateResult)
   //                }
   //             )
   //          } else {
   //             return results(null, result)
   //          }
   //       }
   //    )
   // }
}