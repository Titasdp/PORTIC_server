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

class Page extends Model {}

Page.init({
    id_page: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: function () {
            return uniqueIdPack.generateRandomId('_PageInfo')
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
    info_html_pt: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
        defaultValue: "<div></div>"
    },
    info_html_eng: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
        defaultValue: "<div></div>"
    },
    default_page: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: 0,
    },
    spotlight_1: {
        type: DataTypes.TEXT('medium'),
        allowNull: true,
        defaultValue: null
    },
    spotlight_2: {
        type: DataTypes.TEXT('medium'),
        allowNull: true,
        defaultValue: null
    },
    page_description: {
        type: DataTypes.TEXT('medium'),
        allowNull: true,
        defaultValue: null,
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

    //id_entity, id_publisher, id_status

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
Testimonial.belongsTo(EntityModel.Entity, {
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



module.exports = {
    Page
};