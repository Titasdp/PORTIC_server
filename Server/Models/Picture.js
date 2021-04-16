const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");
const uniqueIdPack = require("../Middleware/uniqueId")
class Picture extends Model {}

Picture.init({
    id_picture: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: function () {
            return uniqueIdPack.generateRandomId('_Picture')
        },
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

    //id_publisher,

}, {
    sequelize,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: "Outside_investor",
    tableName: "Outside_investor",
    logging: false,
});

module.exports = {
    Outside_investor
};