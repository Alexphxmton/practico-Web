const Cancha = require('../models/cancha'); 
const Horario = require('../models/horario'); 

const canchaController = {
    listarCanchas: async (req, res) => {
        try {
            const canchas = await Cancha.findAll({ 
                where: { estado: 'activa' } 
            });
            res.render('cliente/listado', { canchas });
        } catch (error) {
            console.error('Error al listar canchas:', error);
            res.status(500).send('Error al cargar las canchas');
        }
    },
    verDetalle: async (req, res) => {
        try {
            const { id } = req.params;

            const cancha = await Cancha.findByPk(id, {
                include: [{
                    model: Horario,
                    as: 'listaHorarios',
                    where: { disponible: true }, 
                    required: false 
                }]
            });

            if (!cancha) {
                return res.status(404).send('Cancha no encontrada');
            }

            if (cancha.listaHorarios) {
                cancha.listaHorarios.sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
            }

            res.render('cliente/detalle-cancha', { cancha });

        } catch (error) {
            console.error('Error al cargar el detalle de la cancha:', error);
            res.status(500).send('Error al cargar el detalle y los horarios');
        }
    }
};

module.exports = canchaController;