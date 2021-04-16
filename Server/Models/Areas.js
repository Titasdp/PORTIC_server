const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");
const uniqueIdPack = require("../Middleware/uniqueId")
class Area extends Model {}

Area.init({
    id_area: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: function () {
            return uniqueIdPack.generateRandomId('_Area')
        },
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

module.exports = {
    Area
};