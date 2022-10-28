const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

exports.signUp = async (req, res, next) => {
    const { username, password } = req.body;
    
    try {
        const hashPassword = await bcrypt.hash(password, 12);
        const user = await User.create({
            username,
            password: hashPassword
        });
        // req.session.user = user;
        res.status(201).json({
            status: 'success',
            data: { user }
        });

    } catch(e) {
        res.status(400).json({
            status: 'fail'
        });
    }
}

exports.login = async (req, res, next) => {
    const { username, password } = req.body;
    
    try {
        const user = await User.findOne({ username });
        if(!user) {
            res.status(404).json({
                status: 'fail',
                message: 'user not found!'
            });
        }

        const isCorrect = bcrypt.compare(password, user.password);
        if(isCorrect) {
            // req.session.user = user;
            res.status(200).json({
                status: 'success'
            });
        } else {
            res.status(400).json({
                status: 'fail',
                message: 'invalid username/password!'
            });
        }
    } catch(e) {
        res.status(400).json({
            status: 'fail'
        });
    }
}
