const {
    Model,
    DataTypes
} = require("sequelize");

/**
 * //// Structure (Completed)
 * //// Connection (completed)
 */


//!About us page
const sequelize = require("../Database/connection");

// const UserModel = require("../Models/User")
const EntityModel = require("../Models/Entity")
const PictureModel = require("../Models/Picture")

class Entity_areas_focus extends Model {}

Entity_areas_focus.init({
    id_areas_focus: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,

    },
    description_pt: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description_eng: {
        type: DataTypes.STRING,
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

    //id_entity, id_publisher 

}, {
    sequelize,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: "Entity_Areas_focus",
    tableName: "Entity_Areas_focus",
    logging: false,
});


///Entity connection
EntityModel.Entity.hasMany(Entity_areas_focus, {
    foreignKey: {
        name: "id_entity",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Entity_areas_focus.belongsTo(EntityModel.Entity, {
    foreignKey: {
        name: "id_entity",
        type: DataTypes.STRING,
        allowNull: false
    }
});

//User connection
// UserModel.User.hasMany(Entity_areas_focus, {
//     foreignKey: {
//         name: "id_creator",
//         allowNull: false,
//         type: DataTypes.STRING,
//     }
// });
// Entity_areas_focus.belongsTo(UserModel.User, {
//     foreignKey: {
//         name: "id_creator",
//         type: DataTypes.STRING,
//         allowNull: false,
//     }
// });
//Picture connection
PictureModel.Picture.hasMany(Entity_areas_focus, {
    foreignKey: {
        name: "id_icon",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Entity_areas_focus.belongsTo(PictureModel.Picture, {
    foreignKey: {
        name: "id_icon",
        type: DataTypes.STRING,
        allowNull: false,
    }
});

module.exports = {
    Entity_areas_focus
};