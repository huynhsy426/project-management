const mongoose = require('mongoose');

const UserModel = require('../models/userModel');
const ProjectModel = require('../models/projectModel');


class MemberModel {

   constructor(MemberModel) {
      this.memberId = MemberModel.memberId;
      this.deptId = MemberModel.deptId;
      this.position = MemberModel.position;
   };


   static memberSchema = new mongoose.Schema({
      memberId: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
         }
      ]
      ,
      deptId: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'depts',
            required: true
         }
      ],
      position: {
         type: String,
         required: true
      }
   }, {
      _id: false,
      versionKey: false // You should be aware of the outcome after set to false
   });


   static member = mongoose.model('members', this.memberSchema);
   static users = UserModel.users;
   static projects = ProjectModel.projects;

   static async listMembers() {
      try {
         const result = await this.member.find(
            {},
            { memberId: 1, deptId: 1, position: 1, _id: 0 }
         );
         console.log({ result });
         return result;
      } catch (error) {
         throw error;
      }
   };


   // Insert member by select
   static insertMembers = async (deptId, memberList) => {
      const listMembers = memberList.map(member => {
         return member = {
            memberId: member.memberId,
            deptId,
            position: member.position
         }
      });
      try {
         const result = await this.member.insertMany(listMembers);
         return result;
      } catch (error) {
         throw error;
      }
   }


   // Check member in dept or blocked
   static async checkMemberInDeptOrIsBlock(members, deptId) {
      try {
         console.log("herecheck member")
         let listMemberId = "";
         if (members.length !== 0) {
            listMemberId = members.map((value) => { return (value.memberId.trim()) });
         } else {
            listMemberId = 0;
         }
         const result = await this.users.find(
            {
               _id: { $in: listMemberId },
               isBlocked: true
            },
            { username: 1, roles: 1, _id: 0 }
         )

         console.log({ result1111: result })
         if (result.length > 0) {
            throw (new Error("ADD_MEMBER_BLOCK"));
         }

         const resultCheckRoles = await this.users.find(
            {
               _id: { $in: listMemberId },
               roles: "Admin"
            },
            { roles: 1, _id: 0 }
         )

         if (resultCheckRoles.length > 0) {
            throw (new Error('NOT_ALLOW_ROLE'));
         }

         if (!deptId) {
            return;
         }

         const resultIndept = await this.member.find(
            {
               memberId: { $in: listMemberId },
               deptId: deptId
            },
            { 1: 1 }
         )
         console.log({ resultIndept })
         if (resultIndept.length > 0) {
            throw (new Error("MEMBER_ALREADY_IN_DEPT"))
         }
         return;


      } catch (error) {
         throw error;
      }
   }


   // Check member in project
   static async checkMemberInProject(memberId) {

      try {
         const result = await this.member.find(
            { memberId: memberId },
            { deptId: 1, _id: 0 }
         )
         const listDeptId = result.map(item => {
            return item.deptId;
         })

         const isInDept = await this.projects.findOne(
            { deptId: { $in: listDeptId } },
            { 1: 1 }
         )

         if (isInDept !== null) {
            throw new Error("MEMBERS_CANNOT_DELETE");
         }
         return;
      } catch (error) {
         throw error;
      }
   };


   // Delete member out dept
   static async delete(memberId, deptId) {
      try {
         const result = await this.member.deleteMany(
            { memberId: memberId, deptId: deptId }
         )

         if (result.deletedCount === 0) {
            throw new Error("MEMBER_NOT_IN_DEPT_FOR_DEPT");
         }
         return;
      } catch (err) {
         throw err;
      }
   };



}


module.exports = MemberModel;