const {
    Model,
    DataTypes
} = require("sequelize");

/**
 * //// Structure (Completed)
 * //// Connection (completed)
 */

const sequelize = require("../Database/connection");


// const UserModel = require("./User")
const EntityModel = require("./Entity")

class Area extends Model {}

Area.init({
    id_area: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
        // defaultValue: function () {
        //     return uniqueIdPack.generateRandomId('_Area')
        // },
    },
    designation_pt: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    designation_eng: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description_pt: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
    },
    description_eng: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
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

    //id_entity, id_publisher
}, {
    sequelize,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: "Area",
    tableName: "Area",
    logging: false,
});



///Entity connection
EntityModel.Entity.hasMany(Area, {
    foreignKey: {
        name: "id_entity",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Area.belongsTo(EntityModel.Entity, {
    foreignKey: {
        name: "id_entity",
        type: DataTypes.STRING,
        allowNull: false
    }
});

//User connection
// UserModel.User.hasMany(Area, {
//     foreignKey: {
//         name: "id_publisher",
//         allowNull: false,
//         type: DataTypes.STRING,
//     }
// });
// Area.belongsTo(UserModel.User, {
//     foreignKey: {
//         name: "id_publisher",
//         type: DataTypes.STRING,
//         allowNull: false,
//     }
// });

module.exports = {
    Area
};