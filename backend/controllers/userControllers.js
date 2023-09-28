const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../model/users')


// @desc Register new user
// @route POST /api/users
// @access public
const registerUser = asyncHandler( async (req, res) => {
    const { firstName, lastName, email, password, role} = req.body

    //check if the user exists
    const userExists = await User.findOne({email})
    if(userExists) {
        res.status(400).send(
            {
                message: 'User already exists'
            }
        )
    }

    //hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //create user
    const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role
    })

    if(user){
        res.status(201).json({
            _id: user.id,
            name: user.firstName +' '+ user.lastName,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        })
    } else {
        res.status(400).send({
            message: 'Invalid user data'
        })
    }
})

// @desc Authenticate a user
// @route POST /api/users/login
// @access public
const loginUser = asyncHandler( async (req, res) => {
    const {email, password} = req.body

    //check for user email
    const user = await User.findOne({email})
    if(user && (await bcrypt.compare(password, user.password))){
        res.status(201).json({
            _id: user.id,
            name: user.firstName +' '+ user.lastName,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        })
    } else {
        res.status(400).send({
            message: 'Invalid credentials'
        })
    }
    

   // res.json({ message: 'Login User' })
})

// @desc Get user data
// @route GET /api/users/me
// @access Private
const getMe = asyncHandler( async (req, res) => {
    const { _id, firstName, lastName, email, role } = await User.findById(req.user.id)

    res.status(200).send({
        id: _id,
        firstName,
        lastName,
        email,
        role
    })
})

// @desc update Job by ID
// @route PUT /api/jobs/:id
// @access public
const updateUser = asyncHandler( async (req, res) => {
    const { firstName, lastName, email, password,  role } = req.body

    //hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)


    if(!firstName || !lastName || !role || !email || !password ){
        res.status(400)
        throw new Error('Please add all fields')
    }

    const users = await User.findByIdAndUpdate(req.params.id, {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role
    }, {new: true})

    res.status(200).json({users})
})

// @desc Delete user
// @route DELETE /api/user/:id
// @access private
const deleteUser = asyncHandler( async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id)

    res.status(200).json({ message: `Delete ${req.params.id}`})
})


// @desc Get Job
// @route GET /api/jobs/
// @access public
const getUsers = asyncHandler( async (req, res) => {
      let query = {}
      let total = await User.countDocuments(query)
      let page =(req.query.page)?parseInt(req.query.page):1;
      let perPage = (req.query.perPage)?parseInt(req.query.perPage):3;
      let skip = (page-1)*perPage;
      const users = await User.find().skip(skip)
      res.status(200).send({
        message: "Users successfully fetched",
        data: {
            total: total,
            currentPage: page,
            perPage: perPage,
            totalPages: Math.ceil(total/perPage),
            users
        }
    })

})

// Generate JWT

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

module.exports = { registerUser, loginUser, getMe, updateUser, deleteUser, getUsers }