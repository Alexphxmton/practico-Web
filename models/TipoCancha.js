const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TipoCancha = sequelize.define('TipoCancha', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true 
    },
    descripcion: { 
        type: DataTypes.STRING, 
        allowNull: false,
        field: 'nombre' 
    }
}, {
    tableName: 'tipo_canchas', 
    timestamps: true,
    createdAt: 'createdat',
    updatedAt: 'updatedat'
});

module.exports = TipoCancha;