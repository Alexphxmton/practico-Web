const Cancha = require('../models/cancha'); 
const Horario = require('../models/horario'); 
const TipoCancha = require('../models/TipoCancha'); 
const Resena = require('../models/resenas');      
const sequelize = require('../config/database'); 
const Usuario = require('../models/usuario');  

const canchaController = {
    listarCanchas: async (req, res) => {
    try {
        const canchas = await Cancha.findAll({
            where: { estado: 'activa' },
            include: [
                { model: TipoCancha, as: 'detalleTipo' },
                { 
                    model: Resena, 
                    as: 'todasLasResenas', 
                    attributes: [] 
                }
            ],
            attributes: {
                include: [
                    [
                        sequelize.fn('AVG', sequelize.col('todasLasResenas.calificacion')), // <--- TAMBIÉN AQUÍ
                        'promedioEstrellas'
                    ],
                    [
                        sequelize.fn('COUNT', sequelize.col('todasLasResenas.id')), // <--- Y AQUÍ
                        'totalResenas'
                    ]
                ]
            },
            group: ['canchas.id', 'detalleTipo.id'], 
            subQuery: false 
        });

        res.render('cliente/listado', { canchas });
    } catch (error) {
        console.error("ERROR EN LISTAR CANCHAS:", error);
        res.status(500).send("Error al cargar canchas");
    }
},
verDetalle: async (req, res) => {
    try {
        const { id } = req.params;
        const cancha = await Cancha.findByPk(id, {
            include: [
                { model: Horario, as: 'listaHorarios' }, // Trae los horarios
                { 
                    model: Resena, 
                    as: 'todasLasResenas', 
                    include: [
                        { 
                            model: Usuario, 
                            as: 'propietario', 
                            attributes: ['nombre'] // <--- SOLO TRAEMOS EL NOMBRE POR SEGURIDAD
                        }
                    ] 
                }
            ]
        });

        if (!cancha) return res.status(404).send('Cancha no encontrada');

        res.render('cliente/detalle-cancha', { cancha });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno');
    }
},
mostrarFormularioResena: async (req, res) => {
    try {
        const { id } = req.params; 
        const Reserva = require('../models/reserva'); 
        
        const reserva = await Reserva.findByPk(id, {
            include: [{ model: Horario, as: 'detalleHorario', include: ['datosCancha'] }]
        });

        res.render('cliente/resena', { reserva });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar formulario");
    }
},

guardarResena: async (req, res) => {
    try {
        const { canchaId, calificacion, comentario } = req.body;
        const usuarioId = req.session.userId;

        const reseñaPrevia = await Resena.findOne({ 
            where: { usuarioId, canchaId } 
        });

        if (reseñaPrevia) {
            return res.send('<script>alert("Ya has dejado una opinión para esta cancha."); window.location="/cliente/mis-reservas";</script>');
        }
        await Resena.create({
            usuarioId,
            canchaId,
            calificacion,
            comentario
        });

        res.send('<script>alert("¡Reseña guardada!"); window.location="/cliente/mis-reservas";</script>');
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al procesar la reseña");
    }
}
};

module.exports = canchaController;