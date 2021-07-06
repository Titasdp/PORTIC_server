const {
    Model,
    DataTypes
} = require("sequelize");
/**
 * //// Structure (Completed)
 * //// Connection (completed)
 */


//!Recruitment 

const sequelize = require("../Database/connection");

// const UserModel = require("../Models/User")
const EntityModel = require("../Models/Entity")

class Available_position extends Model {}

Available_position.init({
    id_available_position: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    designation_pt: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    designation_eng: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    desc_html_structure_pt: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
    },
    desc_html_structure_eng: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
    },
    category_1: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    category_2: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    category_3: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    pdf_path: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
    },
    candidacy_link: {
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

    //id_redirect_email, id_entity, id_publisher

}, {
    sequelize,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: "Available_position",
    tableName: "Available_position",
    logging: false,
});


///Entity connection
EntityModel.Entity.hasMany(Available_position, {
    foreignKey: {
        name: "id_entity",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Available_position.belongsTo(EntityModel.Entity, {
    foreignKey: {
        name: "id_entity",
        type: DataTypes.STRING,
        allowNull: false
    }
});

//User connection
// UserModel.User.hasMany(Available_position, {
//     foreignKey: {
//         name: "id_publisher",
//         allowNull: false,
//         type: DataTypes.STRING,
//     }
// });
// Available_position.belongsTo(UserModel.User, {
//     foreignKey: {
//         name: "id_publisher",
//         type: DataTypes.STRING,
//         allowNull: false,
//     }
// });

module.exports = {
    Available_position
};