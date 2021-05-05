const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");
class User_title extends Model {}

User_title.init({
    id_title: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    designation_pt: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    designation_eng: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
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
    modelName: "User_title",
    tableName: "User_title",
    logging: false,
});

module.exports = {
    User_title
};