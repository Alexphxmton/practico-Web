const Cancha = require('../models/cancha');
const Horario = require('../models/horario');
const TipoCancha = require('../models/TipoCancha');
const Reserva = require('../models/reserva');
const Usuario = require('../models/usuario');
const Resena = require('../models/resenas');



const adminController = {
    mostrarPanel: (req, res) => {
        res.render('admin/adminPrinc');
    },

    mostrarCanchas: async (req, res) => {
    try {
        const canchas = await Cancha.findAll({
    include: [{ model: TipoCancha, as: 'detalleTipo' }] 
});
        res.render('admin/canchas', { canchas });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar canchas');
    }
},
    nuevaCanchaForm: async (req, res) => {
        try {
            const tipos = await TipoCancha.findAll();
            res.render('admin/nueva-cancha', { tipos });
        } catch (error) {
            res.status(500).send('Error al cargar tipos');
        }
    },

crearCancha: async (req, res) => {
    try {
        const { nombre, tipo_id, precio_por_hora, estado } = req.body;
        
        await Cancha.create({ 
            nombre: nombre,
            tipoId: tipo_id,      
            precioHora: precio_por_hora, 
            estado: estado || 'activa' 
        });
        
        res.redirect('/admin/canchas');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear cancha');
    }
},
    mostrarHorarios: async (req, res) => {
        try {
            const canchas = await Cancha.findAll();
            const horarios = await Horario.findAll({ 
                include: [{ model: Cancha, as: 'datosCancha' }] 
            });
            res.render('admin/horarios', { horarios, canchas });
        } catch (error) {
            res.status(500).send('Error al cargar horarios');
        }
    },

agregarHorario: async (req, res) => {
    try {
        const { cancha_id, fecha, hora_inicio, hora_fin } = req.body;
        await Horario.create({ 
            canchaId: cancha_id,     
            fecha: fecha, 
            horaInicio: hora_inicio,  
            horaFin: hora_fin,        
            disponible: true 
        });

        res.redirect('/admin/horarios');
    } catch (error) {
        console.error("ERROR AL GUARDAR HORARIO:", error); 
        res.send('<script>alert("Error: Datos inválidos o conflicto de nombres."); window.location="/admin/horarios";</script>');
    }
},
mostrarReservas: async (req, res) => {
    try {
        const reservas = await Reserva.findAll({
            include: [
                { 
                    model: Horario, 
                    as: 'detalleHorario', 
                    include: [{ model: Cancha, as: 'datosCancha' }] 
                },
                { model: Usuario, as: 'propietario' } 
            ],
            order: [['createdAt', 'DESC']]
        });
        res.render('admin/reservas', { reservas });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar todas las reservas');
    }
},

    actualizarEstadoReserva: async (req, res) => {
        try {
            const { id } = req.params;
            const { estado } = req.body; 
            await Reserva.update({ estado }, { where: { id } });
            res.redirect('/admin/reservas');
        } catch (error) {
            res.status(500).send('Error al actualizar estado');
        }
    },

    mostrarTipos: async (req, res) => {
        try {
            const tipos = await TipoCancha.findAll();
            res.render('admin/tipoCancha', { tipos });
        } catch (error) {
            res.status(500).send('Error al cargar tipos de cancha');
        }
    },

    crearTipo: async (req, res) => {
        try {
            const { descripcion } = req.body;
            await TipoCancha.create({ descripcion });
            res.redirect('/admin/tipoCancha');
        } catch (error) {
            res.status(500).send('Error al crear tipo');
        }
    },

    eliminarTipo: async (req, res) => {
        try {
            const { id } = req.params;
            await TipoCancha.destroy({ where: { id } });
            res.redirect('/admin/tipoCancha');
        } catch (error) {
            res.send('<script>alert("No se puede eliminar: hay canchas vinculadas a este tipo."); window.location="/admin/tipoCancha";</script>');
        }
    },

mostrarResenas: async (req, res) => {
        try {
            const resenas = await Resena.findAll({
                include: [
                    { model: Cancha, as: 'datosCancha', attributes: ['nombre'] },
                    { model: Usuario, as: 'propietario', attributes: ['nombre', 'email'] }
                ],
                order: [['createdat', 'DESC']]
            });
            res.render('admin/resenas', { resenas });
        } catch (error) {
            console.error("Error al cargar reseñas:", error);
            res.status(500).send('Error al cargar reseñas');
        }
    },
mostrarReservas: async (req, res) => {
    try {
        const Reserva = require('../models/reserva');
        const reservas = await Reserva.findAll({
            include: [
                {
                    model: Horario,
                    as: 'detalleHorario',
                    include: [{ 
                        model: Cancha, 
                        as: 'datosCancha',
                        include: [{ model: TipoCancha, as: 'detalleTipo' }] 
                    }]
                },
                {
                    model: Usuario,
                    as: 'propietario'
                }
            ],
            order: [['createdat', 'DESC']]
        });

        res.render('admin/reservas', { reservas });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error en el servidor");
    }
},

actualizarEstadoReserva: async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        const Reserva = require('../models/reserva');
        
        await Reserva.update({ estado }, { where: { id } });
        res.redirect('/admin/reservas');
    } catch (error) {
        console.error(error);
        res.redirect('/admin/reservas?error=1');
    }
},
editarCanchaForm: async (req, res) => {
    try {
        const { id } = req.params;
        const cancha = await Cancha.findByPk(id);
        const tipos = await TipoCancha.findAll(); 

        if (!cancha) return res.status(404).send('Cancha no encontrada');

        res.render('admin/editar-cancha', { cancha, tipos });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar el formulario');
    }
},


actualizarCancha: async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, tipo_id, precio_por_hora, estado } = req.body;

        await Cancha.update({
            nombre: nombre,
            tipoId: tipo_id,
            precioHora: precio_por_hora,
            estado: estado
        }, {
            where: { id: id }
        });

        res.redirect('/admin/canchas');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al actualizar');
    }
},
eliminarCancha: async (req, res) => {
    try {
        const { id } = req.params;
        await Cancha.destroy({
            where: { id: id }
        });
        res.redirect('/admin/canchas');

    } catch (error) {
        console.error("ERROR AL ELIMINAR CANCHA:", error);
        res.send(`
            <script>
                alert("No se puede eliminar la cancha porque tiene reservas u horarios asociados. Sugerencia: Cámbiale el estado a 'Mantenimiento' en lugar de borrarla.");
                window.location="/admin/canchas";
            </script>
        `);
    }
}
};

module.exports = adminController;