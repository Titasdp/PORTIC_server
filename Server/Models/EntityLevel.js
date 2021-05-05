const {
    Model,
    DataTypes
} = require("sequelize");

/**
 * //// Structure (Completed)
 * doesn't need other tables primary keys (completed)
 */
const sequelize = require("../Database/connection");


class Entity_level extends Model {}

Entity_level.init({
    id_entity_level: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    designation: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    sequelize,
    timestamps: false,
    modelName: "Entity_level",
    tableName: "Entity_level",
    logging: false,
});

module.exports = {
    Entity_level
};