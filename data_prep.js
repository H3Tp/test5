const Sequelize = require('sequelize')
const fs = require("fs");

var sequelize = new Sequelize('zkxfuyih', 'zkxfuyih', 'N0pYuD9Ypku_jtXlEzP8GDwHCR9cIp-5', {
    host: 'peanut.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

sequelize
    .authenticate()
    .then(function () {
        console.log('Connection has been established successfully.');
    })
    .catch(function (err) {
        console.log('Unable to connect to the database:', err);
    });

var Student = sequelize.define('Student', {
    studId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING,
    program: Sequelize.STRING,
    gpa: Sequelize.FLOAT
});



let students = [];
exports.prep = () => {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(function () {
            resolve("success!");
        }).catch(function (error) {
            reject("Unable to sync the database");
        });
    });
};

exports.cpa = () => {
    return new Promise((resolve, reject) => {
        Student.findAll({
            where: {
                program: "CPA"
            }
        }).then((data) => {
            resolve(data);
        }).catch((reason) => {
            reject(reason);
        });
    });
}
exports.highGPA = () => {
    return new Promise((resolve, reject) => {
        Student.findAll({
            order: [
                ['gpa', 'DESC']
            ],
            limit: 1
        }).then((data) => {
            console.log(data);
            resolve(data[0]);
        }
        ).catch((reason) => {
            reject(reason);
        }
        );
    });
};

exports.allStudents = () => {
    return new Promise((resolve, reject) => {
        (students.length == 0) ? reject("No students.") : resolve(students);
    });
}

exports.addStudent = (student) => {
    return new Promise((resolve, reject) => {
        Student.create(student).then(function (project) {
            resolve("success!")
        }).catch(function (error) {
            reject("unable to add student");
        });
    });
}

exports.getSudent = (studId) => {
    return new Promise((resolve, reject) => {
        let student = students.find(student => student.studId == studId);
        student ? resolve(student) : reject("Student not found.");
    });
}