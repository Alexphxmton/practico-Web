const Reserva = require('../models/reserva');
const Horario = require('../models/horario');
const Cancha = require('../models/cancha');

const reservaController = {
    // 1. Crear la reserva (Lógica para tu tabla con horario_id)
    crearReserva: async (req, res) => {
        try {
            const { horarioId } = req.body;
            const usuarioId = req.session.userId;

            if (!usuarioId) {
                return res.status(401).send('Debes iniciar sesión');
            }

            // 1. Buscar el horario y traer los datos de la cancha para el precio
            // Usamos el alias 'datosCancha' que definimos en app.js
            const horario = await Horario.findByPk(horarioId, {
                include: [{ model: Cancha, as: 'datosCancha' }]
            });

            if (!horario || !horario.disponible) {
                return res.status(400).send('El horario ya no está disponible o no existe.');
            }

            // 2. Crear la reserva usando los nombres reales de tu tabla en Postgres
            await Reserva.create({
                usuarioId: usuarioId,
                horarioId: horarioId,
                totalPago: horario.datosCancha.precioHora, // Usamos el precio de la cancha
                estado: 'confirmada' // Según tu CHECK constraint
            });

            // 3. Marcar el horario como ocupado
            await horario.update({ disponible: false });

            res.redirect('/cliente/mis-reservas');

        } catch (error) {
            console.error('Error al reservar:', error);
            res.status(500).send('Error interno al procesar la reserva');
        }
    },

    // 2. Listar reservas (Lógica para que Alex vea los nombres de las canchas)
    misReservas: async (req, res) => {
        try {
            const usuarioId = req.session.userId;

            const reservas = await Reserva.findAll({
                where: { usuarioId: usuarioId },
                include: [
                    {
                        model: Horario,
                        as: 'detalleHorario', // Alias definido en app.js
                        include: [
                            { model: Cancha, as: 'datosCancha' } // Alias definido en app.js
                        ]
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            res.render('cliente/mis-reservas', { reservas });
        } catch (error) {
            console.error('Error al cargar reservas:', error);
            res.status(500).send('Error al cargar tus reservas');
        }
    }
};

module.exports = reservaController;