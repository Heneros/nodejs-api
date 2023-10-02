const { StatusCodes } = require("http-status-codes")

const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { BadRequestError, UnauthenticatedError } = require('../errors')
const User = require("../models/User")

const register = async (req, res) => {
    try {
        // const { name, email, password } = req.body;
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password, salt);
        // const tempUser = { name, email, password: hashedPassword };

        const user = await User.create({ ...req.body })
        const token = user.createJWT();
        res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
    } catch (error) {
        console.log(error)
    }

}
const login = async (req, res) => {
    // try {
    const { email, password } = req.body

    if (!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }
    const user = await User.findOne({ email })
    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials')
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials')
    }

    const token = user.createJWT()
    res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
    // } catch (error) {
    //     console.log(error)
    // }
}

module.exports = {
    register,
    login
}