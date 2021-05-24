const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");

const UnityModel = require("../Models/Unity");
const CourseModel = require("../Models/Course");

class Course_unity extends Model {}

Course_unity.init({

}, {
    sequelize,
    modelName: "Course_unity",
    tableName: "Course_unity",
    timestamps: false,
});

UnityModel.Unity.belongsToMany(CourseModel.Course, {
    through: Course_unity,
    foreignKey: {
        name: "id_unity",
        primaryKey: true,
        unique: false,
    }
});
CourseModel.Course.belongsToMany(UnityModel.Unity, {
    through: Course_unity,
    foreignKey: {
        name: "id_course",
        primaryKey: true,
        unique: false,
    }
});

module.exports = {
    Course_unity
};