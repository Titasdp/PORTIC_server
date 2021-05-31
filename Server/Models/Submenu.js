const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");
// const uniqueIdPack = require("../Middleware/uniqueId")

const DataStatusModel = require("./DataStatus")
const MenuModel = require("./Menu")



class Submenu extends Model {}

Submenu.init({
    id_submenu: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
        // defaultValue: function () {
        //     return uniqueIdPack.generateRandomId('_Submenu')
        // },
    },
    designation_eng: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    designation_pt: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    external_path: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    info_html_pt: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
        // Just for not default pages
    },
    info_html_eng: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
        // Just for not default pages
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
    modelName: "Submenu",
    tableName: "Submenu",
    logging: false,
});


//Menu connection
MenuModel.Menu.hasMany(Submenu, {
    foreignKey: {
        name: "id_parent",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Submenu.belongsTo(MenuModel.Menu, {
    foreignKey: {
        name: "id_parent",
        type: DataTypes.STRING,
        allowNull: false,
    }
});


//DataStatus connection
DataStatusModel.Data_status.hasMany(Submenu, {
    foreignKey: {
        name: "id_status",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Submenu.belongsTo(DataStatusModel.Data_status, {
    foreignKey: {
        name: "id_status",
        allowNull: false,
        type: DataTypes.STRING,
    }
});


module.exports = {
    Submenu
};