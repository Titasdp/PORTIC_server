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

const UserModel = require("../Models/User")
const EntityModel = require("../Models/Entity")
const DataStatusModel = require("../Models/DataStatus")

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


    // id_publisher, id_entity

}, {
    sequelize,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: "Testimonial",
    tableName: "Testimonial",
    logging: false,
});

//User connection
UserModel.User.hasMany(Testimonial, {
    foreignKey: {
        name: "id_creator",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Testimonial.belongsTo(UserModel.User, {
    foreignKey: {
        name: "id_creator",
        type: DataTypes.STRING,
        allowNull: false
    }
});
//Entity connection
EntityModel.Entity.hasMany(Testimonial, {
    foreignKey: {
        name: "id_entity",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Testimonial.belongsTo(EntityModel.Entity, {
    foreignKey: {
        name: "id_entity",
        type: DataTypes.STRING,
        allowNull: false
    }
});


module.exports = {
    Testimonial
};