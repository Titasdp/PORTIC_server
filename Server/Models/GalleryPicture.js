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
const PictureModel = require("../Models/Picture")

class Gallery_picture extends Model {}

Gallery_picture.init({
    id_gallery_data: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: function () {
            return uniqueIdPack.generateRandomId('_GalleryPicture')
        },
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
    modelName: "Gallery_picture",
    tableName: "Gallery_picture",
    logging: false,
});

///Entity connection
EntityModel.Entity.hasMany(Gallery_picture, {
    foreignKey: {
        name: "id_entity",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Gallery_picture.belongsTo(EntityModel.Entity, {
    foreignKey: {
        name: "id_entity",
        type: DataTypes.STRING,
        allowNull: false
    }
});

//User connection
UserModel.User.hasMany(Gallery_picture, {
    foreignKey: {
        name: "id_publisher",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Gallery_picture.belongsTo(UserModel.User, {
    foreignKey: {
        name: "id_publisher",
        type: DataTypes.STRING,
        allowNull: false,
    }
});

//Picture connection
PictureModel.Picture.hasMany(Gallery_picture, {
    foreignKey: {
        name: "id_picture",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Gallery_picture.belongsTo(PictureModel.Picture, {
    foreignKey: {
        name: "id_picture",
        type: DataTypes.STRING,
        allowNull: false,
    }
});

module.exports = {
    Gallery_picture
};