const {
    Model,
    DataTypes
} = require("sequelize");
/**
 * //// Structure (Completed)
 * //// Connection (completed)
 */
const sequelize = require("../Database/connection");


const UserModel = require("../Models/User")
const EntityModel = require("../Models/Entity")
const DataStatusModel = require("../Models/DataStatus")

class Project extends Model {}

Project.init({
    id_project: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
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
        allowNull: true,
        defaultValue: null
    },
    summary_pt: {
        type: DataTypes.STRING,
        allowNull: false
    },
    summary_eng: {
        type: DataTypes.STRING,
        allowNull: false
    },
    desc_html_structure_eng: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
    },
    desc_html_structure_pt: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
    },
    start_date: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    end_date: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    project_contact: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    project_email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    pdf_path: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
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
        name: "id_coordinator",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Project.belongsTo(UserModel.User, {
    foreignKey: {
        name: "id_coordinator",
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