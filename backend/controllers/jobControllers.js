const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose')
const Job = require('../model/jobs')


// @desc Get Job by ID
// @route GET /api/jobs/:id
// @access public
const getJobById = asyncHandler( async (req, res) => {
    const jobId = req.params.id;
    if (!mongoose.isValidObjectId(jobId)) {
        return res.status(400).json({
            message: "Invalid job ID format.",
        });
    }
    const job = await Job.findById(jobId)
    if(!job){
        return res.status(404).json({
         message: "No jobs found"
        })  
     } 
    res.status(200).json(job)
})

// @desc Get Job
// @route GET /api/jobs/
// @access public
const getJobs = asyncHandler( async (req, res) => {
    let query = {}
    if(req.query.company){
        query.$or=[
            {"company" : {$regex: req.query.company, $options: 'i'}}
    ]}
    if(req.query.position){
        query.$or=[
            {"position" : {$regex: req.query.position, $options: 'i'}}
    ]}
    if(req.query.location){
        query.$or=[
            {"location" : {$regex: req.query.location, $options: 'i'}}
    ]}

    let total = await Job.countDocuments(query)
    let page =(req.query.page)?parseInt(req.query.page):1;
    let perPage = (req.query.perPage)?parseInt(req.query.perPage):3;
    let skip = (page-1)*perPage;
    let sort = {};
    if (req.query.sort) {
        const sortField = req.query.sort;
        const sortOrder = req.query.order || 'asc'; 
        if (['company', 'location', 'position', 'createdAt'].includes(sortField)) {
            sort[sortField] = sortOrder === 'desc' ? -1 : 1;
        } else {
            sort.createdAt = -1;
        }
    }
    
    const jobs = await Job.find(query).skip(skip).limit(perPage).collation({ locale: 'en', strength: 2 }).sort(sort).exec()
    if(jobs.length === 0){
       return res.status(404).json({
        message: "No job found"
       })
        
    }
    res.status(200).send({
        message: "Job successfully fetched",
        data: {
            total: total,
            currentPage: page,
            perPage: perPage,
            totalPages: Math.ceil(total/perPage),
            jobs
        }
    })

})

// @desc Create Job
// @route POST /api/jobs
// @access public
const setJobs = asyncHandler( async (req, res) => {
    const { company, logo, isnew, featured,  position, role, level, contract, location, languages, tools } = req.body

    const newJob = new Date();
    newJob.setDate(newJob.getDate() - 2);

    const job = await Job.create({
        company,
        logo,
        isNew: req.body.createdAt < newJob,
        featured,
        position,
        role,
        level,
        contract,
        location,
        languages,
        tools
    });

    res.json(job)
    

    
})

// @desc update Job by ID
// @route PUT /api/jobs/:id
// @access public
const updateJobs = asyncHandler( async (req, res) => {
    const { company, logo, isnew, featured,  position, role, level, contract, location, languages, tools } = req.body

    if(!company || !position || !role || !level || !contract || !location || !languages ){
        res.status(400)
        throw new Error('Please add all fields')
    }

    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {new: true})

    res.status(200).json({job})
})

// @desc Delete job
// @route DELETE /api/jobs/:id
// @access public
const deleteJobs = asyncHandler( async (req, res) => {
    const job = await Job.findByIdAndDelete(req.params.id)

    res.status(200).json({ message: `Delete ${req.params.id}`})
})

module.exports = {
    getJobs, setJobs, updateJobs, deleteJobs, getJobById
}