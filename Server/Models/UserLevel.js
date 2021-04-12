const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");
const uniqueIdPack = require("../Middleware/uniqueId")
class User_level extends Model {}

User_level.init({
    id_user_level: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: function () {
            return uniqueIdPack.generateRandomId('_UserLevel')
        },
    },
    designation: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    created_at: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.NOW,
        allowNull: false,
    },
    updated_at: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.NOW,
        allowNull: false,
    },

}, {
    sequelize,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: "User_level",
    tableName: "User_level",
    logging: false,
});

module.exports = {
    User_level
};