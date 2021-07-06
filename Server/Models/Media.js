const {
    Model,
    DataTypes
} = require("sequelize");

/**
 * //// Structure (Completed)
 * //// Connection (completed)
 */

const sequelize = require("../Database/connection");


// const UserModel = require("../Models/User")
const EntityModel = require("../Models/Entity")
const DataStatusModel = require("../Models/DataStatus")


class Media extends Model {}

Media.init({
    id_media: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,

    },
    title_eng: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    title_pt: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description_eng: {
        type: DataTypes.TEXT('Long'),
        allowNull: false,
    },
    description_pt: {
        type: DataTypes.TEXT('Long'),
        allowNull: false
    },
    appearance_case: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: 3
    },
    youtube_path: {
        type: DataTypes.STRING,
        allowNull: false
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

    // Publisher, id_ entity, id_status
}, {
    sequelize,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: "Media",
    tableName: "Media",
    logging: false,
});
///Entity connection
EntityModel.Entity.hasMany(Media, {
    foreignKey: {
        name: "id_entity",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Media.belongsTo(EntityModel.Entity, {
    foreignKey: {
        name: "id_entity",
        type: DataTypes.STRING,
        allowNull: false
    }
});

//User connection
// UserModel.User.hasMany(Media, {
//     foreignKey: {
//         name: "id_publisher",
//         allowNull: false,
//         type: DataTypes.STRING,
//     }
// });
// Media.belongsTo(UserModel.User, {
//     foreignKey: {
//         name: "id_publisher",
//         type: DataTypes.STRING,
//         allowNull: false,
//     }
// });

//DataStatus connection
DataStatusModel.Data_status.hasMany(Media, {
    foreignKey: {
        name: "id_status",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Media.belongsTo(DataStatusModel.Data_status, {
    foreignKey: {
        name: "id_status",
        allowNull: false,
        type: DataTypes.STRING,
    }
});




module.exports = {
    Media
};