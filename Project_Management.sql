-- CREATE DATABASE project_management;
-- USE project_management;

CREATE TABLE project(
	projectId CHAR(10) PRIMARY KEY,
    projectName NVARCHAR(200) NOT NULL UNIQUE,
    deptId CHAR(10),
    insTm DATE,
    updTm DATE,
    version int,
    leaderId INT,
    minExp int,
    completedAt DATE
);


CREATE TABLE users(
	userId INT PRIMARY KEY AUTO_INCREMENT,
    username NVARCHAR(200) NOT NULL UNIQUE,
    age INT,
    roles NVARCHAR(100), 
    userPassword NVARCHAR(200),
    gmail NVARCHAR(200),
    exp INT,
    isBlocked BOOLEAN 
);


ALTER TABLE project
ADD CONSTRAINT fk_project_users
FOREIGN KEY (leaderId) REFERENCES users (userId);


CREATE TABLE dept (
	deptId CHAR(10) PRIMARY KEY,
    deptName NVARCHAR(200),
    authorId INT
);


ALTER TABLE dept 
ADD CONSTRAINT fk_dept_users
FOREIGN KEY (authorId) REFERENCES users (userId);


ALTER TABLE project 
ADD CONSTRAINT fk_project_dept
FOREIGN KEY (deptId) REFERENCES dept (deptId);


CREATE TABLE members(
	memberId INT,
    deptId CHAR(10) ,
    position NVARCHAR(200),
    PRIMARY KEY (memberId,deptId)
);


ALTER TABLE members 
ADD CONSTRAINT fk_membersUsers
FOREIGN KEY (memberId) REFERENCES users (userId);


ALTER TABLE members 
ADD CONSTRAINT fk_members_dept
FOREIGN KEY (deptId) REFERENCES dept (deptId);


ALTER TABLE dept
DROP FOREIGN KEY fk_dept_users;

-- dept fk_dept_users
-- Members fk_members_dept   fk_members_users  
-- project fk_project_dept   fk_project_users
-- 


INSERT INTO users(username,age, roles, userPassword,gmail, exp) VALUES
("huynhsy", 23, "Admin","asd","huynhsy@gmail.com", 2),
("asd", 18, "Admin","asd","asd@gmail.com",3),
("qwe", 23, "User","qwe","qwe@gmail.com",1);


INSERT INTO dept VALUES
("D0001", "developer",1);


INSERT INTO members VALUES
(1, "D0001","pm"),
(2, "D0001","dev"),
(3, "D0001","tester");


INSERT INTO project VALUES
("PR001","Design web","D0001","2023-09-01",NULL,1,1,2,NULL);


SELECT * FROM users;
SELECT * FROM members;
SELECT * FROM dept;




-- ---------- Nhap
SELECT * FROM members
WHERE memberId =  1;
SELECT * FROM members
JOIN dept ON members.deptId = dept.deptId
WHERE memberId = 1;

SELECT * FROM dept;

SELECT memberId, position, dept.deptId, deptName,authorId
FROM members 
JOIN dept ON members.deptId = dept.deptId
WHERE memberId = 3
;


SELECT * 
FROM members
WHERE memberId = 2 AND deptId = 'D0001'
;


-- SELECT users.userId, users.username, users.age, users.roles, users.gmail, dept.deptName, dept.authorId as 'Manager', members.exp
-- FROM users JOIN members ON users.userId = members.memberId
-- 		   JOIN dept ON members.deptId = dept.deptId;
SELECT * FROM users;
SELECT * FROM members;
SELECT * FROM dept;


SELECT userId, username, age, roles, gmail, exp, deptId, position , isBlocked
FROM users
LEFT JOIN members ON users.userId = members.memberId
WHERE roles = "User" and (isBlocked = 0 OR isBlocked IS NULL) AND users.userId NOT IN (SELECT memberId from members where deptId = "D0004");

SELECT userId, username, age, roles, gmail, exp, isBlocked
FROM users
LEFT JOIN members ON users.userId = members.memberId
WHERE userId IN (3,15) 
AND roles = "User" 
and (isBlocked = 0 OR isBlocked IS NULL) AND users.userId NOT IN (SELECT memberId from members where deptId = "D0004")
GROUP BY userId;

SELECT 1
FROM users
LEFT JOIN members ON users.userId = members.memberId
WHERE userId IN ('3','15')
AND roles = "User"
AND (isBlocked = 0 OR isBlocked IS NULL) GROUP BY userId
;

SELECT * FROM users WHERE userId = '2' and isBlocked = 0;

SELECT 1 
FROM users
WHERE userId = 1 AND roles IN ("User");

SELECT userId 
FROM users
-- LEFT JOIN members ON users.userId = members.memberId
WHERE roles = "User" and isBlocked = 0
GROUP BY userId;

SELECT * 
FROM members JOIN dept ON members.deptId = dept.deptId
WHERE deptName = "dev"
;


SELECT * 
FROM members JOIN users ON members.memberId = users.userId
WHERE memberId in (1,3,15) AND deptId = 'D0001' AND isBlocked = 0;

SELECT * 
FROM members RIGHT JOIN users ON members.memberId = users.userId
WHERE memberId IN (1,3,4,15) AND deptId = 'D0001'
;


SELECT * FROM users;
SELECT * FROM members;
SELECT * FROM dept;

SELECT * 
FROM users LEFT JOIN members ON users.userId = members.memberId
WHERE members.deptId = 'D0001'
;

SELECT * 
FROM members
WHERE deptId <> 'D0001' 
;

SELECT (deptId)
FROM dept
ORDER BY deptId  DESC LIMIT 1
;

SELECT deptName 
FROM dept
WHERE deptName = "develop1er2" LIMIT 1
;

SELECT username 
FROM users
WHERE 
userId IN (3,18,15) AND roles = "User" AND (isBlocked != 1)
;


SELECT memberId
FROM members
WHERE memberId IN (SELECT userId FROM users WHERE userId IN (3,18)  AND roles = "User")
AND deptId = 'D0001'
;


SELECT * FROM members;