const authMiddleware = {
    isLoggedIn: (req, res, next) => {
        if (req.session.userId) {
            return next(); 
        }
        res.redirect('/login');
    },


    isAdmin: (req, res, next) => {
        if (req.session.userId && req.session.userRol === 'admin') {
            return next();
        }
        res.status(403).send('Acceso denegado: Se requieren permisos de administrador');
    },

    isCliente: (req, res, next) => {
        if (req.session.userId && req.session.userRol === 'cliente') {
            return next();
        }
        res.status(403).send('Acceso denegado: Esta zona es para clientes');
    }
};

module.exports = authMiddleware;