const mongoose = require('mongoose');

const MemberModel = require("../models/memberModel");
const UserModel = require("../models/userModel");

class DeptModel {

    constructor(DeptModel) {
        this.deptId = DeptModel.deptId;
        this.deptName = DeptModel.deptName;
        this.authorId = DeptModel.authorId;
    }

    static deptSchema = new mongoose.Schema({
        deptName: {
            type: String,
            unique: true,
            required: true
        },
        authorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        }
    }, {
        versionKey: false // You should be aware of the outcome after set to false
    });

    static depts = mongoose.model("depts", this.deptSchema);
    static members = mongoose.model("members", MemberModel.memberSchema);
    static users = mongoose.model("users", UserModel.userSchema);

    // Create Dept
    static async createDept(dept) {
        const deptEntity = {
            deptName: dept.deptName,
            authorId: dept.authorId
        }
        try {
            const [result] = await this.depts.insertMany(deptEntity);
            console.log({ result });
            if (result === null) {
                throw (new Error('CREAT_DEPT_FAILED'));
            }
            dept.deptId = result._id;
            return;
        } catch (error) {
            throw error;
        }
    }


    static async listDeptsByRoles(userId, roles) {
        try {
            let result = null;
            if (roles === "Admin") {
                result = await this.depts.find(
                    {},
                    { deptName: 1, authorId: 1, _id: 0 }
                )
            } else {
                result = await this.members.find(
                    { memberId: userId },
                    { memberId: 1, deptId: 1, position: 1, _id: 0 }
                )
                    .populate({ path: 'deptId' })

            }
            return result;
        } catch (error) {
            throw error;
        }
    };


    static async isExistDeptName(deptName) {
        try {
            const result = await this.depts.findOne(
                { deptName: deptName },
                { 1: 1 }
            );
            if (result !== null) {
                throw (new Error("DEPTNAME_UNIQUE"));
            }
            return;
        } catch (err) {
            throw err;
        }
    };


    // Search dept by deptName
    static async searchDeptByName(inputName) {
        try {
            const result = await this.depts.find(
                { deptName: new RegExp(inputName) }
            )
            console.log({ result })
            return result;
        } catch (error) {
            throw error;
        }
    };


    // Delete dept by Id
    static async deleteById(deptId) {
        try {
            const result = await this.depts.deleteById(deptId);
            if (result.deletedCount === 0) {
                return false;
            }
            return;
        } catch (error) {
            throw error;
        }
    };


    // Update dept by Id
    static async updateById(deptId, deptName) {
        console.log({ deptId, deptName });
        try {
            const result = await this.depts.updateMany(
                { _id: deptId },
                { $set: { deptName: deptName } }
            );
            console.log({ result });
            let isUpdate = true;
            if (result.matchedCount === 0) {
                return !isUpdate;
            } return isUpdate;
        } catch (error) {
            throw error;
        }
    };


    static async checkMinExpForProject(minExp, deptId) {
        try {
            const result = await this.members.findOne({ deptId: deptId })
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


    static async checkMemberIndept(authorId, deptId) {
        try {
            const result = await this.members.findOne(
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



}


module.exports = DeptModel