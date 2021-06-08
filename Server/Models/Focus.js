const {
    Model,
    DataTypes
} = require("sequelize");

/**
 * //// Structure (Completed)
 * //// Connection (completed)
 */


//!About us page
const sequelize = require("../Database/connection");

const UserModel = require("../Models/User")
const EntityModel = require("../Models/Entity")

class Focus extends Model {}

Focus.init({
    id_focus: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,

    },
    description_pt: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description_eng: {
        type: DataTypes.STRING,
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

    //id_entity, id_publisher 

}, {
    sequelize,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: "Focus",
    tableName: "Focus",
    logging: false,
});


///Entity connection
EntityModel.Entity.hasMany(Focus, {
    foreignKey: {
        name: "id_entity",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Focus.belongsTo(EntityModel.Entity, {
    foreignKey: {
        name: "id_entity",
        type: DataTypes.STRING,
        allowNull: false
    }
});

//User connection
UserModel.User.hasMany(Focus, {
    foreignKey: {
        name: "id_creator",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Focus.belongsTo(UserModel.User, {
    foreignKey: {
        name: "id_creator",
        type: DataTypes.STRING,
        allowNull: false,
    }
});

module.exports = {
    Focus
};