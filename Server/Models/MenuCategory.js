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

class Menu_category extends Model {}

Menu_category.init({
    id_menu_category: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: function () {
            return uniqueIdPack.generateRandomId('_MenuCat')
        },
    },
    designation_eng: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    designation_pt: {
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

    //id_status, id_creator, id_entity,
}, {
    sequelize,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: "Menu_category",
    tableName: "Menu_category",
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
        name: "id_creator",
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

//DataStatus connection
DataStatusModel.Data_status.hasMany(Menu_category, {
    foreignKey: {
        name: "id_status",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Menu_category.belongsTo(DataStatusModel.Data_status, {
    foreignKey: {
        name: "id_status",
        allowNull: false,
        type: DataTypes.STRING,
    }
});

module.exports = {
    Menu_category
};