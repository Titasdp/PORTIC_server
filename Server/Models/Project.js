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

class Project extends Model {}

Outside_investor.init({
    id_project: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: function () {
            return uniqueIdPack.generateRandomId('_Project')
        },
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    initials: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    reference: {
        type: DataTypes.STRING,
        allowNull: false
    },
    desc_html_structure_eng: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
        defaultValue: "<div></div>"
    },
    desc_html_structure_pt: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
        defaultValue: "<div></div>"
    },
    total_budget: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    PORTIC_budget_cut: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
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
    modelName: "Project",
    tableName: "Project",
    logging: false,
});


//Entity connection
EntityModel.Entity.hasMany(Project, {
    foreignKey: {
        name: "id_leader_entity",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Project.belongsTo(EntityModel.Entity, {
    foreignKey: {
        name: "id_leader_entity",
        type: DataTypes.STRING,
        allowNull: false
    }
});

//User connection
UserModel.User.hasMany(Project, {
    foreignKey: {
        name: "id_creator",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Project.belongsTo(UserModel.User, {
    foreignKey: {
        name: "id_creator",
        type: DataTypes.STRING,
        allowNull: false,
    }
});

//DataStatus connection
DataStatusModel.Data_status.hasMany(Project, {
    foreignKey: {
        name: "id_status",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Project.belongsTo(DataStatusModel.Data_status, {
    foreignKey: {
        name: "id_status",
        allowNull: false,
        type: DataTypes.STRING,
    }
});

module.exports = {
    Project
};