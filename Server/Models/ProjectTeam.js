const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");

const ProjectModel = require("../Models/Project");
const UserModel = require("../Models/User");

class Project_team extends Model {}

Project_team.init({
    can_edit: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: 0,
    }
}, {
    sequelize,
    modelName: "Project_team",
    tableName: "Project_team",
    timestamps: false,
});

ProjectModel.Project.belongsToMany(UserModel.User, {
    through: Project_team,
    foreignKey: {
        name: "id_project",
        primaryKey: true,
        unique: false,
        allowNull: false
    }
});
UserModel.User.belongsToMany(ProjectModel.Project, {
    through: Project_team,
    foreignKey: {
        name: "id_team_member",
        primaryKey: true,
        unique: false,
        allowNull: false
    }
});



module.exports = {
    Project_team
};