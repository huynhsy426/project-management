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
    static insertSelectMember = ({ deptId, membersSelect }, callback) => {
        let sql = "INSERT INTO members VALUES "

        for (let index = 0; index < membersSelect.length; index++) {
            sql += `(${membersSelect[index].memberId}, '${deptId}', '${membersSelect[index].position}')`;
            (index < membersSelect.length - 1) ? sql += ',' : '';
        }

        connect.query(
            sql,
            function (err, result) {
                if (err) {
                    return callback(err)
                }
                console.log(result);
                return callback(null, { hasAddMembers: true })
            }
        )
    }


    // Check member in dept or blocked
    static checkMemberInDeptOrIsBlock({ memberSelect, deptId }, callback) {
        let listMemberId = "";
        memberSelect.map((value, index) => {
            listMemberId += value.memberId;
            (index < memberSelect.length - 1) ? listMemberId += ',' : '';
        })

        let sql = `SELECT 1
                   FROM users
                   LEFT JOIN members ON users.userId = members.memberId
                   WHERE userId IN (${listMemberId})
                        AND roles = "User" 
                        AND (isBlocked = 0 OR isBlocked IS NULL) `;

        const hasDeptId = deptId && deptId !== undefined;

        hasDeptId ?
            sql += `AND users.userId NOT IN 
                    (SELECT memberId from members WHERE deptId = '${deptId}')
                    GROUP BY userId`
            :
            sql += `GROUP BY userId`;

        connect.query(
            sql,
            function (err, result) {
                if (err) {
                    return callback(err);
                }
                return callback(null, result);
            }
        )
    }
}


module.exports = MemberModel;