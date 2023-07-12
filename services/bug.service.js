import fs from 'fs'
import { utilService } from './util.service.js'

export const bugService = {
    query,
    getById,
    remove,
    save
}

const PAGE_SIZE = 6
const bugs = utilService.readJsonFile('data/bug.json')

function query(filterBy, sortBy) {
    
    const regex = new RegExp(filterBy.txt, 'i')

    let filteredBugs
    
    filteredBugs = bugs.filter(bug => regex.test(bug.title))
    
    filteredBugs = filteredBugs.filter(bug => bug.severity >= +filterBy.minSeverity)

    if (filterBy.ownerId) {
        filteredBugs = filteredBugs.filter(bug => bug.owner._id === filterBy.ownerId)
    }

    if (filterBy.labels.length) {
        filteredBugs = filteredBugs.filter(bug => filterBy.labels.every(label => bug.labels.includes(label)))
    }

    if (sortBy.type) {
        const diff = sortBy.direction
        switch (sortBy.type) {
            case 'title':
                filteredBugs.sort((bugA, bugB) => (bugA.title.localeCompare(bugB.title)) * diff)
                break
            case 'severity':
                filteredBugs.sort((bugA, bugB) => (bugA.severity - bugB.severity) * diff)
                break
            case 'createdAt':
                filteredBugs.sort((bugA, bugB) => (bugA.createdAt - bugB.createdAt) * diff)
                break
        }
    }

    const maxPageCount = Math.ceil(filteredBugs.length / PAGE_SIZE)

    if (filterBy.pageIdx !== undefined) {
      const startPageIdx = filterBy.pageIdx * PAGE_SIZE
      filteredBugs = filteredBugs.slice(startPageIdx, startPageIdx + PAGE_SIZE)
    }

    return Promise.resolve({bugs:filteredBugs, maxPageCount})
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId, loggedinUser) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    const bug = bugs[bugIdx]
    if (bugIdx === -1) return Promise.reject('Bug doesn\'nt exist')
    if (!loggedinUser.isAdmin &&
        bug.owner._id !== loggedinUser._id) return Promise.reject('Not your bug')
    bugs.splice(bugIdx, 1)
    _saveBugsToFile()
    return Promise.resolve(bugs)
}

function save(bug, loggedinUser) {
    if (bug._id) {
        const bugIdx = bugs.findIndex(currBug => currBug._id === bug._id)
        const existingBug = bugs[bugIdx]
        if (bugIdx === -1) throw new Error('Bug doesn\'nt exist')
        if (!loggedinUser.isAdmin 
            && existingBug.owner._id !== loggedinUser._id) return Promise.reject('Not your bug')
            existingBug.title = bug.title
            existingBug.description = bug.description
            existingBug.labels = [...bug.labels]
            existingBug.severity = bug.severity
    } else {
        bug.createdAt = Date.now()
        bug._id = utilService.makeId()
        bug.owner = loggedinUser
        bugs.unshift(bug)
    }

    return _saveBugsToFile().then(() => bug)
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile('data/bug.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}