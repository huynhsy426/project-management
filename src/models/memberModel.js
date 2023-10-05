const connect = require('./connection')


class MemberModel {

    constructor(MemberModel) {
        this.memberId = MemberModel.memberId;
        this.deptId = MemberModel.deptId;
        this.position = MemberModel.position;
    }


    // Get all users
    static listMembers(callback) {
        const sql = "SELECT * FROM members";
        connect.query(
            sql,
            function (err, result) {
                if (err) {
                    return callback(err, null);
                }
                return callback(null, result);
            }
        )
    }


    // Insert member by select
    static insertMembers = ({ deptId, memberList }, callback) => {
        let sql = "INSERT INTO members VALUES "

        for (let index = 0; index < memberList.length; index++) {
            sql += `(${memberList[index].memberId}, '${deptId}', '${memberList[index].position}')`;
            (index < memberList.length - 1) ? sql += ',' : '';
        }
        console.log(sql);

        connect.query(
            sql,
            function (err, result) {
                if (err) {
                    return callback(err)
                }
                console.log(result);
                return callback(null, result)
            }
        )
    }


    // Check member in dept or blocked
    static checkMemberInDeptOrIsBlock({ memberSelect, deptId }, callback) {
        let listMemberId = memberSelect.map((value) => value.memberId).join(",");

        let sqlCheckIsBlock = `SELECT username
                   FROM users
                   WHERE userId IN (${listMemberId})
                         AND roles = "User"
                         AND (isBlocked = 1)`;

        connect.query(
            sqlCheckIsBlock,
            function (err, result) {
                if (err) {
                    return callback(err);
                }

                if (result.length > 0) {
                    return callback(new Error("ADD_MEMBER_BLOCK"))
                }

                if (!deptId) {
                    return callback();
                }

                let sqlCheckAlreadyInDept = `SELECT memberId
                                             FROM members
                                             WHERE memberId IN 
                                                   (SELECT userId 
                                                    FROM users 
                                                    WHERE userId IN (3,15)
                                                    AND roles = "User") 
                                             AND deptId = ${deptId}`;
                connect.query(
                    sqlCheckAlreadyInDept,
                    function (err, result) {
                        if (err) {
                            return callback(err);
                        }

                        if (result.length > 0) {
                            return callback(new Error("MEMBER_ALREADY_IN_DEPT"))
                        }
                        return callback();
                    }
                )
            }
        )
    }
}


module.exports = MemberModel;