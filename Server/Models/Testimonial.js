const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");
const uniqueIdPack = require("../Middleware/uniqueId")
class Testimonial extends Model {}

Testimonial.init({
    id_testimonial: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: function () {
            return uniqueIdPack.generateRandomId('_Testimonial')
        },
    },
    person_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    institution_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    testimonial_text_pt: {
        type: DataTypes.TEXT('medium'),
        allowNull: false,
    },
    testimonial_text_eng: {
        type: DataTypes.TEXT('medium'),
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
    modelName: "Testimonial",
    tableName: "Testimonial",
    logging: false,
});

module.exports = {
    Testimonial
};