const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");
const uniqueIdPack = require("../Middleware/uniqueId")
class Unity extends Model {}

Unity.init({
    id_unity: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: function () {
            return uniqueIdPack.generateRandomId('_Unity')
        },
    },
    designation: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description_pt: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
    },
    description_eng: {
        type: DataTypes.TEXT('long'),
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

    //id_photo, id_publisher, id_entity, id_status

}, {
    sequelize,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: "Unity",
    tableName: "Unity",
    logging: false,
});

module.exports = {
    Unity
};