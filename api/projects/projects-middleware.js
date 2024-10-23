const Projects = require('./projects-model')

async function validateProjId(req, res, next) {
    try {
        const project = await Projects.get(req.params.id)
        if (project) {
            req.project = project
            next()
        } else {
            next({ status: 404, message: "project not found"})
        }
    } catch (err) {
        next(err)
    }
}

function validateProject(req, res, next) {
    const { name, description } = req.body
    if ( !name || !name.trim() || !description || !description.trim()) {
        next({ status:400, message: "missing name and/or description"})
    } else {
        req.name = name.trim()
        req.description = description.trim()
        next()
    }
}


module.exports = {
    validateProjId,
    validateProject
}