const {
    Model,
    DataTypes
} = require("sequelize");

/**
 * //// Structure (Completed)
 * //// Connection (completed)
 */
const sequelize = require("../Database/connection");


const EntityModel = require("../Models/Entity")
const PictureModel = require("../Models/Picture")
// const UserModel = require("../Models/User")
const DataStatusModel = require("../Models/DataStatus")

class Unity extends Model {}

Unity.init({
    id_unity: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    designation: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description_pt: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
    },
    description_eng: {
        type: DataTypes.TEXT('long'),
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

    //id_photo, id_publisher, id_entity, id_status
}, {
    sequelize,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: "Unity",
    tableName: "Unity",
    logging: false,
});

// Picture connection
PictureModel.Picture.hasMany(Unity, {
    foreignKey: {
        name: "id_photo",
        allowNull: true,
        type: DataTypes.STRING,
    }
});
Unity.belongsTo(PictureModel.Picture, {
    foreignKey: {
        name: "id_photo",
        type: DataTypes.STRING,
        allowNull: true
    }
});

// //User connection
// UserModel.User.hasMany(Unity, {
//     foreignKey: {
//         name: "id_creator",
//         allowNull: false,
//         type: DataTypes.STRING,
//     }
// });
// Unity.belongsTo(UserModel.User, {
//     foreignKey: {
//         name: "id_creator",
//         type: DataTypes.STRING,
//         allowNull: false
//     }
// });

//Entity connection
EntityModel.Entity.hasMany(Unity, {
    foreignKey: {
        name: "id_entity",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Unity.belongsTo(EntityModel.Entity, {
    foreignKey: {
        name: "id_entity",
        type: DataTypes.STRING,
        allowNull: false
    }
});

//DataStatus connection
DataStatusModel.Data_status.hasMany(Unity, {
    foreignKey: {
        name: "id_status",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Unity.belongsTo(DataStatusModel.Data_status, {
    foreignKey: {
        name: "id_status",
        allowNull: false,
        type: DataTypes.STRING,
    }
});

module.exports = {
    Unity
};