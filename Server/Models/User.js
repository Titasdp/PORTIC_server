const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");
const uniqueIdPack = require("../Middleware/uniqueId")
const UserTitleModel = require("../Models/UserTitle")
const UserStatusModel = require("../Models/UserStatus")
const UserLevelModel = require("../Models/UserLevel")
class User extends Model {}

User.init({
    id_user: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: function () {
            return uniqueIdPack.generateRandomId('_User')
        },
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },

    full_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description_pt: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
        defaultValue: '',
    },

    description_eng: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
        defaultValue: '',
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phone_numb: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
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
    modelName: "User",
    tableName: "User",
    logging: false,
});

// UserType Connection
UserTitleModel.User_title.hasMany(User, {
    foreignKey: {
        name: "id_title",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
User.belongsTo(userTypeModel.UserType, {
    foreignKey: {
        name: "id_user_type",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
// Login type
loginTypeModel.LoginType.hasMany(User, {
    foreignKey: {
        name: "id_login_type",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
User.belongsTo(loginTypeModel.LoginType, {
    foreignKey: {
        name: "id_login_type",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
// User Status type
userStatusModel.UserStatus.hasMany(User, {
    foreignKey: {
        name: "id_user_status",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
User.belongsTo(userStatusModel.UserStatus, {
    foreignKey: {
        name: "id_user_status",
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = {
    User
};