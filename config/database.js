const { Sequelize } = require('sequelize');
require('dotenv').config(); 


const sequelize = new Sequelize(
    process.env.DB_NAME,    
    process.env.DB_USER,     
    process.env.DB_PASSWORD, 
    {
        host: process.env.DB_HOST, 
        port: process.env.DB_PORT || 5502, 
        dialect: 'postgres',
        logging: false, 
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: true,   
            freezeTableName: true  
        }
    }
);

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