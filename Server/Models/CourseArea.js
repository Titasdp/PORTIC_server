const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");

const AreaModel = require("../Models/Area");
const CourseModel = require("../Models/Course");

class Course_area extends Model {}

Course_area.init({

}, {
    sequelize,
    modelName: "Course_area",
    tableName: "Course_area",
    timestamps: false,
});

AreaModel.Area.belongsToMany(CourseModel.Course, {
    through: Course_area,
    foreignKey: {
        name: "id_area",
        primaryKey: true,
        unique: false,
    }
});
CourseModel.Course.belongsToMany(AreaModel.Area, {
    through: Course_area,
    foreignKey: {
        name: "id_course",
        primaryKey: true,
        unique: false,
    }
});

module.exports = {
    Course_area
};