require("dotenv").config();
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    `${process.env.DB_DESIGNATION}`,
    `${process.env.DB_USERNAME}`,
    `${process.env.DB_PASSWORD}`, {
        host: `${process.env.DB_HOST}`,
        port: `${process.env.DB_PORT}`,
        dialect: `${process.env.DB_DIALECT}`,
        logging: false,
        define: {
            timestamps: true
        }
    }
);

sequelize
    .sync(data => {
        console.log("something");;
    })
    .then(response => {
        console.log("Sequelize is working normally");
    })
    .catch(error => {
        console.log(error);
    });

module.exports = sequelize;


// DB_DESIGNATION=nunops_moitascars
// DB_USERNAME=nunops_titas
// DB_PASSWORD=PVk5]#;iZZRu
// DB_HOST=nunops.com
// DB_PORT=3306
// DB_DIALECT=mysql
// SECRET=mySecret