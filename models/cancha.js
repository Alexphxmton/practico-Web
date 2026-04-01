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
        type: DataTypes.INTEGER,
        field: 'tipo_id', 
        allowNull: false,
        references: {
            model: 'tipo_canchas',
            key: 'id'
        }
    },
    precioHora: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'precio_por_hora',
        allowNull: false
    },
    estado: {
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

    timestamps: true, 
    createdAt: 'createdat', 
    updatedAt: 'updatedat', 
    freezeTableName: true,
    tableName: 'canchas'
});

module.exports = Cancha;