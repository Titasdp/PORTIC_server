const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");
const uniqueIdPack = require("../Middleware/uniqueId")
class Page extends Model {}

Page.init({
    id_page: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: function () {
            return uniqueIdPack.generateRandomId('_Page')
        },
    },
    designation_eng: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    designation_pt: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    info_html_pt: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
        defaultValue: "<div></div>"
    },
    info_html_eng: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
        defaultValue: "<div></div>"
    },
    defaultPage: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: 0,
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
    modelName: "Page",
    tableName: "Page",
    logging: false,
});

module.exports = {
    Page
};