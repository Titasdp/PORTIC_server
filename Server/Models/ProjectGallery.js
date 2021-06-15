const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");

const ProjectModel = require("../Models/Project");
const PictureModel = require("../Models/Picture");

class Project_gallery extends Model {}

Project_gallery.init({

}, {
    sequelize,
    modelName: "Project_gallery",
    tableName: "Project_gallery",
    timestamps: false,
});

ProjectModel.Project.belongsToMany(PictureModel.Picture, {
    through: Project_gallery,
    foreignKey: {
        name: "id_project",
        primaryKey: true,
        unique: false,
        allowNull: false
    }
});
PictureModel.Picture.belongsToMany(ProjectModel.Project, {
    through: Project_gallery,
    foreignKey: {
        name: "id_image",
        primaryKey: true,
        unique: false,
        allowNull: false
    }
});


module.exports = {
    Project_gallery
};