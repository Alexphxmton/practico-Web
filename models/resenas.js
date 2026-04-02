const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Resena = sequelize.define('Resena', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    usuarioId: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'usuario_id' 
    },
    canchaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'cancha_id'
    },
    calificacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 } 
    },
    comentario: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'reseñas',
    timestamps: true,
    createdAt: 'createdat', 
    updatedAt: 'updatedat'
});

module.exports = Resena;