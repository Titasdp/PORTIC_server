const {
    Model,
    DataTypes,
    STRING
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
const PictureModel = require("../Models/Picture")

class News extends Model {}

News.init({
    id_news: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: function () {
            return uniqueIdPack.generateRandomId('_News')
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
    description_pt: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
    },
    description_eng: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
    },

    published_date: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "2021-01-01"
    },
    project_only: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: 0,
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


    // id_image, id_status, id_creator, id_entity
}, {
    sequelize,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: "News",
    tableName: "News",
    logging: false,
});

///Entity connection
EntityModel.Entity.hasMany(News, {
    foreignKey: {
        name: "id_entity",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
News.belongsTo(EntityModel.Entity, {
    foreignKey: {
        name: "id_entity",
        type: DataTypes.STRING,
        allowNull: false
    }
});

//User connection
UserModel.User.hasMany(News, {
    foreignKey: {
        name: "id_publisher",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
News.belongsTo(UserModel.User, {
    foreignKey: {
        name: "id_publisher",
        type: DataTypes.STRING,
        allowNull: false,
    }
});

//Picture connection
PictureModel.Picture.hasMany(News, {
    foreignKey: {
        name: "id_picture",
        allowNull: true,
        type: DataTypes.STRING,
    }
});
News.belongsTo(PictureModel.Picture, {
    foreignKey: {
        name: "id_picture",
        type: DataTypes.STRING,
        allowNull: true,
    }
});

//DataStatus connection
DataStatusModel.Data_status.hasMany(News, {
    foreignKey: {
        name: "id_status",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
News.belongsTo(DataStatusModel.Data_status, {
    foreignKey: {
        name: "id_status",
        allowNull: false,
        type: DataTypes.STRING,
    }
});


module.exports = {
    News
};