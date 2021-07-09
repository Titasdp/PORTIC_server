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

// const UserModel = require("../Models/User")
const EntityModel = require("../Models/Entity")
const PictureModel = require("../Models/Picture")

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
        allowNull: true,
        unique: false
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

//User connection
// UserModel.User.hasMany(Testimonial, {
//     foreignKey: {
//         name: "id_creator",
//         allowNull: false,
//         type: DataTypes.STRING,
//     }
// });
// Testimonial.belongsTo(UserModel.User, {
//     foreignKey: {
//         name: "id_creator",
//         type: DataTypes.STRING,
//         allowNull: false
//     }
// });
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

//Picture connection
PictureModel.Picture.hasMany(Testimonial, {
    foreignKey: {
        name: "id_picture",
        allowNull: true,
        type: DataTypes.STRING,
    }
});
Testimonial.belongsTo(PictureModel.Picture, {
    foreignKey: {
        name: "id_picture",
        type: DataTypes.STRING,
        allowNull: true,
    }
});


module.exports = {
    Testimonial
};