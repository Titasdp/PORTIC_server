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


class Hiring_tip extends Model {}

Hiring_tip.init({
    id_hiring_tip: {
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


module.exports = {
    Hiring_tip
};