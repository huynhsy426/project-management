const connect = require('./connection')


class MemberModel {

    constructor(MemberModel) {
        this.memberId = MemberModel.memberId;
        this.deptId = MemberModel.deptId;
        this.position = MemberModel.position;
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

    static insertSelectMember = (listMembers, callback) => {
        let sql = "INSERT INTO members VALUES "

        for (let index = 0; index < listMembers.length; index++) {
            sql += `(${listMembers[index].memberId}, '${listMembers[index].deptId}', '${listMembers[index].position}')`
            console.log()
            if (index < listMembers.length - 1) {
                sql += ','
            }
        }

        // listMembers.map((member, index) => {
        //     sql += `(${member.memberId}, '${member.deptId}', '${member.position}')`
        //     if (index < listMembers.length - 1) {
        //         sql += ','
        //     }
        // return sql;
        // })
        console.log(sql)

        connect.query(
            sql,
            function (err) {
                if (err) {
                    return callback(err)
                }
                return callback(null, { hasAddMembers: true })
            }
        )
    }
}


module.exports = MemberModel;