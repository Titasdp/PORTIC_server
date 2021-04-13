const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");
const uniqueIdPack = require("../Middleware/uniqueId")
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
    resume_eng: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    opened: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        comment: 'This field will increment every time a person press the button watch more of an video in the News'
    },
    resume_pt: {
        type: DataTypes.TEXT(),
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
    User
};