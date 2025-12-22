const Contato = require('../models/ContatoModel');

exports.index = async (req, res) => {
    try {
        if(!req.session.user){
            return res.render('index', {
                contatos: [],
                user: null
            })
        }

        const userId = req.session.user._id;
        const userRole = req.session.user.role;

        let contatos;

        if(userRole === 0){
            contatos = await Contato.buscaContatos();
        } else {
            contatos = await Contato.buscaContatosPorUser(userId);
        }

        res.render('index', { contatos, user: req.session.user });
    } catch(e){
        console.error('homeController error', e);
        res.render('404');
    }
};