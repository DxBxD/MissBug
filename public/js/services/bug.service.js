import { utilService } from './util.service.js'

const BASE_URL= '/api/bug/'

export const bugService = {
	query,
	getById,
	getEmptyBug,
	save,
	remove,
}

function query(filterBy = { txt: '', labels: [], minSeverity: 1, ownerId: '' }, sortBy = { type: '', direction: 1 }) {
    console.log({ ...filterBy, ...sortBy })
	return axios.get(BASE_URL, { params: { ...filterBy, ...sortBy } })
        .then(res => res.data)
}

function getById(bugId) {
	return axios.get(BASE_URL + bugId).then(res => res.data)
}

function remove(bugId) {
	return axios.delete(BASE_URL + bugId).then(res => res.data)
}

function save(bug) {
	if(bug._id) {
        return axios.put(BASE_URL + bug._id, bug).then(res => res.data)
    } else {
        return axios.post(BASE_URL, bug).then(res => res.data)
    }
}

function getEmptyBug(title = '', severity = 1, description = '', labels = []) {
	return {
		_id: '',
		title,
		severity,
		description,
		labels
	}
}


// function setFilterBy(filterBy = {}) {
// 	if (filterBy.title !== undefined) gFilterBy.title = filterBy.title
// 	return gFilterBy
// }

// function getFilterBy() {
// 	return { ...gFilterBy }
// }

// function _createBugs() {
// 	let bugs = utilService.loadFromStorage(BUG_KEY)
// 	if (!bugs || !bugs.length) {
// 		bugs = []
// 		bugs.push(_createBug('Button is missing', 1))
// 		bugs.push(_createBug('Error while watching', 2))
// 		bugs.push(_createBug('Warning appears', 3))
// 		utilService.saveToStorage(BUG_KEY, bugs)
// 	}
// }

// function _createBug(title, severity) {
// 	const bug = getEmptyBug(title, severity, description)
// 	bug._id = utilService.makeId()
// 	return bug
// }