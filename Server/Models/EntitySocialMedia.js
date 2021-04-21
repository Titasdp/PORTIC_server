const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");

const SocialMediaTypeModel = require("../Models/SocialMediaType");
const EntityModel = require("../Models/Entity");

class Entity_social_media extends Model {}

Entity_social_media.init({
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
    modelName: "Entity_social_media",
    tableName: "Entity_social_media",
    timestamps: true,
});

SocialMediaTypeModel.Social_media_type.belongsToMany(EntityModel.Entity, {
    through: Project_entity,
    foreignKey: {
        name: "id_social_media",
        primaryKey: true,
        unique: false,
        allowNull: false
    }
});
EntityModel.Entity.belongsToMany(SocialMediaTypeModel.Social_media_type, {
    through: Project_entity,
    foreignKey: {
        name: "id_entity",
        primaryKey: true,
        unique: false,
        allowNull: false
    }
});

module.exports = {
    Entity_social_media
};