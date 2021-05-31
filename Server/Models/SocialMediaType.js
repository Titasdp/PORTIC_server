const {
    Model,
    DataTypes
} = require("sequelize");
/**
 * //// Structure (Completed)
 * doesn't need other tables primary keys (completed)
 */

const sequelize = require("../Database/connection");

class Social_media_type extends Model {}

Social_media_type.init({
    id_type: {
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
    modelName: "Social_media_type",
    tableName: "Social_media_type",
    logging: false,
});

module.exports = {
    Social_media_type
};