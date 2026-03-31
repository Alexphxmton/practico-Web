const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');
const sequelize = require('./config/database');

// 1. Cargar variables de entorno
dotenv.config();

// 2. Importar Modelos
const Usuario = require('./models/usuario');
const Cancha = require('./models/cancha');
const TipoCancha = require('./models/TipoCancha');
const Horario = require('./models/horario');
const Reserva = require('./models/reserva');

// --- 3. DEFINICIÓN DE ASOCIACIONES (RELACIONES) ---
// Se usan alias únicos (as) para evitar colisiones con nombres de atributos en la DB

// A. Relación Cancha <-> TipoCancha
Cancha.belongsTo(TipoCancha, { foreignKey: 'tipo_id', as: 'detalleTipo' });
TipoCancha.hasMany(Cancha, { foreignKey: 'tipo_id', as: 'canchasDelTipo' });

// B. Relación Cancha <-> Horario
Cancha.hasMany(Horario, { foreignKey: 'cancha_id', as: 'listaHorarios' });
Horario.belongsTo(Cancha, { foreignKey: 'cancha_id', as: 'datosCancha' });

// C. Relación Horario <-> Reserva
Horario.hasOne(Reserva, { foreignKey: 'horario_id', as: 'reservaVinculada' });
Reserva.belongsTo(Horario, { foreignKey: 'horario_id', as: 'detalleHorario' });

// D. Relación Usuario <-> Reserva
Usuario.hasMany(Reserva, { foreignKey: 'usuario_id', as: 'misReservas' });
Reserva.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'propietario' });

const app = express();

// 4. Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 5. Middlewares Básicos
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 6. Configuración de Sesiones
app.use(session({
    secret: process.env.SESSION_SECRET || 'clave_secreta_para_desarrollo',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 } // 1 hora
}));

// 7. Middleware Global para Vistas (Disponibilizar usuario en EJS)
app.use((req, res, next) => {
    res.locals.user = req.session.userId ? {
        id: req.session.userId,
        nombre: req.session.userNombre,
        rol: req.session.userRol
    } : null;
    next();
});

// 8. Importar y Usar Rutas
const authRoutes = require('./routes/authRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
// const adminRoutes = require('./routes/adminRoutes'); // Descomentar cuando lo crees

app.use('/', authRoutes);
app.use('/cliente', clienteRoutes);
// app.use('/admin', adminRoutes);

// Ruta de bienvenida / Root
app.get('/', (req, res) => {
    if (req.session.userId) {
        res.redirect('/cliente/listado'); 
    } else {
        res.render('index'); // Asegúrate de que views/index.ejs exista
    }
});

// 9. Sincronizar Base de Datos y Arrancar Servidor
const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false }) 
    .then(() => {
        console.log('✅ Base de datos y Tablas sincronizadas en Postgres');
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en: http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('❌ Error al sincronizar la base de datos:', err);
    });



// ... después de los middlewares
app.use('/cliente', clienteRoutes); // <--- ESTO ES VITAL