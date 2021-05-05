const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");
/**
 * //// Structure (Completed)
 * doesn't need other tables primary keys (completed)
 */
class Category extends Model {}

Category.init({
    id_category: {
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
    modelName: "Category",
    tableName: "Category",
    logging: false,
});

module.exports = {
    Category
};