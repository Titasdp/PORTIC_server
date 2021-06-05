const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");

const AvailablePositionModel = require("./AvailablePosition");
const CategoryModel = require("./Category");

class Recruitment_category extends Model {}

Recruitment_category.init({

}, {
    sequelize,
    modelName: "Recruitment_category",
    tableName: "Recruitment_category",
    timestamps: false,
});

AvailablePositionModel.Available_position.belongsToMany(CategoryModel.Category, {
    through: Recruitment_category,
    foreignKey: {
        name: "id_available_position",
        primaryKey: true,
        unique: false,
        allowNull: false
    }

});
CategoryModel.Category.belongsToMany(AvailablePositionModel.Available_position, {
    through: Recruitment_category,
    foreignKey: {
        name: "id_category",
        primaryKey: true,
        unique: false,
        allowNull: false
    }
});


module.exports = {
    Recruitment_category
};