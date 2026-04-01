const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reserva = sequelize.define('reservas', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    usuarioId: { type: DataTypes.INTEGER, field: 'usuario_id', allowNull: false },
    horarioId: { type: DataTypes.INTEGER, field: 'horario_id', allowNull: false },
    totalPago: { type: DataTypes.DECIMAL(10, 2), field: 'total_pago', allowNull: false },
    estado: { 
        type: DataTypes.STRING(20), 
        defaultValue: 'confirmada',
        validate: { isIn: [['confirmada', 'cancelada']] } 
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = Reserva;