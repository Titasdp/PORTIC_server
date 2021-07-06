const {
    Model,
    DataTypes
} = require("sequelize");
/**
 * //// Structure (Completed)
 * //// Connection (completed)
 */
const sequelize = require("../Database/connection");

const UserModel = require("../Models/User")
const EntityModel = require("../Models/Entity")
const DataStatusModel = require("../Models/DataStatus")

class Course extends Model {}

Course.init({
    id_course: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
        // defaultValue: function () {
        //     return uniqueIdPack.generateRandomId('_Course')
        // },
    },
    designation: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    html_structure_eng: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
    },
    html_structure_pt: {
        type: DataTypes.TEXT('long'),
        allowNull: false,
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

///Entity connection
EntityModel.Entity.hasMany(Course, {
    foreignKey: {
        name: "id_entity",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Course.belongsTo(EntityModel.Entity, {
    foreignKey: {
        name: "id_entity",
        type: DataTypes.STRING,
        allowNull: false
    }
});

//User connection
UserModel.User.hasMany(Course, {
    foreignKey: {
        name: "id_coordinator",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Course.belongsTo(UserModel.User, {
    foreignKey: {
        name: "id_coordinator",
        type: DataTypes.STRING,
        allowNull: false,
    }
});
// id_publisher

//DataStatus connection
DataStatusModel.Data_status.hasMany(Course, {
    foreignKey: {
        name: "id_status",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Course.belongsTo(DataStatusModel.Data_status, {
    foreignKey: {
        name: "id_status",
        allowNull: false,
        type: DataTypes.STRING,
    }
});

module.exports = {
    Course
};