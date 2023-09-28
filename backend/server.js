const express = require('express') 
const dotenv = require('dotenv').config()
const {errorHandler} = require('./middleware/errorMiddleware')
const connectDB = require('../db')

connectDB()

const port = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/jobs', require('./routes/jobRoute') )
app.use('/api/users', require('./routes/userRoute') )
app.use(errorHandler)

app.listen(port, () => console.log("Server Started on port " + port))