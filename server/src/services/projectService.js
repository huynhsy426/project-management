const projectModel = require("../models/projectModel");
const deptModel = require("../models/deptModel");

const { ErrorCodes } = require("../constants/errorConstant");
const taskModel = require("../models/taskModel");


const listProjectByRoles = async (user, page) => {
   let result = null;
   let count = 0;
   const skip = (page.page - 1) * page.ITEMS_PER_PAGE;
   if (user.roles === "Admin") {
      count = await projectModel.estimatedDocumentCount({});
      result = await projectModel.find(
         {},
         { projectName: 1, deptId: 1, insTm: 1, updTm: 1, version: 1, LeaderId: 1, minExp: 1, completedAt: 1 }
      ).limit(page.ITEMS_PER_PAGE).skip(skip);
   } else {
      const listDept = await deptModel.find(
         { "members.memberId": user.userId },
         { _id: 1 }
      );


      const listDeptId = listDept.map((dept) => {
         return dept._id;
      })

      const query = { deptId: { $in: listDeptId } }
      count = await projectModel.estimatedDocumentCount(query);
      result = await projectModel.find(
         query,
         { _id: 0 }
      ).limit(page.ITEMS_PER_PAGE).skip(skip)

   }
   const pageCount = count / page.ITEMS_PER_PAGE;
   return {
      pagination: {
         count,
         pageCount: Math.ceil(pageCount)
      },
      projects: result
   };
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

   const result = await projectModel.insertMany(arrProject);
   project.projectId = result._id;
   return;

};


const isExistName = async (projectName) => {
   const result = await projectModel.findOne(
      { projectName: projectName },
      { _id: 1 }
   ).lean();

   if (result) {
      throw (new Error(ErrorCodes.PROJECT_NAME_EXIST))
   }
   return;
};


const checkMinExpForProject = async (minExp, deptId) => {
   const result = await deptModel.findOne(
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
      throw new Error(ErrorCodes.INVALID_SELECT_DEPT_BY_MIN_EXP);
   }
   return;
};


const checkMemberIndept = async (authorId, deptId) => {
   const result = await deptModel.findOne(
      { _id: deptId, "members.memberId": authorId },
      { _id: 1 }
   ).lean();

   if (!result) {
      throw new Error(ErrorCodes.MEMBER_NOT_IN_DEPT_FOR_PROJECT);
   }
   return;
};


const checkDeptExist = async (deptId) => {
   const result = await deptModel.findOne(
      { _id: deptId },
      { _id: 1 }
   ).lean();

   if (!result) {
      throw new Error(ErrorCodes.DEPT_NOT_EXIST);
   }
   return;
}

const getProjectById = async (projectId) => {
   const query = {
      _id: projectId
   }
   const project = await projectModel.findOne(query).populate(
      {
         path: 'leaderId',
         select: { "_id": 1, username: 1 }
      }
   ).populate(
      {
         path: 'deptId',
         select: { "_id": 1, deptName: 1 }
      }
   ).lean();

   if (!project) {
      throw new Error("PROJECT_NOT_FOUND");
   }
   return project;
}


const getTasksByProjectId = async (projectId, page) => {
   console.log({ projectId, page })
   let count = 0;
   const skip = (page.page - 1) * page.ITEMS_PER_PAGE;
   let query = null;

   if (page.taskType === "a") {
      query = {
         projectId: projectId,
         assignee: { $exists: true }
      }
   } else if (page.taskType === "na") {
      query = {
         projectId: projectId,
         assignee: { $exists: false }
      }
   } else {
      query = {
         1: 1
      }
   }

   count = await taskModel.countDocuments(query);
   const tasks = await taskModel.find(
      query,
      { taskName: 1, assignee: 1, content: 1, attachments: 1, status: 1, point: 1, create: 1, _id: 1, projectId: 1 }
   ).populate(
      {
         path: 'assignee',
         select: { "_id": 1, username: 1 }
      }
   )
      .limit(page.ITEMS_PER_PAGE).skip(skip);

   const pageCount = count / page.ITEMS_PER_PAGE;

   return {
      pagination: {
         count,
         pageCount: Math.ceil(pageCount)
      },
      tasks: tasks
   };
}

module.exports = {
   // List all projects
   listProjectByRoles: (user, page) => {
      return listProjectByRoles(user, page);
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
   getProjectById: (projectId) => {
      return getProjectById(projectId);
   },

   getTasksByProjectId: (projectId, page) => {
      return getTasksByProjectId(projectId, page);
   }


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