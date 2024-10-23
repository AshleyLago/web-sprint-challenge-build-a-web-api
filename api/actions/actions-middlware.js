// add middlewares here related to actions
const Actions = require('../actions/actions-model')

async function validateActId(req, res, next) {
    try {
        const action = await Actions.get(req.params.id)
        if (action) {
            req.action = action
            next()
        } else {
            next({ status: 404, message: "action not found"})
        }
    } catch (err) {
        next(err)
    }
}

function validateAction(req, res, next) {
    const { project_id, description, notes } = req.body
    if ( !project_id || !project_id.trim() || !description || !description.trim() || !notes || !notes.trim()) {
        next({ status:400, message: "missing project id, description, and/or notes"})
    } else {
        req.project_id = project_id.trim()
        req.description = description.trim()
        req.notes = notes.trim()
        next()
    }
}

module.exports = {
    validateActId,
    validateAction
}