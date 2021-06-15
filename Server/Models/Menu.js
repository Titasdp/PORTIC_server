const {
    Model,
    DataTypes
} = require("sequelize");

/**
 * //// Structure (Completed)
 * //// Connection (completed)
 */

const sequelize = require("../Database/connection");

const EntityModel = require("./Entity")
const DataStatusModel = require("./DataStatus")

class Menu extends Model {}

Menu.init({
    id_menu: {
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
    page_description_eng: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
    },
    page_description_pt: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
    },
    router_link: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    external_path: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    default: {
        type: DataTypes.INTEGER(1),
        defaultValue: 1,
        allowNull: false
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

    //id_status, id_entity,
}, {
    sequelize,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: "Menu",
    tableName: "Menu",
    logging: false,
});



///Entity connection
EntityModel.Entity.hasMany(Menu, {
    foreignKey: {
        name: "id_entity",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Menu.belongsTo(EntityModel.Entity, {
    foreignKey: {
        name: "id_entity",
        type: DataTypes.STRING,
        allowNull: false
    }
});


//DataStatus connection
DataStatusModel.Data_status.hasMany(Menu, {
    foreignKey: {
        name: "id_status",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Menu.belongsTo(DataStatusModel.Data_status, {
    foreignKey: {
        name: "id_status",
        allowNull: false,
        type: DataTypes.STRING,
    }
});

module.exports = {
    Menu
};