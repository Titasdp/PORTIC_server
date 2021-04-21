const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");

const CourseModel = require("../Models/Course");
const CategoryModel = require("../Models/Category");

class Course_category extends Model {}

Course_category.init({

}, {
    sequelize,
    modelName: "Course_category",
    tableName: "Course_category",
    timestamps: false,
});

CourseModel.Course.belongsToMany(CategoryModel.Category, {
    through: Course_category,
    foreignKey: {
        name: "id_course",
        primaryKey: true,
        unique: false,
        allowNull: false
    }

});
CategoryModel.Category.belongsToMany(CourseModel.Course, {
    through: Course_category,
    foreignKey: {
        name: "id_category",
        primaryKey: true,
        unique: false,
        allowNull: false
    }

});


module.exports = {
    Course_category
};