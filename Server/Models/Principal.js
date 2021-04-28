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


class Principal extends Model {}

Principal.init({
    id_principal: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: function () {
            return uniqueIdPack.generateRandomId('_HiringTip')
        },
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


module.exports = {
    Principal
};