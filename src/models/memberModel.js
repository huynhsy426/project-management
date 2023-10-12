const mySQLConnection = require('./connection')
const mysql = require('mysql2/promise');


class MemberModel {

    constructor(MemberModel) {
        this.memberId = MemberModel.memberId;
        this.deptId = MemberModel.deptId;
        this.position = MemberModel.position;
    }


    // Get all users
    static async listMembers() {
        const connect = await mysql.createConnection(mySQLConnection);

        try {
            const sql = "SELECT * FROM members";

            const [result] = await connect.execute(sql);
            return result;
        } catch (error) {
            throw error;
        } finally {
            connect.end();
        }
    }


    // Insert member by select
    static insertMembers = async (deptId, memberList) => {
        const connect = await mysql.createConnection(mySQLConnection);

        try {
            let sql = "INSERT INTO members VALUES "

            for (let index = 0; index < memberList.length; index++) {
                sql += `(${memberList[index].memberId}, '${deptId}', '${memberList[index].position}')`;
                (index < memberList.length - 1) ? sql += ',' : '';
            }

            const [resultAddMember] = await connect.execute(sql);
            return resultAddMember; // {}
        } catch (error) {
            throw error;
        } finally {
            connect.end();
        }
    }


    // Check member in dept or blocked
    static async checkMemberInDeptOrIsBlock(members, deptId) {
        const connect = await mysql.createConnection(mySQLConnection);

        try {
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
            const [result] = await connect.execute(sqlCheckIsBlock);
            if (result.length > 0) {
                throw (new Error("ADD_MEMBER_BLOCK"));
            }

            const findNotUserRole = result.find(item => item.roles !== 'User');

            if (findNotUserRole) {
                throw (new Error('NOT_ALLOW_ROLE'));
            }

            if (!deptId) {
                return;
            }

            let sqlCheckAlreadyInDept = `SELECT memberId
                                                 FROM members
                                                 WHERE memberId IN (${listMemberId}) 
                                                 AND deptId = "${deptId}"`;

            const [resultIndept] = await connect.execute(sqlCheckAlreadyInDept);
            if (resultIndept.length > 0) {
                throw (new Error("MEMBER_ALREADY_IN_DEPT"))
            } else {
                return;
            }
        } catch (error) {
            throw error;
        } finally {
            connect.end();
        }
    }


    // Check member in project
    static async checkMemberInProject(memberId) {
        const connect = await mysql.createConnection(mySQLConnection);

        try {
            const sql = `SELECT 1
                         FROM project
                         WHERE deptId IN (SELECT deptId FROM members 
                                          WHERE memberId = ?)
                               AND completedAt IS NULL
                         LIMIT 1`;

            const [result] = await connect.execute(sql, [memberId]);
            console.log({ result })

            if (result.length !== 0) {
                throw new Error("MEMBERS_CANNOT_DELETE");
            }
            return;
        } catch (error) {
            throw error;
        } finally {
            connect.end();
        }
    }


    // Delete member out dept
    static async delete(memberId, deptId) {
        const connect = await mysql.createConnection(mySQLConnection);

        try {
            const sql = `DELETE 
                         FROM members 
                         WHERE memberId = ? AND deptId = ?`;
            const [result] = await connect.execute(sql, [memberId, deptId]);
            console.log({ result });

            if (result.affectedRows === 0) {
                throw new Error("MEMBER_NOT_IN_DEPT_FOR_DEPT");
            }
            return;
        } catch (err) {
            throw err;
        } finally {
            connect.end();
        }
    }

}


module.exports = MemberModel;