const Sequelize = require('sequelize');

const database = require('../util/database');

const  Profile = database.define('profile',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name:{
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    }, 
        
    resumeLink : Sequelize.TEXT,
    carrerGoals: Sequelize.TEXT
});

module.exports = Profile;