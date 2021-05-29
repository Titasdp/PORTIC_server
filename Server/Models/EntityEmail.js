const {
    Model,
    DataTypes
} = require("sequelize");
/**
 * //// Structure (Completed)
 * //// Connection (completed)
 */
const sequelize = require("../Database/connection");


const EntityModel = require("../Models/Entity")
const CommunicationLevelModel = require("../Models/CommunicationLevel")
const UserModel = require("../Models/User")

class Entity_email extends Model {}

Entity_email.init({
    id_email: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
        // defaultValue: function () {
        //     return uniqueIdPack.generateRandomId('_Email')
        // },
    },
    email: {
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

    //id_entity, id_communication level

}, {
    sequelize,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: "Entity_email",
    tableName: "Entity_email",
    logging: false,
});

//Entity connection
EntityModel.Entity.hasMany(Entity_email, {
    foreignKey: {
        name: "id_entity",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Entity_email.belongsTo(EntityModel.Entity, {
    foreignKey: {
        name: "id_entity",
        type: DataTypes.STRING,
        allowNull: false
    }
});

//User connection
UserModel.User.hasMany(Entity_email, {
    foreignKey: {
        name: "id_creator",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Entity_email.belongsTo(UserModel.User, {
    foreignKey: {
        name: "id_creator",
        type: DataTypes.STRING,
        allowNull: false,
    }
});

//Communication level connection
CommunicationLevelModel.Communication_level.hasMany(Entity_email, {
    foreignKey: {
        name: "id_communication_level",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Entity_email.belongsTo(CommunicationLevelModel.Communication_level, {
    foreignKey: {
        name: "id_communication_level",
        type: DataTypes.STRING,
        allowNull: false,
    }
});

module.exports = {
    Entity_email
};