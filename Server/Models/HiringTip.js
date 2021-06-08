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


class Hiring_tip extends Model {}

Hiring_tip.init({
    id_hiring_tip: {
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
    modelName: "Hiring_tip",
    tableName: "Hiring_tip",
    logging: false,
});
///Entity connection
EntityModel.Entity.hasMany(Hiring_tip, {
    foreignKey: {
        name: "id_entity",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Hiring_tip.belongsTo(EntityModel.Entity, {
    foreignKey: {
        name: "id_entity",
        allowNull: false,
        type: DataTypes.STRING,
    }
});

//User Connection
UserModel.User.hasMany(Hiring_tip, {
    foreignKey: {
        name: "id_creator",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Hiring_tip.belongsTo(UserModel.User, {
    foreignKey: {
        name: "id_creator",
        type: DataTypes.STRING,
        allowNull: false,
    }
});


module.exports = {
    Hiring_tip
};