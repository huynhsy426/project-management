const MemberModel = require("../models/memberModel");

class MemberService {

    constructor() { }


    // Check member block
    // Check member already in dept
    checkMemberInDeptOrIsBlock = ({ memberSelect, deptId }, callback) => {
        MemberModel.checkMemberInDeptOrIsBlock({ memberSelect, deptId }, callback);
    };

    addMembersToDeptService = ({ deptId, members, deptAuthorId }, callback) => {
        const addMembers = members.map(item => {
            return {
                memberId: item.memberId,
                position: item.position,
                deptId,
            }
        });
        addMembers.push({
            memberId: deptAuthorId,
            deptId,
            position: "pm"
        });

        MemberModel.insertMember(
            members,
            callback
        );
    }
}


module.exports = new MemberService()