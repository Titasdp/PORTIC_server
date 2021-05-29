const {
    Model,
    DataTypes
} = require("sequelize");
/**
 * //// Structure (Completed)
 * doesn't need other tables primary keys (completed)
 */
const sequelize = require("../Database/connection");

class Communication_level extends Model {}

Communication_level.init({
    id_communication_level: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    designation: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

}, {
    sequelize,
    timestamps: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: "Communication_level",
    tableName: "Communication_level",
    logging: false,
});

module.exports = {
    Communication_level
};