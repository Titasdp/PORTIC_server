const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");

const ProjectModel = require("./Project");
const NewsModel = require("./News");

class Project_news extends Model {}

Project_news.init({

}, {
    sequelize,
    modelName: "Project_news",
    tableName: "Project_news",
    timestamps: false,
});

ProjectModel.Project.belongsToMany(NewsModel.News, {
    through: Project_news,
    foreignKey: {
        name: "id_project",
        primaryKey: true,
        unique: false,
    }
});
NewsModel.News.belongsToMany(ProjectModel.Project, {
    through: Project_news,
    foreignKey: {
        name: "id_news",
        primaryKey: true,
        unique: false,
    }
});

// as
module.exports = {
    Project_news
};