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
const UserModel = require("../Models/User")


class Principal extends Model {}

Principal.init({
    id_principal: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,

    },
    title_eng: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title_pt: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description_eng: {
        type: DataTypes.TEXT('tiny'),
        allowNull: false,
    },
    description_pt: {
        type: DataTypes.TEXT('tiny'),
        allowNull: false
    },
}, {
    sequelize,
    timestamps: false,
    modelName: "Principal",
    tableName: "Principal",
    logging: false,
});
///Entity connection
EntityModel.Entity.hasMany(Principal, {
    foreignKey: {
        name: "id_entity",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Principal.belongsTo(EntityModel.Entity, {
    foreignKey: {
        name: "id_entity",
        allowNull: false,
        type: DataTypes.STRING,
    }
});

UserModel.User.hasMany(Principal, {
    foreignKey: {
        name: "id_creator",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Principal.belongsTo(UserModel.User, {
    foreignKey: {
        name: "id_creator",
        type: DataTypes.STRING,
        allowNull: false,
    }
});


module.exports = {
    Principal
};