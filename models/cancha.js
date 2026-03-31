const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cancha = sequelize.define('canchas', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    tipoId: {
        // Mapea a la columna 'tipo_id' que vimos en tu DBeaver
        type: DataTypes.INTEGER,
        field: 'tipo_id', 
        allowNull: false,
        references: {
            model: 'tipo_canchas',
            key: 'id'
        }
    },
    precioHora: {
        // Mapea a 'precio_por_hora'
        type: DataTypes.DECIMAL(10, 2),
        field: 'precio_por_hora',
        allowNull: false
    },
    estado: {
        // IMPORTANTE: Solo acepta 'activa' o 'inactiva' por el Check Constraint de tu DB
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'activa',
        validate: {
            isIn: [['activa', 'inactiva']]
        }
    },
    imagenUrl: {
        // Mapea a 'imagen_url'
        type: DataTypes.STRING(255),
        field: 'imagen_url',
        defaultValue: 'default-cancha.jpg'
    }
}, {
    // Configuración para coincidir con tus columnas de DBeaver
    timestamps: true, 
    createdAt: 'createdat', // Mapeo a minúsculas
    updatedAt: 'updatedat', // Mapeo a minúsculas
    freezeTableName: true,
    tableName: 'canchas'
});

module.exports = Cancha;