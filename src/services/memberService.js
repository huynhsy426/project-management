const MemberModel = require("../models/memberModel");

class MemberService {

    constructor() { }

    // Kiem tra isBlock Or co ton tai trong Dept 
    checkMemberInDeptOrIsBlock = ({ memberSelect, deptId }, callback) => {
        MemberModel.checkMemberInDeptOrIsBlock(
            { memberSelect, deptId }, callback)
    };


    // Create memberList by members for insert
    // if has authorId add author to dept
    // Else not add
    // add memberList To Dept
    addMembersToDept = ({ deptId, members, authorId }, callback) => {
        console.log({ deptId, members, authorId })
        const memberList = members.map(member => {
            return {
                memberId: member.memberId,
                deptId: deptId,
                position: member.position
            }
        })

        if (authorId) {
            memberList.push({
                memberId: authorId,
                deptId: deptId,
                position: "pm"
            })
        }

        MemberModel.insertMembers(
            { deptId, memberList }, callback)
    }
}


module.exports = new MemberService()