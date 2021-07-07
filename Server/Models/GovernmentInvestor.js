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

// const UserModel = require("../Models/User")
// const EntityModel = require("../Models/Entity")
const ProjectModel = require("../Models/Project")
const PictureModel = require("../Models/Picture")

class Government_investor extends Model {}

Government_investor.init({
    id_investor: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
        // defaultValue: function () {
        //     return uniqueIdPack.generateRandomId('_OutsideInvestor')
        // },
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
    modelName: "Government_investor",
    tableName: "Government_investor",
    logging: false,
});


// //User connection
// UserModel.User.hasMany(Government_investor, {
//     foreignKey: {
//         name: "id_publisher",
//         allowNull: false,
//         type: DataTypes.STRING,
//     }
// });
// Government_investor.belongsTo(UserModel.User, {
//     foreignKey: {
//         name: "id_publisher",
//         type: DataTypes.STRING,
//         allowNull: false,
//     }
// });



//User connection
ProjectModel.Project.hasMany(Government_investor, {
    foreignKey: {
        name: "id_project",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Government_investor.belongsTo(ProjectModel.Project, {
    foreignKey: {
        name: "id_project",
        type: DataTypes.STRING,
        allowNull: false,
    }
});



//Picture connection
PictureModel.Picture.hasMany(Government_investor, {
    foreignKey: {
        name: "id_logo",
        allowNull: true,
        type: DataTypes.STRING,
    }
});
Government_investor.belongsTo(PictureModel.Picture, {
    foreignKey: {
        name: "id_logo",
        type: DataTypes.STRING,
        allowNull: true,
    }
});





module.exports = {
    Government_investor
};