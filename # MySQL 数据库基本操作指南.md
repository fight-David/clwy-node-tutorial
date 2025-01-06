# MySQL 数据库基本操作指南

本指南涵盖了 MySQL 数据库的一些基本操作，包括连接、创建数据库和表、数据的增删改查（CRUD）、以及备份与恢复等。

```sql
-- 1. 连接到 MySQL 数据库
-- 使用命令行工具连接到 MySQL：
-- bash
-- mysql -u 用户名 -p

-- 系统会提示输入密码，正确输入后即可连接到 MySQL。

-- 2. 创建数据库
CREATE DATABASE 数据库名称;

-- 3. 选择数据库
USE 数据库名称;

-- 4. 创建表
-- 定义并创建新表：
CREATE TABLE 表名 (
    列名1 数据类型 约束条件,
    列名2 数据类型 约束条件,
    ...
);

-- 示例：
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100)
);

-- 5. 插入数据
-- 向表中插入新的记录：
INSERT INTO 表名 (列名1, 列名2, ...) VALUES (值1, 值2, ...);
-- 示例：
INSERT INTO users (username, password, email) VALUES ('john', 'pass123', 'john@example.com');
-- 批量
INSERT INTO 表名 (列1, 列2, ...) VALUES 
(值1_1, 值1_2, ...),
(值2_1, 值2_2, ...),
...;
-- 批量示例：
INSERT INTO users (username, password, email) VALUES 
('alice', 'pass123', 'alice@example.com'),
('bob', 'pass456', 'bob@example.com'),
('carol', 'pass789', 'carol@example.com');

-- 6. 查询数据
-- 从表中检索数据：
SELECT 列名 FROM 表名 WHERE 条件;

-- 示例：
SELECT * FROM users WHERE id = 1;
-- 批量查询通常涉及检索大量数据，可以通过分页 (LIMIT 和 OFFSET - 起始位置) 或者将结果导出到文件中。
SELECT * FROM users ORDER BY id ASC LIMIT 10 OFFSET 0;
-- 7. 更新数据
-- 修改现有记录的数据：
UPDATE 表名 SET 列名 = 新值 WHERE 条件;
-- 示例：
UPDATE users SET email = 'newemail@example.com' WHERE id = 1;
-- 批量  使用CASE更新
UPDATE 表名
SET 列名 = CASE
    WHEN 条件1 THEN 新值1
    WHEN 条件2 THEN 新值2
    ...
    ELSE 列名
END
WHERE 更新条件;
-- 批量示例：
UPDATE users
SET email = CASE id
    WHEN 1 THEN 'newemail1@example.com'
    WHEN 2 THEN 'newemail2@example.com'
    ELSE email
END
WHERE id IN (1, 2);


-- 8. 删除数据
-- 删除表中的记录：
DELETE FROM 表名 WHERE 条件;

-- 示例：
DELETE FROM users WHERE id = 1;

-- 9. 删除表
DROP TABLE 表名;

-- 10. 备份与恢复数据库
-- 备份：使用 mysqldump 工具来备份数据库。
-- bash
-- mysqldump -u 用户名 -p 数据库名称 > 备份文件.sql

-- 恢复：使用 mysql 命令导入备份的 SQL 文件。
-- bash
-- mysql -u 用户名 -p 数据库名称 < 备份文件.sql

-- 11. 显示数据库和表信息
-- 显示所有数据库：
SHOW DATABASES;

-- 显示当前数据库中的所有表：
SHOW TABLES;

-- 显示表结构：
DESCRIBE 表名;

-- 或者
SHOW COLUMNS FROM 表名;


-- 12. 分页 (Pagination)
-- 分页是为了避免一次性加载大量数据，从而影响页面性能和用户体验。通常通过 SQL 查询中的 LIMIT 和 OFFSET 来实现。
-- ASC 升序 , DESC 降序 ,limit 限制返回的数量, offset 跳过前面若干行数据
SELECT * FROM 表名 ORDER BY 列名 ASC/DESC LIMIT 每页条数 OFFSET 起始位置;

-- 示例
-- const offset = (req.query.page - 1) * limit
SELECT * FROM users ORDER BY id ASC limit 10 offset `offset`


-- 13. 表与表之间的关联关系
-- 13.1 一对一 (One-to-One)
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    profile_id INT UNIQUE, 
    FOREIGN KEY (profile_id) REFERENCES profiles(id) 
);
-- 唯一性约束 (UNIQUE)：由于 profile_id 被标记为 UNIQUE，这意味着每个 profile_id 在 users 表中只能出现一次。这防止了多个用户指向同一个 profiles 记录的情况发生。
-- 外键约束 (FOREIGN KEY)：保证了 users 表中的 profile_id 必须对应于 profiles 表中的某个 id，从而维护了两个表之间的关联。

![alt text](image.png)

-- 13.2 一对多 (One-to-Many)
CREATE TABLE categories (
    id INT PRIMARY KEY,
    name VARCHAR(50)
);

CREATE TABLE articles (
    id INT PRIMARY KEY,
    title VARCHAR(100),
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);
-- category_id INT 后面没有加 unique 表示唯一性约束
-- 一个分类可以关联到多个文章,但一篇文章只能属于一个分类
![alt text](image-1.png)

-- 13.3 多对多 (Many-to-Many)
CREATE TABLE students (
    id INT PRIMARY KEY,
    name VARCHAR(50)
);

CREATE TABLE courses (
    id INT PRIMARY KEY,
    name VARCHAR(50)
);

CREATE TABLE student_courses (
    student_id INT,
    course_id INT,
    PRIMARY KEY (student_id, course_id), -- 组合主键，确保每一对 (student_id, course_id) 是唯一的，即一个学生不能多次选修同一门课程。
    FOREIGN KEY (student_id) REFERENCES students(id), -- 定义外键约束，确保 student_id 必须存在于 students 表中。
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- 一个学生可以选修多门课程,一门课程可以被多个学生选修
![alt text](image-2.png)