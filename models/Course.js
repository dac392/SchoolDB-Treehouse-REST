'use strict'

const {Model, Sequelize} = require('sequelize');
module.exports = (sequelize)=>{
    class Course extends Model {}
    Course.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {msg: '"title" field cannot be empty'},
                notNull: {msg: '"title" field is required'}
            }
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {msg: '"description" field cannot be empty'},
                notNull: {msg: '"description" field is required'}
            }
        },
        estimatedTime: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {msg: '"estimatedTime" field cannot be empty'},
                notNull: {msg: '"estimatedTime" field is required'}
            }
        },
        materialsNeeded: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {msg: '"materialsNeeded" field cannot be empty'},
                notNull: {msg: '"materialsNeeded" field is required'}
            }
        },
    }, {sequelize});

    Course.associate = (models) =>{
        Course.belongsTo(models.User, {
            as: 'CourseName?', // allias
            foreignKey: {
                fieldName: "CourseId?",
                allowNull: false
            }
        })
    }

    return Course;
}