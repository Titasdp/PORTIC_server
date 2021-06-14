// To delete
const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");

const ProjectModel = require("../Models/Project");
const OutsideInvestorModel = require("../Models/OutsideInvestor");

class Project_outside_investor extends Model {}

Project_outside_investor.init({

}, {
    sequelize,
    modelName: "Project_outside_investor",
    tableName: "Project_outside_investor",
    timestamps: false,
});

ProjectModel.Project.belongsToMany(OutsideInvestorModel.Outside_investor, {
    through: Project_outside_investor,
    foreignKey: {
        name: "id_project",
        primaryKey: true,
        unique: false,
        allowNull: true
    }
});
OutsideInvestorModel.Outside_investor.belongsToMany(ProjectModel.Project, {
    through: Project_outside_investor,
    foreignKey: {
        name: "id_outside_investor",
        primaryKey: true,
        unique: false,
        allowNull: true
    }
});


module.exports = {
    Project_outside_investor
};