const sequelize = require('./config/database');

async function probarConexion() {
    try {
        // Intentar autenticar con las credenciales del .env
        await sequelize.authenticate();
        console.log('-----------------------------------------');
        console.log('✅ ¡CONEXIÓN EXITOSA!');
        console.log('Node.js se conectó a: dbreservas_canchas');
        console.log('-----------------------------------------');

        // Ejecutar una consulta SQL real para ver si responde la DB
        const [results] = await sequelize.query("SELECT current_database(), now();");
        console.log('Datos de la DB:', results[0]);
        
        process.exit(0); // Salir si todo está bien
    } catch (error) {
        console.error('-----------------------------------------');
        console.error('❌ ERROR DE CONEXIÓN:');
        console.error('Mensaje:', error.message);
        console.log('-----------------------------------------');
        process.exit(1);
    }
}

probarConexion();