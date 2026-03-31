const { Sequelize } = require('sequelize');
require('dotenv').config(); // Carga las variables del archivo .env

// Configuración de la conexión utilizando las variables de entorno
const sequelize = new Sequelize(
    process.env.DB_NAME,     // dbreservas_canchas
    process.env.DB_USER,     // postgres
    process.env.DB_PASSWORD, // root
    {
        host: process.env.DB_HOST, // 127.0.0.1 o localhost
        port: process.env.DB_PORT || 5502, // <--- Puerto específico de tu Postgres
        dialect: 'postgres',
        logging: false, // Cambia a console.log para ver las consultas SQL en la terminal
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: true,      // Crea automáticamente createdAt y updatedAt
            freezeTableName: true  // Evita que Sequelize cambie tus nombres de tablas a plural
        }
    }
);

// Función para verificar la conexión al arrancar
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a PostgreSQL exitosa en el puerto ' + (process.env.DB_PORT || 5502));
    } catch (error) {
        console.error('❌ No se pudo conectar a la base de datos:', error.message);
    }
};

testConnection();

module.exports = sequelize;