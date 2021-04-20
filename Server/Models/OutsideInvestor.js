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
const PictureModel = require("../Models/Picture")

class Outside_investor extends Model {}

Outside_investor.init({
    id_investor: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: function () {
            return uniqueIdPack.generateRandomId('_OutsideInvestor')
        },
    },
    designation: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    page_url: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "No URL link",
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


//Entity connection
EntityModel.Entity.hasMany(Page, {
    foreignKey: {
        name: "id_entity",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Testimonial.belongsTo(EntityModel.Entity, {
    foreignKey: {
        name: "id_entity",
        type: DataTypes.STRING,
        allowNull: false
    }
});

//User connection
UserModel.User.hasMany(Outside_investor, {
    foreignKey: {
        name: "id_creator",
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


//Picture connection
PictureModel.Picture.hasMany(Outside_investor, {
    foreignKey: {
        name: "id_logo",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Outside_investor.belongsTo(PictureModel.Picture, {
    foreignKey: {
        name: "id_logo",
        type: DataTypes.STRING,
        allowNull: false,
    }
});



//DataStatus connection
DataStatusModel.Data_status.hasMany(Outside_investor, {
    foreignKey: {
        name: "id_status",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Outside_investor.belongsTo(DataStatusModel.Data_status, {
    foreignKey: {
        name: "id_status",
        allowNull: false,
        type: DataTypes.STRING,
    }
});




module.exports = {
    Outside_investor
};