const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");

const UnityModel = require("../Models/Unity");
const AreaModel = require("../Models/Area");

class Area_unity extends Model {}

Area_unity.init({

}, {
    sequelize,
    modelName: "Area_unity",
    tableName: "Area_unity",
    timestamps: false,
});

UnityModel.Unity.belongsToMany(AreaModel.Area, {
    through: Area_unity,
    foreignKey: {
        name: "id_unity",
        primaryKey: true,
        unique: false,
    }
});
AreaModel.Area.belongsToMany(UnityModel.Unity, {
    through: Area_unity,
    foreignKey: {
        name: "id_area",
        primaryKey: true,
        unique: false,
    }
});

module.exports = {
    Area_unity
};