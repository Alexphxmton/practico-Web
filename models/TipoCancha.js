const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TipoCancha = sequelize.define('tipo_canchas', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = TipoCancha;