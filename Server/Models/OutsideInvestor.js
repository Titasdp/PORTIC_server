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

class Outside_investor extends Model {}

Outside_investor.init({
    id_investor: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
        // defaultValue: function () {
        //     return uniqueIdPack.generateRandomId('_OutsideInvestor')
        // },
    },
    designation: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    page_url: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
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
    modelName: "Outside_investor",
    tableName: "Outside_investor",
    logging: false,
});


//User connection
UserModel.User.hasMany(Outside_investor, {
    foreignKey: {
        name: "id_publisher",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Outside_investor.belongsTo(UserModel.User, {
    foreignKey: {
        name: "id_publisher",
        type: DataTypes.STRING,
        allowNull: false,
    }
});



//User connection
ProjectModel.Project.hasMany(Outside_investor, {
    foreignKey: {
        name: "id_project",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Outside_investor.belongsTo(ProjectModel.Project, {
    foreignKey: {
        name: "id_project",
        type: DataTypes.STRING,
        allowNull: false,
    }
});



//Picture connection
PictureModel.Picture.hasMany(Outside_investor, {
    foreignKey: {
        name: "id_logo",
        allowNull: true,
        type: DataTypes.STRING,
    }
});
Outside_investor.belongsTo(PictureModel.Picture, {
    foreignKey: {
        name: "id_logo",
        type: DataTypes.STRING,
        allowNull: true,
    }
});





module.exports = {
    Outside_investor
};