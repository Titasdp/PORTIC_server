const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");
const uniqueIdPack = require("../Middleware/uniqueId")

class Entity_email extends Model {}

Entity_email.init({
    id_email: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: function () {
            return uniqueIdPack.generateRandomId('_Email')
        },
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description_pt: {
        type: DataTypes.TEXT('medium'),
        allowNull: true,
        defaultValue: "Não há informações adicionais relacionadas a este email",
    },
    description_eng: {
        type: DataTypes.TEXT('medium'),
        allowNull: true,
        defaultValue: "There is no additional information related to this email",
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

    //id_entity, id_communication level

}, {
    sequelize,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: "Entity_contact",
    tableName: "Entity_contact",
    logging: false,
});

module.exports = {
    Entity_contact
};