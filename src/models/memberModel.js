const connect = require('./connection')


class MemberModel {

    constructor(MemberModel) {
        this.memberId = MemberModel.memberId;
        this.deptId = MemberModel.deptId;
        this.position = MemberModel.position;
    }


    // Get all users
    static listMember(callback) {
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
    static insertMember = (members, callback) => {
        let sql = "INSERT INTO members VALUES ";
        for (let index = 0; index < members.length; index++) {
            sql += `(${members[index].memberId}, '${members[index].deptId}', '${members[index].position}')`;
            (index < members.length - 1) ? sql += ',' : '';
        }

        connect.query(
            sql,
            function (err, result) {
                if (err) {
                    return callback(err)
                }
                return callback(null, result);
            }
        )
    }


    // Check member in dept or blocked
    // static checkMemberInDeptOrIsBlock({ memberSelect, deptId }, callback) {
    //     let listMemberId = "";
    //     memberSelect.map((value, index) => {
    //         listMemberId += value.memberId;
    //         (index < memberSelect.length - 1) ? listMemberId += ',' : '';
    //     })
    //
    //     let sql = `SELECT 1
    //                FROM users
    //                LEFT JOIN members ON users.userId = members.memberId
    //                WHERE userId IN (${listMemberId})
    //                     AND roles = "User"
    //                     AND (isBlocked = 0 OR isBlocked IS NULL) `;
    //
    //     const hasDeptId = deptId && deptId !== undefined;
    //
    //     hasDeptId ?
    //         sql += `AND users.userId NOT IN
    //                 (SELECT memberId from members WHERE deptId = '${deptId}')
    //                 GROUP BY userId`
    //         :
    //         sql += `GROUP BY userId`;
    //
    //     connect.query(
    //         sql,
    //         function (err, result) {
    //             if (err) {
    //                 return callback(err);
    //             }
    //             return callback(null, result);
    //         }
    //     )
    // }

    static checkMemberInDeptOrIsBlock({ members, deptId }, callback) {
        const listMemberId = members.join(',');
        let sqlCheckBlock = `SELECT 1
                   FROM users
                   WHERE userId IN (${listMemberId}) AND isBlocked == 1 LIMIT 1`;

        connect.query(
            sqlCheckBlock,
            function (err, result) {
                if (err) {
                    return callback(err);
                }
                if (result.length > 0) {
                    return callback(new Error('ADD_MEMBER_BLOCK'));
                }
                if (!deptId) {
                    return callback();
                }
                let sqlCheckAlreadyInDept = `SELECT 1
                       FROM members
                       WHERE memberId IN (${listMemberId}) AND deptId = deptId LIMIT 1`;

                connect.query(sqlCheckAlreadyInDept, function(err, alreadyInDeptResult) {
                    if (err) {
                        return callback(err);
                    }
                    if (alreadyInDeptResult.length > 0) {
                        return callback(new Error('MEMBER_ALREADY_IN_DEPT'));
                    }
                    return callback();
                });
            }
        )
    }
}


module.exports = MemberModel;