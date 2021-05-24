const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");

const UnityModel = require("../Models/Unity");
const ProjectModel = require("../Models/Project");

class Project_unity extends Model {}

Project_unity.init({

}, {
    sequelize,
    modelName: "Project_unity",
    tableName: "Project_unity",
    timestamps: false,
});

UnityModel.Unity.belongsToMany(ProjectModel.Project, {
    through: Project_unity,
    foreignKey: {
        name: "id_unity",
        primaryKey: true,
        unique: false,
    }
});
ProjectModel.Project.belongsToMany(UnityModel.Unity, {
    through: Project_unity,
    foreignKey: {
        name: "id_project",
        primaryKey: true,
        unique: false,
    }
});

module.exports = {
    Project_unity
};