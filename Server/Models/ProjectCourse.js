const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");

const CourseModel = require("../Models/Course");
const ProjectModel = require("../Models/Project");

class Project_course extends Model {}

Project_course.init({

}, {
    sequelize,
    modelName: "Project_course",
    tableName: "Project_course",
    timestamps: false,
});

CourseModel.Course.belongsToMany(ProjectModel.Project, {
    through: Project_course,
    foreignKey: {
        name: "id_course",
        primaryKey: true,
        unique: false,
    }
});
ProjectModel.Project.belongsToMany(CourseModel.Course, {
    through: Project_course,
    foreignKey: {
        name: "id_project",
        primaryKey: true,
        unique: false,
    }
});

module.exports = {
    Project_course
};