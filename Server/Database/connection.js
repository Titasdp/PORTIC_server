require("dotenv").config();
const response = require("express");
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
    .sync()
    .then(response => {
        console.log("Sequelize is working normally");
    })
    .catch(error => {
        console.log(error);
    });

module.exports = sequelize;