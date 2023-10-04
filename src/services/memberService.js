const MemberModel = require("../models/memberModel");

class MemberService {

    constructor() { }

    checkMembersToDeptService = ({ memberSelect, deptId }, callback) => {
        MemberModel.checkMemberInDeptOrIsBlock(
            { memberSelect, deptId },
            (err, memberResult) => {
                if (err) {
                    return callback(err);
                }
                return memberResult.length === memberSelect.length ?
                    callback(null, { hasInsert: true }) :
                    callback(null, { hasInsert: false });
            }
        )
    };

    addMembersToDeptService = ({ deptId, membersSelect }, callback) => {
        MemberModel.insertSelectMember(
            { deptId, membersSelect },
            function (error, hasAddMembers) {
                if (error) {
                    return callback(error);
                }
                console.log(hasAddMembers, "asdkjh")
                return callback(null, { hasAddMembers });
            }
        )
    }
}


module.exports = new MemberService()