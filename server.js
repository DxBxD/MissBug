import express from 'express'
import cookieParser from 'cookie-parser'
import { userService } from './services/user.service.js'
import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

// Express Config:
app.use(express.json())
app.use(cookieParser())
app.use(express.static('public'))

const port = 3030
app.listen(port, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)

// Get Bug (READ)
app.get('/api/bug/:bugId', (req, res) => {
    const bugId = req.params.bugId
    let visitedIds = req.cookies.visitedIds ? JSON.parse(req.cookies.visitedIds) : []
    if (!visitedIds.find(id => id === bugId)) {
        visitedIds.push(bugId)
    }
    if (visitedIds.length >= 3) {
        loggerService.error('WAIT')
        return res.status(401).send('Wait for a bit')
    }
    res.cookie('visitedIds', JSON.stringify(visitedIds), { maxAge: 7 * 1000 })
    bugService.getById(bugId)
        .then(bug => {
            res.send(bug)
        })
        .catch((err) => {
            loggerService.error('Cannot get bug', err)
            res.status(500).send('Cannot get bug')
        })
})

// Get Bugs (READ)
app.get('/api/bug', (req, res) => {
    const filterBy = {
        txt: req.query.txt || '',
        minSeverity: req.query.minSeverity || '',
        labels: req.query.labels || [],
        pageIdx: req.query.pageIdx,
        ownerId: req.query.ownerId || ''
    }
    const sortBy = {
        type: req.query.type || '',
        direction: req.query.direction || 1
    }
    bugService.query(filterBy, sortBy)
        .then(bugs => {
            res.send(bugs)
        })
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
})

// Save Bug (UPDATE)
app.put('/api/bug/:bugId', (req, res) => {

    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add bug')
    
    const { _id, title, description, severity, labels } = req.body
    const bugToSave = { _id, title, description, severity, labels }

    bugService.save(bugToSave, loggedinUser)
        .then(savedBug => {
            loggerService.info('Bug saved!', bugToSave)
            res.send(savedBug)
        })
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

// Save Bug (CREATE)
app.post('/api/bug/', (req, res) => {
    
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add bug')
    
    const { title, description, severity, labels } = req.body
    const bugToSave = { title, description, severity, labels }

    bugService.save(bugToSave, loggedinUser)
        .then(savedBug => {
            loggerService.info('Bug saved!', bugToSave)
            res.send(savedBug)
        })
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

// Delete bug (DELETE)
app.delete('/api/bug/:bugId', (req, res) => {

    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot remove bug')

    const bugId = req.params.bugId
    bugService.remove(bugId)
        .then(bugs => {
            loggerService.info(`Bug ${bugId} removed`)
            res.send(`Bug ${bugId} Removed`)
        })
        .catch((err) => {
            loggerService.error('Cannot remove bug', err)
            res.status(400).send('Cannot remove bug')
        })
})

// Get Users
app.get('/api/user', (req, res) => {
    userService.query()
        .then((users) => {
            res.send(users)
        })
        .catch((err) => {
            console.log('Cannot load users', err)
            res.status(400).send('Cannot load users')
        })
})

// Login
app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
        .catch(err => {
            console.log('Cannot login', err)
            res.status(400).send('Cannot login')
        })
})

// Signup
app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    userService.save(credentials)
        .then(user => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            console.log('Cannot signup', err)
            res.status(400).send('Cannot signup')
        })
})

// Logout
app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.end()
})