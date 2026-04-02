const Reserva = require('../models/reserva');
const Horario = require('../models/horario');
const Cancha = require('../models/cancha');

const reservaController = {
crearReserva: async (req, res) => {
    try {
        const { horarioId } = req.body; 
        const usuarioId = req.session.userId; 
        if (!usuarioId) {
            return res.send('<script>alert("Sesión expirada. Por favor, inicia sesión de nuevo."); window.location="/login";</script>');
        }

        const horario = await Horario.findByPk(horarioId, {
            include: [{ 
                model: Cancha, 
                as: 'datosCancha'
            }]
        });
        
        if (!horario || !horario.disponible) {
            return res.send('<script>alert("Este horario ya no está disponible."); window.location="/cliente/listado";</script>');
        }
        const precioReal = (horario.datosCancha && horario.datosCancha.precioHora) 
                        ? horario.datosCancha.precioHora 
                        : 0;

        await Reserva.create({
            usuario_id: usuarioId, 
            horario_id: horarioId,  
            totalPago: precioReal,
            estado: 'confirmada'
        });
        await horario.update({ disponible: false });
        res.redirect('/cliente/mis-reservas');

    } catch (error) {
        console.error("ERROR CRÍTICO AL CREAR RESERVA:", error);
        res.status(500).send('Error interno del servidor al procesar la reserva');
    }
},
misReservas: async (req, res) => {
        try {
            const usuarioId = req.session.userId;

            if (!usuarioId) {
                return res.redirect('/login');
            }

            const reservas = await Reserva.findAll({
                where: { usuario_id: usuarioId }, 
                include: [
                    {
                        model: Horario,
                        as: 'detalleHorario', 
                        include: [
                            { 
                                model: Cancha, 
                                as: 'datosCancha' 
                            } 
                        ]
                    }
                ],

                order: [['id', 'DESC']]
            });

            res.render('cliente/mis-reservas', { reservas });

        } catch (error) {
            console.error('Error al cargar reservas:', error);
            res.status(500).send('Error al cargar tus reservas');
        }
    },
cancelarReserva: async (req, res) => {
    try {
        const { id } = req.params; 
        const reserva = await Reserva.findByPk(id);
        if (!reserva) return res.status(404).send('Reserva no encontrada');

        await reserva.update({ estado: 'cancelada' });

        await Horario.update(
            { disponible: true },
            { where: { id: reserva.horario_id } } 
        );

        res.redirect('/cliente/mis-reservas');
    } catch (error) {
        console.error('Error al cancelar:', error);
        res.status(500).send('Error al cancelar la reserva');
    }
}
};



module.exports = reservaController;