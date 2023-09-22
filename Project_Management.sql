CREATE DATABASE project_management;
USE project_management;

CREATE TABLE project(
	project_id CHAR(10) PRIMARY KEY,
    project_name NVARCHAR(200) NOT NULL UNIQUE,
    dept_id CHAR(10),
    ins_tm DATE,
    upd_tm DATE,
    version int,
    leader_id INT,
    min_exp int,
    completed_at DATE
);


CREATE TABLE users(
	user_id INT PRIMARY KEY AUTO_INCREMENT,
    user_name NVARCHAR(200) NOT NULL UNIQUE,
    age INT,
    roles NVARCHAR(100), 
    user_password NVARCHAR(200),
    is_blocked BOOLEAN 
);


ALTER TABLE project
ADD CONSTRAINT fk_project_users
FOREIGN KEY (leader_id) REFERENCES users (user_id);


CREATE TABLE dept (
	dept_id CHAR(10) PRIMARY KEY,
    dept_name NVARCHAR(200),
    author_id INT
);


ALTER TABLE dept 
ADD CONSTRAINT fk_dept_users
FOREIGN KEY (author_id) REFERENCES users (user_id);


ALTER TABLE project 
ADD CONSTRAINT fk_project_dept
FOREIGN KEY (dept_id) REFERENCES dept (dept_id);


CREATE TABLE members(
	member_id INT,
    dept_id CHAR(10) ,
    exp int,
    PRIMARY KEY (member_id,dept_id)
);


ALTER TABLE members 
ADD CONSTRAINT fk_members_users
FOREIGN KEY (member_id) REFERENCES users (user_id);


ALTER TABLE members 
ADD CONSTRAINT fk_members_dept
FOREIGN KEY (dept_id) REFERENCES dept (dept_id);


ALTER TABLE dept
DROP FOREIGN KEY fk_dept_users;

-- dept fk_dept_users
-- Members fk_members_dept   fk_members_users  
-- project fk_project_dept   fk_project_users
-- 


INSERT INTO users(user_name,age, roles, user_password) VALUES
("huynhsy", 23, "Admin","asd"),
("asd", 18, "Admin","asd"),
("qwe", 23, "user","qwe");


INSERT INTO dept VALUES
("D0001", "developer",1);


INSERT INTO members VALUES
(1, "D0001",3),
(2, "D0001",3),
(3, "D0001",2);


INSERT INTO project VALUES
("PR001","Design web","D0001","2023-09-01",NULL,1,1,2,NULL);