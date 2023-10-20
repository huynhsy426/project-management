const mongoose = require('mongoose');
const MemberModel = require('../models/memberModel');

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


    static projectSchema = new mongoose.Schema({
        projectName: {
            type: String,
            required: true
        },
        deptId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        insTm: {
            type: Date,
            required: false
        },
        updTm: {
            type: Date,
            required: false
        },
        version: {
            type: Number,
            required: false
        },
        leaderId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        minExp: {
            type: Number,
            required: true
        },
        completedAt: {
            type: Date,
            required: false
        }
    }, {
        versionKey: false // You should be aware of the outcome after set to false
    })

    static projects = mongoose.model('projects', this.projectSchema);
    static members = MemberModel.member;


    static async listProjectByRoles(roles, userId) {
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
    }


    static async create(project) {
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


    static async isExistName(projectName) {
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

}



module.exports = ProjectModel;