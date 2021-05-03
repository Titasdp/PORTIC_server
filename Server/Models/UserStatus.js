const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");
const uniqueIdPack = require("../Middleware/uniqueId")
class User_status extends Model {}

User_status.init({
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
    modelName: "User_status",
    tableName: "User_status",
    logging: false,
});

module.exports = {
    User_status
};