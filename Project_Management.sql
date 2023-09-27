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
    exp int,
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


INSERT INTO users(username,age, roles, userPassword,gmail) VALUES
("huynhsy", 23, "Admin","asd","huynhsy@gmail.com"),
("asd", 18, "Admin","asd","asd@gmail.com"),
("qwe", 23, "User","qwe","qwe@gmail.com");


INSERT INTO dept VALUES
("D0001", "developer",1);


INSERT INTO members VALUES
(1, "D0001",3),
(2, "D0001",3),
(3, "D0001",2);


INSERT INTO project VALUES
("PR001","Design web","D0001","2023-09-01",NULL,1,1,2,NULL);


SELECT * FROM users;
SELECT * FROM members;
SELECT * FROM dept;

SELECT users.userId, users.username, users.age, users.roles, users.gmail, dept.deptName, dept.authorId as 'Manager', members.exp
FROM users JOIN members ON users.userId = members.memberId
		   JOIN dept ON members.deptId = dept.deptId;
           
           
SELECT deptId FROM dept 
ORDER BY deptId;