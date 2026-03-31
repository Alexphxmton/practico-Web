const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Horario = sequelize.define('horarios', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    canchaId: { type: DataTypes.INTEGER, field: 'cancha_id' },
    fecha: { type: DataTypes.DATEONLY, allowNull: false },
    horaInicio: { type: DataTypes.TIME, field: 'hora_inicio', allowNull: false },
    horaFin: { type: DataTypes.TIME, field: 'hora_fin', allowNull: false },
    disponible: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = Horario;