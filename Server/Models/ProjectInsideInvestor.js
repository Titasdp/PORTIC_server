// To delete
const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");

const ProjectModel = require("../Models/Project");
const EntityModel = require("../Models/Entity")

class Project_inside_investor extends Model {}

Project_inside_investor.init({

}, {
    sequelize,
    modelName: "Project_inside_investor",
    tableName: "Project_inside_investor",
    timestamps: false,
});

ProjectModel.Project.belongsToMany(EntityModel.Entity, {
    through: Project_inside_investor,
    foreignKey: {
        name: "id_project",
        primaryKey: true,
        unique: false,
        allowNull: true
    }
});
EntityModel.Entity.belongsToMany(ProjectModel.Project, {
    through: Project_inside_investor,
    foreignKey: {
        name: "id_entity",
        primaryKey: true,
        unique: false,
        allowNull: true
    }
});


module.exports = {
    Project_inside_investor
};