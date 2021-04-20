const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");
const uniqueIdPack = require("../Middleware/uniqueId")
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

// // UserType Connection
// UserTitleModel.User_title.hasMany(User, {
//     foreignKey: {
//         name: "id_title",
//         allowNull: false,
//         type: DataTypes.STRING,
//     }
// });
// User.belongsTo(UserTitleModel.User_title, {
//     foreignKey: {
//         name: "id_user_type",
//         allowNull: false,
//         type: DataTypes.STRING,
//     }
// });
// // User Type
// UserStatusModel.User_status.hasMany(User, {
//     foreignKey: {
//         name: "id_login_type",
//         allowNull: false,
//         type: DataTypes.STRING,
//     }
// });
// User.belongsTo(UserStatusModel.User_status, {
//     foreignKey: {
//         name: "id_login_type",
//         allowNull: false,
//         type: DataTypes.STRING,
//     }
// });
// // User Status type
// UserLevelModel.User_level.hasMany(User, {
//     foreignKey: {
//         name: "id_user_status",
//         allowNull: false,
//         type: DataTypes.STRING,
//     }
// });
// User.belongsTo(UserLevelModel.User_level, {
//     foreignKey: {
//         name: "id_user_status",
//         type: DataTypes.STRING,
//         allowNull: false
//     }
// });

module.exports = {
    Entity
};