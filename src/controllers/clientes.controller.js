const pool = require('../database/index');

const clientesController = {
    cadastraCliente: async (req, res) => {
        const { nome, idade } = req.body;

        res.status(200).json({nome, idade});
    }
};

module.exports = clientesController;