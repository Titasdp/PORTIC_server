const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");

const AvailablePositionModel = require("../Models/AvailablePosition");
const AreaModel = require("../Models/Area");

class Recruitment_area extends Model {}

Recruitment_area.init({

}, {
    sequelize,
    modelName: "Recruitment_area",
    tableName: "Recruitment_area",
    timestamps: false,
});

AvailablePositionModel.Available_position.belongsToMany(AreaModel.Area, {
    through: Recruitment_area,
    foreignKey: {
        name: "id_available_position",
        primaryKey: true,
        unique: false,
    }
});
AreaModel.Area.belongsToMany(AvailablePositionModel.Available_position, {
    through: Recruitment_area,
    foreignKey: {
        name: "id_area",
        primaryKey: true,
        unique: false,
    }
});

module.exports = {
    Recruitment_area
};