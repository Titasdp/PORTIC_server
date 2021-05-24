const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");

const AreaModel = require("../Models/Area");
const ProjectModel = require("../Models/Project");

class Project_area extends Model {}

Project_area.init({

}, {
    sequelize,
    modelName: "Project_area",
    tableName: "Project_area",
    timestamps: false,
});

AreaModel.Area.belongsToMany(ProjectModel.Project, {
    through: Project_area,
    foreignKey: {
        name: "id_area",
        primaryKey: true,
        unique: false,
    }
});
ProjectModel.Project.belongsToMany(AreaModel.Area, {
    through: Project_area,
    foreignKey: {
        name: "id_project",
        primaryKey: true,
        unique: false,
    }
});

module.exports = {
    Project_area
};