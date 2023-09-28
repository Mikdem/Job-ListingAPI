const mongoose = require('mongoose')

const jobSchema = mongoose.Schema({
    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: 'User',
    // },
    company: {
        type: String,
        required: [true, 'Please add a company name']
    },
    logo: {
        type: String,
        required: [false]
    },
    isnew: {
        type: Boolean,
    },
    featured: {
        type: Boolean,
    },
    position: {
        type: String,
        required: [true, 'Please add a position']
    },
    role: {
        type: String,
        required: [true, 'Please add a role']
    },
    level: {
        type: String,
        required: [true, 'Please add a level']
    },
    // postedAt: {
    //     type: String,
    //     required: [true, 'Please add a level']
    // },
    contract: {
        type: String,
        required: [true, 'Please add a type of contract']
    },
    location: {
        type: String,
        required: [true, 'Please add the location of the Job']
    },
    languages: {
        type: [String]
    },
    tools: {
        type: [String]
    }
},
{
    timestamps: true
})

module.exports = mongoose.model('Job', jobSchema)