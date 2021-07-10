const {
    Model,
    DataTypes
} = require("sequelize");
/**
 * //// Structure (Completed)
 * //// Connection (completed)
 */
const sequelize = require("../Database/connection");

const EntityLevelModel = require("../Models/EntityLevel")
const DataStatusModel = require("../Models/DataStatus")
const PictureModel = require("../Models/Picture")

class Entity extends Model {}

Entity.init({
    id_entity: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
        // return uniqueIdPack.generateRandomId('_Entity')
    },

    designation: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    initials: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    desc_html_pt: {
        type: DataTypes.TEXT('Long'),
        allowNull: false,
    },
    desc_html_eng: {
        type: DataTypes.TEXT('Long'),
        allowNull: false
    },
    slogan_eng: {
        type: DataTypes.TEXT('tiny'),
        allowNull: false,
    },
    slogan_pt: {
        type: DataTypes.TEXT('tiny'),
        allowNull: false,
    },
    visited: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        comment: 'This field will increment every time a person Visits and sub entity'
    },
    postal_code: {
        type: DataTypes.STRING,
        defaultValue: "4200-375 Porto",
        allowNull: false,
    },
    street: {
        type: DataTypes.STRING,
        defaultValue: "Rua Arquitecto Lobão Vital, 172",
        allowNull: false
    },
    lat: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 41.1768200254591,
    },
    long: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: -8.60569453069293,
    },


    hightLight_1_id: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
        comment: "highlight it can be a news,project etc id"
    },
    hightLight_2_id: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
        comment: "highlight it can be a news,project etc id"

    },
    hightLight_3_id: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
        comment: "highlight it can be a news,project etc id"
    },
    colors: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: `[#ffff,#C94D24,#080808]`
    },
    main_email: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: `portic@portic.ipp.pt`
    },
    secondary_email: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: `communication@portic.ipp.pt`
    },
    main_contact: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: `(+351) 22 557 1020`
    },
    linkedIn: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: `https://www.linkedin.com/company/portic-pporto`
    },
    facebook: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: `https://www.facebook.com/porticpporto`
    },
    instagram: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: `https://www.instagram.com/politecnicodoporto/`
    },
    youtube: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: `https://www.youtube.com/channel/UCa0njrkoyEd8kwjIVPE5pNg`
    },
    twitter: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: `https://twitter.com/politecnico`
    },


    optional_course_menu: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: 1,
        //
    },
    optional_project_menu: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: 1,
        //

    },
    optional_recruitment_menu: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: 1,
        //
    },
    optional_media_menu: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: 1,
        //
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

    // logo_id, id_ entity_level, id_status
}, {
    sequelize,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: "Entity",
    tableName: "Entity",
    logging: false,
});

//Entity level connection
EntityLevelModel.Entity_level.hasMany(Entity, {
    foreignKey: {
        name: "id_entity_level",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Entity.belongsTo(EntityLevelModel.Entity_level, {
    foreignKey: {
        name: "id_entity_level",
        type: DataTypes.STRING,
        allowNull: false
    }
});

//Picture connection
PictureModel.Picture.hasMany(Entity, {
    foreignKey: {
        name: "id_logo",
        allowNull: true,
        type: DataTypes.STRING,
    }
});
Entity.belongsTo(PictureModel.Picture, {
    foreignKey: {
        name: "id_logo",
        type: DataTypes.STRING,
        allowNull: true,
    }
});

//DataStatus connection
DataStatusModel.Data_status.hasMany(Entity, {
    foreignKey: {
        name: "id_status",
        allowNull: false,
        type: DataTypes.STRING,
    }
});
Entity.belongsTo(DataStatusModel.Data_status, {
    foreignKey: {
        name: "id_status",
        allowNull: false,
        type: DataTypes.STRING,
    }
});



module.exports = {
    Entity
};