const MemberModel = require("../models/memberModel");

class MemberService {

    constructor() { }

    // Kiem tra isBlock Or co ton tai trong Dept 
    checkMemberInDeptOrIsBlock = (members, deptId) => {
        return MemberModel.checkMemberInDeptOrIsBlock(members, deptId)
    };


    // Create memberList by members for insert
    // if has authorId add author to dept
    // Else not add
    // add memberList To Dept
    addMembersToDept = ({ deptId, members, authorId }) => {
        const memberList = members.map(member => {
            return {
                memberId: member.memberId,
                deptId: deptId,
                position: member.position
            }
        })

        if (authorId && memberList.length > 0) {
            memberList.push({
                memberId: authorId,
                deptId: deptId,
                position: "pm"
            })
        };

        if (memberList.length > 0) {
            return MemberModel.insertMembers(deptId, memberList)
        }

        let resultAddMember = false;
        return resultAddMember;
    }
}


module.exports = new MemberService()