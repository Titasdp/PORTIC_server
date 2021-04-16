const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");
const uniqueIdPack = require("../Middleware/uniqueId")
class Available_position extends Model {}

Available_position.init({
    id_available_position: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: function () {
            return uniqueIdPack.generateRandomId('_AvailablePos')
        },
    },
    desc_html_structure_pt: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
        defaultValue: "<div></div>"
    },
    desc_html_structure_eng: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
        defaultValue: "<div></div>"
    },
    pdf_path: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: false,
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

module.exports = {
    Outside_investor
};