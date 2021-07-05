const {
    Model,
    DataTypes
} = require("sequelize");

/**
 * ///// Structure (Completed)
 * ////Connection (completed)
 */

const sequelize = require("../Database/connection");
const uniqueIdPack = require("../Middleware/uniqueId")
const UserTitleModel = require("../Models/UserTitle")
const UserStatusModel = require("../Models/UserStatus")
const UserLevelModel = require("../Models/UserLevel")
const EntityModel = require("../Models/Entity")
const PictureModel = require("../Models/Picture")

class User extends Model {}

User.init({
    id_user: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,

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
    post: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    linkedIn_url: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },

    //id_entity , id_profile_pic
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

// User Title Connection
UserTitleModel.User_title.hasMany(User, {
    foreignKey: {
        name: "id_title",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
User.belongsTo(UserTitleModel.User_title, {
    foreignKey: {
        name: "id_title",
        allowNull: false,
        type: DataTypes.STRING,
    }
});

// User Status connection
UserStatusModel.User_status.hasMany(User, {
    foreignKey: {
        name: "id_status",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
User.belongsTo(UserStatusModel.User_status, {
    foreignKey: {
        name: "id_status",
        allowNull: false,
        type: DataTypes.STRING,
    }
});

// User Level connection
UserLevelModel.User_level.hasMany(User, {
    foreignKey: {
        name: "id_user_level",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
User.belongsTo(UserLevelModel.User_level, {
    foreignKey: {
        name: "id_user_level",
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Entity connection
EntityModel.Entity.hasMany(User, {
    foreignKey: {
        name: "id_entity",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
User.belongsTo(EntityModel.Entity, {
    foreignKey: {
        name: "id_entity",
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Picture connection
PictureModel.Picture.hasMany(User, {
    foreignKey: {
        name: "id_picture",
        allowNull: true,
        type: DataTypes.STRING,
    }
});
User.belongsTo(PictureModel.Picture, {
    foreignKey: {
        name: "id_picture",
        allowNull: true,
        type: DataTypes.STRING,
    }
});



module.exports = {
    User
};