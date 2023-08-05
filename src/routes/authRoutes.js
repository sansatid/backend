const express = require('express');
const router = express.Router();
const db = require('../config/db');
const jwt = require('jsonwebtoken');

// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
};

router.post('/login', (req, res, next) => {
    try {
    const {username, password} = req.body;

    const sql = 'SELECT id, username, age, email, address, contact FROM user WHERE username = ? AND password = ?';
    const params = [username, password];
    db.query(sql, params, (err, result) => {
        if (err) throw err

        if (result.length > 0) {
        const token = jwt.sign({ id: result[0].id }, 'erti45f9f92hf09fhij2jkb66ff');

        const data = {
            success: true,
            message: 'Login success',
            data: {
                token: token,
                user: result[0]
            }
        }

         res.send(data);
        } else {
            const data = {
                success: false,
                message: 'Login fail',
                data: {}
            }
    
             res.send(data);
        }
    });
} catch (err) {
    next(err)
}

});


router.use(errorHandler);

module.exports = router;