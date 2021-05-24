const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");

const AvailablePositionModel = require("../Models/AvailablePosition");
const CourseModel = require("../Models/Course");

class Recruitment_course extends Model {}

Recruitment_course.init({

}, {
    sequelize,
    modelName: "Recruitment_course",
    tableName: "Recruitment_course",
    timestamps: false,
});

AvailablePositionModel.Available_position.belongsToMany(CourseModel.Course, {
    through: Recruitment_course,
    foreignKey: {
        name: "id_available_position",
        primaryKey: true,
        unique: false,
    }
});
CourseModel.Course.belongsToMany(AvailablePositionModel.Available_position, {
    through: Recruitment_course,
    foreignKey: {
        name: "id_course",
        primaryKey: true,
        unique: false,
    }
});

module.exports = {
    Recruitment_course
};