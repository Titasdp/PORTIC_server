const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");

const AvailablePositionModel = require("../Models/AvailablePosition");
const UnityModel = require("../Models/Unity");

class Recruitment_unity extends Model {}

Recruitment_unity.init({

}, {
    sequelize,
    modelName: "Recruitment_unity",
    tableName: "Recruitment_unity",
    timestamps: false,
});

AvailablePositionModel.Available_position.belongsToMany(UnityModel.Unity, {
    through: Recruitment_unity,
    foreignKey: {
        name: "id_available_position",
        primaryKey: true,
        unique: false,
    }
});
UnityModel.Unity.belongsToMany(AvailablePositionModel.Available_position, {
    through: Recruitment_unity,
    foreignKey: {
        name: "id_unity",
        primaryKey: true,
        unique: false,
    }
});

module.exports = {
    Recruitment_unity
};