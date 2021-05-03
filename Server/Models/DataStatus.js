const {
    Model,
    DataTypes
} = require("sequelize");
/**
 * //// Structure (Completed)
 * doesn't need other tables primary keys (completed)
 */
const sequelize = require("../Database/connection");
const uniqueIdPack = require("../Middleware/uniqueId")

class Data_status extends Model {}

Data_status.init({
    id_status: {
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
    // created_at: {
    //     type: 'TIMESTAMP',
    //     defaultValue: sequelize.NOW,
    //     allowNull: false,
    // },
    // updated_at: {
    //     type: 'TIMESTAMP',
    //     defaultValue: sequelize.NOW,
    //     allowNull: false,
    // },

}, {
    sequelize,
    timestamps: false,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: "Data_Status",
    tableName: "Data_Status",
    logging: false,
});

module.exports = {
    Data_status
};