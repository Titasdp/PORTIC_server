const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");
const uniqueIdPack = require("../Middleware/uniqueId")
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

module.exports = {
    Outside_investor
};