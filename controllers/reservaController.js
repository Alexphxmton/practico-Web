const Reserva = require('../models/reserva');
const Horario = require('../models/horario');
const Cancha = require('../models/cancha');

const reservaController = {
crearReserva: async (req, res) => {
    try {
        const { horarioId } = req.body;
        const usuarioId = req.session.userId;
        const horario = await Horario.findByPk(horarioId);
        
        if (!horario || !horario.disponible) {
            return res.send('<script>alert("Este horario ya ha sido reservado por otra persona."); window.location="/cliente/listado";</script>');
        }
        await Reserva.create({
            usuarioId,
            horarioId,
            totalPago: 150.00, 
            estado: 'confirmada'
        });

        await horario.update({ disponible: false });

        res.redirect('/cliente/mis-reservas');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al procesar reserva');
    }
},
    misReservas: async (req, res) => {
        try {
            const usuarioId = req.session.userId;

            const reservas = await Reserva.findAll({
                where: { usuarioId: usuarioId },
                include: [
                    {
                        model: Horario,
                        as: 'detalleHorario', 
                        include: [
                            { model: Cancha, as: 'datosCancha' } 
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
            { where: { id: reserva.horarioId } }
        );

        res.redirect('/cliente/mis-reservas');
    } catch (error) {
        console.error('Error al cancelar:', error);
        res.status(500).send('Error al cancelar la reserva');
    }
}
};



module.exports = reservaController;