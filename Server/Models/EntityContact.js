const {
    Model,
    DataTypes
} = require("sequelize");
/**
 * //// Structure (Completed)
 * //// Connection (completed)
 */
const sequelize = require("../Database/connection");
const uniqueIdPack = require("../Middleware/uniqueId")

const EntityModel = require("../Models/Entity")
const CommunicationLevelModel = require("../Models/CommunicationLevel")
const UserModel = require("../Models/User")



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

}, {
    sequelize,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: "Entity_contact",
    tableName: "Entity_contact",
    logging: false,
});


//Entity connection
EntityModel.Entity.hasMany(Entity_contact, {
    foreignKey: {
        name: "id_entity",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Entity_contact.belongsTo(EntityModel.Entity, {
    foreignKey: {
        name: "id_entity",
        type: DataTypes.STRING,
        allowNull: false
    }
});

//User connection
UserModel.User.hasMany(Entity_contact, {
    foreignKey: {
        name: "id_creator",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Entity_contact.belongsTo(UserModel.User, {
    foreignKey: {
        name: "id_creator",
        type: DataTypes.STRING,
        allowNull: false,
    }
});

//Communication level connection
CommunicationLevelModel.Communication_level.hasMany(Entity_contact, {
    foreignKey: {
        name: "id_communication_level",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Entity_contact.belongsTo(CommunicationLevelModel.Communication_level, {
    foreignKey: {
        name: "id_communication_level",
        type: DataTypes.STRING,
        allowNull: false,
    }
});

module.exports = {
    Entity_contact
};