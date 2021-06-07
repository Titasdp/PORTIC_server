const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");

const AvailablePositionModel = require("../Models/AvailablePosition");
const ProjectModel = require("../Models/Project");

class Project_recruitment extends Model {}

Project_recruitment.init({

}, {
    sequelize,
    modelName: "Project_recruitment",
    tableName: "Project_recruitment",
    timestamps: false,
});

AvailablePositionModel.Available_position.belongsToMany(ProjectModel.Project, {
    through: Project_recruitment,
    foreignKey: {
        name: "id_available_position",
        primaryKey: true,
        unique: false,
    }
});
ProjectModel.Project.belongsToMany(AvailablePositionModel.Available_position, {
    through: Project_recruitment,
    foreignKey: {
        name: "id_project",
        primaryKey: true,
        unique: false,
    }
});

module.exports = {
    Project_recruitment
};