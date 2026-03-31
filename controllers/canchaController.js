const Cancha = require('../models/cancha'); 
const Horario = require('../models/horario'); // Importante importar el modelo de Horario

const canchaController = {
    // 1. Listar todas las canchas activas
    listarCanchas: async (req, res) => {
        try {
            // Buscamos las canchas con estado activo
            const canchas = await Cancha.findAll({ 
                where: { estado: 'activa' } 
            });
            
            // Renderizamos la vista del listado
            res.render('cliente/listado', { canchas });
        } catch (error) {
            console.error('Error al listar canchas:', error);
            res.status(500).send('Error al cargar las canchas');
        }
    },

    // 2. Ver detalle de una cancha y sus horarios
    verDetalle: async (req, res) => {
        try {
            const { id } = req.params;

            // Buscamos la cancha por su ID e INCLUIMOS sus horarios
            const cancha = await Cancha.findByPk(id, {
                include: [{
                    model: Horario,
                    as: 'listaHorarios' // Este alias debe coincidir exactamente con el de app.js
                }]
            });

            if (!cancha) {
                return res.status(404).send('Cancha no encontrada');
            }

            // Renderizamos la vista de detalle pasando el objeto cancha (que ya contiene los horarios)
            res.render('cliente/detalle-cancha', { cancha });

        } catch (error) {
            console.error('Error al cargar el detalle de la cancha:', error);
            res.status(500).send('Error al cargar el detalle y los horarios');
        }
    }
};

module.exports = canchaController;