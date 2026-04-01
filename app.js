const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const session = require('express-session');
const sequelize = require('./config/database');


dotenv.config();


const Usuario = require('./models/usuario');
const Cancha = require('./models/cancha');
const TipoCancha = require('./models/TipoCancha');
const Horario = require('./models/horario');
const Reserva = require('./models/reserva');


Cancha.belongsTo(TipoCancha, { foreignKey: 'tipo_id', as: 'detalleTipo' });
TipoCancha.hasMany(Cancha, { foreignKey: 'tipo_id', as: 'canchasDelTipo' });

Cancha.hasMany(Horario, { foreignKey: 'cancha_id', as: 'listaHorarios' });
Horario.belongsTo(Cancha, { foreignKey: 'cancha_id', as: 'datosCancha' });

Horario.hasOne(Reserva, { foreignKey: 'horario_id', as: 'reservaVinculada' });
Reserva.belongsTo(Horario, { foreignKey: 'horario_id', as: 'detalleHorario' });

Usuario.hasMany(Reserva, { foreignKey: 'usuario_id', as: 'misReservas' });
Reserva.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'propietario' });

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
    secret: process.env.SESSION_SECRET || 'clave_secreta_para_desarrollo',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 } // 1 hora
}));


app.use((req, res, next) => {
    res.locals.user = req.session.userId ? {
        id: req.session.userId,
        nombre: req.session.userNombre,
        rol: req.session.userRol
    } : null;
    next();
});

const authRoutes = require('./routes/authRoutes');
const clienteRoutes = require('./routes/clienteRoutes');

app.use('/', authRoutes);
app.use('/cliente', clienteRoutes);



app.get('/', (req, res) => {
    if (req.session.userId) {
        res.redirect('/cliente/listado'); 
    } else {
        res.render('index'); 
    }
});


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


app.use('/cliente', clienteRoutes);