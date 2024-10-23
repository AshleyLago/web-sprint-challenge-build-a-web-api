const express = require('express');
const router = express.Router();

const Projects = require('./projects-model')
const { validateProjId, validateProject } = require('./projects-middleware')

// Returns an array of projects as the body of the response.
// If there are no projects it responds with an empty array.
router.get('/', (req, res, next) => {
    Projects.get()
        .then(projs => {
            res.status(200).json(projs)
        })
        .catch(next)
})

// Returns a project with the given id as the body of the response.
// If there is no project with the given id it responds with a status code 404.
router.get('/:id', validateProjId, (req, res) => {
    res.status(200).json(req.project)
})

// Returns the newly created project as the body of the response.
// If the request body is missing name, description, and completed it responds with a status code 400.
router.post('/', validateProject, (req, res, next) => {
    Projects.insert({ name: req.body.name, description: req.body.description, completed: req.body.completed || false })
        .then(project => {res.status(201).json(project)})
        .catch(next)
})

// Returns the updated project as the body of the response.
// If there is no project with the given id it responds with a status code 404.
// If the request body is missing any of the required fields it responds with a status code 400.
router.put('/:id', validateProjId, validateProject, (req, res, next) => {
    if (typeof req.body.completed !== 'boolean') {
        return res.status(400).json({ message: "'completed' is required" });
    }
    
    Projects.update(req.params.id, { name: req.body.name, description: req.body.description, completed: req.body.completed || false})
        .then(() => {
            return Projects.get(req.params.id)
        })
        .then(project => {
            res.status(200).json(project)
        })
        .catch(next)
})

// Returns no response body.
// If there is no project with the given id it responds with a status code 404.
router.delete('/:id', validateProjId, async(req, res, next) => {
    try {
        await Projects.remove(req.params.id)
        res.json(req.project)
    } catch (err) {
        next(err)
    }
})

// Returns an array of actions (could be empty) belonging to a project with the given id.
// If there is no project with the given id it responds with a status code 404.
router.get('/:id/actions', validateProjId, async(req, res, next) => {
    try {
        const actions = await Projects.getProjectActions(req.params.id)
        res.json(actions)
    } catch (err) {
        next(err)
    }
})

router.use((error, req, res, next) => {
    res.status(error.status || 500).json({ message: error.message })
})
  
module.exports = router
