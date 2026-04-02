const Cancha = require('../models/cancha');


const adminController = {
    mostrarPanel: async (req, res) => {
        try {
            
            res.render('admin/adminPrinc');
        } catch (error) {
            console.error('Error al cargar panel de admin:', error);
            res.status(500).send('Error al cargar');
        }
    },
   
    mostrarCanchas: async (req, res)=>{
        try {
           const canchas = await Cancha.findAll();

            res.render('admin/canchas', { canchas });
        
        }catch (error) {
            console.error('Error al cargar canchas:', error);
            res.status(500).send('Error al cargar canchas');
        }
    }
 };
    
module.exports = adminController;