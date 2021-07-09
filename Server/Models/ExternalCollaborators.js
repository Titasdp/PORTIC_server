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
// const EntityModel = require("../Models/Entity")
const ProjectModel = require("../Models/Project")
const PictureModel = require("../Models/Picture")

class External_collaborator extends Model {}

External_collaborator.init({
    id_collaborator: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
        // defaultValue: function () {
        //     return uniqueIdPack.generateRandomId('_ExternalCollaborator')
        // },
    },
    full_name: {
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

    //id_logo, id_publisher, id_status

}, {
    sequelize,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: "External_collaborator",
    tableName: "External_collaborator",
    logging: false,
});





//User connection
ProjectModel.Project.hasMany(External_collaborator, {
    foreignKey: {
        name: "id_project",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
External_collaborator.belongsTo(ProjectModel.Project, {
    foreignKey: {
        name: "id_project",
        type: DataTypes.STRING,
        allowNull: false,
    }
});



//Picture connection
PictureModel.Picture.hasMany(External_collaborator, {
    foreignKey: {
        name: "id_picture",
        allowNull: true,
        type: DataTypes.STRING,
    }
});
External_collaborator.belongsTo(PictureModel.Picture, {
    foreignKey: {
        name: "id_picture",
        type: DataTypes.STRING,
        allowNull: true,
    }
});





module.exports = {
    External_collaborator
};