const {
    Model,
    DataTypes
} = require("sequelize");
const sequelize = require("../Database/connection");
const uniqueIdPack = require("../Middleware/uniqueId")
class Course extends Model {}

Course.init({
    id_course: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: function () {
            return uniqueIdPack.generateRandomId('_Course')
        },
    },
    html_structure: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
        defaultValue: "<div></div>"
    },
    candidacy_link: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
        comment: "URL to the page where the person can make the candidacy for the course."

    },
    pdf_url: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
        comment: "URL with an PDF that contains additional information related to the course"
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

    //id_entity, id_publisher, id_status

}, {
    sequelize,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: "Course",
    tableName: "Course",
    logging: false,
});

module.exports = {
    Course
};