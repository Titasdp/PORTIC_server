const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");
const uniqueIdPack = require("../Middleware/uniqueId")
class Entity_contact extends Model {}

Entity_contact.init({
    id_contact: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: function () {
            return uniqueIdPack.generateRandomId('_Contact')
        },
    },
    number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
    description_pt: {
        type: DataTypes.TEXT('medium'),
        allowNull: true,
        defaultValue: "Não há informações adicionais relacionadas a este contato",
    },
    description_eng: {
        type: DataTypes.TEXT('medium'),
        allowNull: true,
        defaultValue: "There is no additional information related to this contact",
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