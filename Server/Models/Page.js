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



const MenuModel = require("./Menu")
const SubmenuModel = require("./Submenu")
const UserModel = require("../Models/User")
const EntityModel = require("../Models/Entity")
const DataStatusModel = require("../Models/DataStatus")

class Page extends Model {}

Page.init({
    id_page: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    designation_eng: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    designation_pt: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    info_html_pt: {
        type: DataTypes.TEXT('long'),
        allowNull: true,

    },
    info_html_eng: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
    },
    default_page: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: 1,
    },
    spotlight_1: {
        type: DataTypes.TEXT('medium'),
        allowNull: true,
    },
    spotlight_2: {
        type: DataTypes.TEXT('medium'),
        allowNull: true,
    },
    page_description: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
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
    modelName: "Page",
    tableName: "Page",
    logging: false,
});


//User connection
UserModel.User.hasMany(Page, {
    foreignKey: {
        name: "id_creator",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Page.belongsTo(UserModel.User, {
    foreignKey: {
        name: "id_creator",
        type: DataTypes.STRING,
        allowNull: false
    }
});
//Entity connection
EntityModel.Entity.hasMany(Page, {
    foreignKey: {
        name: "id_entity",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Page.belongsTo(EntityModel.Entity, {
    foreignKey: {
        name: "id_entity",
        type: DataTypes.STRING,
        allowNull: false
    }
});

//DataStatus connection
DataStatusModel.Data_status.hasMany(Page, {
    foreignKey: {
        name: "id_status",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Page.belongsTo(DataStatusModel.Data_status, {
    foreignKey: {
        name: "id_status",
        allowNull: false,
        type: DataTypes.STRING,
    }
});

//Menu
MenuModel.Menu.hasMany(Page, {
    foreignKey: {
        name: "id_menu",
        allowNull: true,
        type: DataTypes.STRING,
    }
});
Page.belongsTo(MenuModel.Menu, {
    foreignKey: {
        name: "id_menu",
        allowNull: true,
        type: DataTypes.STRING,
    }
});

//Submenu 
SubmenuModel.Submenu.hasMany(Page, {
    foreignKey: {
        name: "id_submenu",
        allowNull: true,
        type: DataTypes.STRING,
    }
});
Page.belongsTo(MenuModel.Menu, {
    foreignKey: {
        name: "id_submenu",
        allowNull: true,
        type: DataTypes.STRING,
    }
});






module.exports = {
    Page
};