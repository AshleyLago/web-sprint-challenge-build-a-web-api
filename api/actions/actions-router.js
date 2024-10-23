const express = require('express');
const router = express.Router();

const Actions = require('../actions/actions-model')
const { validateActId, validateAction } = require('./actions-middlware')

// Returns an array of actions (or an empty array) as the body of the response. 
router.get('/', (req, res) => {})

// Returns an action with the given id as the body of the response.
// If there is no action with the given id it responds with a status code 404.
router.get('/:id', validateActId, (req, res) => {})

// Returns the newly created action as the body of the response.
// If the request body is missing any of the required fields it responds with a status code 400.
// When adding an action make sure the project_id provided belongs to an existing project.
router.post('/', validateAction, (req, res) => {})

// Returns the updated action as the body of the response.
// If there is no action with the given id it responds with a status code 404.
// If the request body is missing any of the required fields it responds with a status code 400.
router.put('/:id', validateActId, validateAction, (req, res) => {})

// Returns no response body.
// If there is no action with the given id it responds with a status code 404.
router.delete('/:id', validateActId, (req, res) => {})


router.use((error, req, res, next) => {
    res.status(error.status || 500).json({ message: error.message })
})
  
module.exports = router