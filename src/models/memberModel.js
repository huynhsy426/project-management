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
    static insertMembers = (deptId, memberList) => {
        return new Promise((resolve, reject) => {
            let sql = "INSERT INTO members VALUES "

            for (let index = 0; index < memberList.length; index++) {
                sql += `(${memberList[index].memberId}, '${deptId}', '${memberList[index].position}')`;
                (index < memberList.length - 1) ? sql += ',' : '';
            }
            console.log(sql);

            connect.query(
                sql,
                function (err, resultAddMember) {
                    if (err) {
                        return reject(err)
                    }
                    return resolve(resultAddMember)
                }
            )
        })
    }


    // Check member in dept or blocked
    static checkMemberInDeptOrIsBlock(members, deptId) {
        return new Promise((resolve, reject) => {
            let listMemberId = "";
            if (members.length !== 0) {
                listMemberId = members.map((value) => value.memberId).join(",");
            } else {
                listMemberId = 0
            }


            let sqlCheckIsBlock = `SELECT username, roles
                       FROM users
                       WHERE userId IN (${listMemberId})
                            AND isBlocked = 1`;

            connect.query(
                sqlCheckIsBlock,
                function (err, result) {
                    if (err) {
                        return reject(err);
                    }

                    if (result.length > 0) {
                        return reject(new Error("ADD_MEMBER_BLOCK"));
                    }

                    const findNotUserRole = result.find(item => item.roles !== 'User');
                    if (findNotUserRole) {
                        return reject(new Error('NOT_ALLOW_ROLE'));
                    }

                    if (!deptId) {
                        return resolve();
                    }

                    let sqlCheckAlreadyInDept = `SELECT memberId
                                                 FROM members
                                                 WHERE memberId IN (${listMemberId}) 
                                                 AND deptId = "${deptId}"`;
                    connect.query(
                        sqlCheckAlreadyInDept,
                        function (err, resultIndept) {
                            if (err) {
                                return reject(err);
                            }

                            if (resultIndept.length > 0) {
                                return reject(new Error("MEMBER_ALREADY_IN_DEPT"))
                            } else {
                                return resolve();
                            }
                        }
                    )
                }
            )

        })
    }
}


module.exports = MemberModel;