const express = require('express');
const router = express.Router();

const Actions = require('../actions/actions-model')
const { validateActId, validateAction } = require('./actions-middlware')

// Returns an array of actions (or an empty array) as the body of the response. 
router.get('/', (req, res, next) => {
    Actions.get()
        .then(acts => {
            res.status(200).json(acts)
        })
        .catch(next)
})

// Returns an action with the given id as the body of the response.
// If there is no action with the given id it responds with a status code 404.
router.get('/:id', validateActId, (req, res) => {
    res.status(200).json(req.action)
})

// Returns the newly created action as the body of the response.
// If the request body is missing any of the required fields it responds with a status code 400.
// When adding an action make sure the project_id provided belongs to an existing project.
router.post('/', validateAction, (req, res, next) => {
    Actions.insert({ 
        project_id: req.body.project_id, 
        description: req.body.description, 
        notes: req.body.notes, 
        completed: req.body.completed || false
    })
        .then(action => {res.status(201).json(action)})
        .catch(next)
})

// Returns the updated action as the body of the response.
// If there is no action with the given id it responds with a status code 404.
// If the request body is missing any of the required fields it responds with a status code 400.
router.put('/:id', validateActId, validateAction, (req, res, next) => {
    if (typeof req.body.completed !== 'boolean') {
        return res.status(400).json({ message: "'completed' is required" });
    }

    Actions.update(req.params.id, { 
        project_id: req.body.project_id, 
        description: req.body.description, 
        notes: req.body.notes, 
        completed: req.body.completed || false
    })
        .then(() => {
            return Actions.get(req.params.id)
        })
        .then((action) => {
            res.status(200).json(action)
        })
        .catch(next)
})

// Returns no response body.
// If there is no action with the given id it responds with a status code 404.
router.delete('/:id', validateActId, async(req, res, next) => {
    try {
        await Actions.remove(req.params.id)
        res.json(req.action)
    } catch (err) {
        next(err)
    }
})


router.use((error, req, res, next) => {
    res.status(error.status || 500).json({ message: error.message })
})
  
module.exports = router