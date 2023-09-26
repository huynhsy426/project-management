const connect = require('./connection')


class MemberModel {

    constructor(MemberModel) {
        this.memberId = MemberModel.memberId;
        this.deptId = MemberModel.deptId;
        this.exp = MemberModel.exp;
    }


    // Get all users
    static listMember(results) {
        const sql = "SELECT * FROM members ";
        connect.query(
            sql,
            function (err, result) {
                if (err) {
                    return results(err, null);
                }
                return results(null, result);
            }
        )
    }
}


module.exports = MemberModel;