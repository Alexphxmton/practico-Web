const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reserva = sequelize.define('Reserva', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    horario_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    totalPago: {
        type: DataTypes.DECIMAL(10, 2),
        field: 'total_pago' 
    },
    estado: {
        type: DataTypes.STRING(20),
        defaultValue: 'confirmada'
    }
}, {
    tableName: 'reservas',
    timestamps: true,
    createdAt: 'createdat', 
    updatedAt: 'updatedat'
});

module.exports = Reserva;