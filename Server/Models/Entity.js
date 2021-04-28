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

const EntityLevelModel = require("../Models/EntityLevel")
const DataStatusModel = require("../Models/DataStatus")
const PictureModel = require("../Models/Picture")

class Entity extends Model {}

Entity.init({
    id_entity: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: function () {
            return uniqueIdPack.generateRandomId('_Entity')
        },
    },
    designation: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    initials: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    desc_html_pt: {
        type: DataTypes.TEXT('Long'),
        allowNull: false,
    },
    desc_html_eng: {
        type: DataTypes.TEXT('Long'),
        allowNull: false
    },
    slogan_eng: {
        type: DataTypes.TEXT('tiny'),
        allowNull: false,
    },
    slogan_pt: {
        type: DataTypes.TEXT('tiny'),
        allowNull: false,
    },
    visited: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        comment: 'This field will increment every time a person Visits and sub entity'
    },
    lat: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 41.1768200254591,
    },
    long: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: -8.60569453069293,
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

    // logo_id, id_ entity_level, id_status
}, {
    sequelize,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: "Entity",
    tableName: "Entity",
    logging: false,
});

//Entity level connection
EntityLevelModel.Entity_level.hasMany(Entity, {
    foreignKey: {
        name: "id_entity",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Entity.belongsTo(EntityLevelModel.Entity_level, {
    foreignKey: {
        name: "id_entity",
        type: DataTypes.STRING,
        allowNull: false
    }
});

//Picture connection
PictureModel.Picture.hasMany(Entity, {
    foreignKey: {
        name: "id_logo",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Entity.belongsTo(PictureModel.Picture, {
    foreignKey: {
        name: "id_logo",
        type: DataTypes.STRING,
        allowNull: false,
    }
});

//DataStatus connection
DataStatusModel.Data_status.hasMany(Entity, {
    foreignKey: {
        name: "id_status",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Entity.belongsTo(DataStatusModel.Data_status, {
    foreignKey: {
        name: "id_status",
        allowNull: false,
        type: DataTypes.STRING,
    }
});



module.exports = {
    Entity
};