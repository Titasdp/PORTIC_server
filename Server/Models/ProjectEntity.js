//Participants entities
const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");

const ProjectModel = require("../Models/Project");
const EntityModel = require("../Models/Entity");

class Project_entity extends Model {}

Project_entity.init({

}, {
    sequelize,
    modelName: "Project_entity",
    tableName: "Project_entity",
    timestamps: false,
});

ProjectModel.Project.belongsToMany(EntityModel.Entity, {
    through: Project_entity,
    foreignKey: {
        name: "id_project",
        primaryKey: true,
        unique: false,
        allowNull: false
    }
});
EntityModel.Entity.belongsToMany(ProjectModel.Project, {
    through: Project_entity,
    foreignKey: {
        name: "id_entity",
        primaryKey: true,
        unique: false,
        allowNull: false
    }
});


module.exports = {
    Project_entity
};