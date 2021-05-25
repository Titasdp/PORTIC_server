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

class Picture extends Model {}

Picture.init({
    id_picture: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    description_pt: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
        comment: "This field is optional and the user may or not add to this field information.",
    },
    description_eng: {
        type: DataTypes.TEXT('long'),
        allowNull: true,
        comment: "This field is optional and the user may or not add to this field information.",
    },
    img_path: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "this is the path to the imgs that is connected to the data, it can be an online url or and 'in server' path",
    },
    gallery_picture: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: 0,
        comment: "This field confirms if the imgs is to be showed in the gallery "
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
    modelName: "Picture",
    tableName: "Picture",
    logging: false,
});


module.exports = {
    Picture
};