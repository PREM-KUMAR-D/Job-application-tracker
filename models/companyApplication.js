const Sequelize = require('sequelize');
const database = require('../util/database');

const CompanyApplications = database.define('companyApplications', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    companyId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'company', 
            key: 'id'
        }
    },
    applicationId: {
        type: Sequelize.INTEGER,
        references: {
            model: 'applications', 
            key: 'id'
        }
    }

});

module.exports = CompanyApplications;
