import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

import BugFilter from '../cmps/BugFilter.js'
import BugList from '../cmps/BugList.js'

export default {
  template: `
		<section class="bug-app">
			<div class="subheader">
				<BugFilter @filter="setFilterBy" @sort="setSortBy"/>
			</div>
      <div class="add-new-bug-link"><RouterLink to="/bug/edit">Add New Bug</RouterLink></div>
			<BugList :bugs="bugs" @remove="removeBug"/>
		</section>
    <section class="pagination">
                <button @click="getPage(-1)" :disabled="!filterBy.pageIdx">Prev</button>
				<p>{{currPage}}</p>
                <button @click="getPage(1)" :disabled="filterBy.pageIdx + 1 === maxPageCount">Next</button>
            </section>
    `,
  data() {
    return {
      bugs: [],
      filterBy: { txt: '', labels: [], minSeverity: 0, ownerId: '', pageIdx: 0 },
      sortBy: { type: '', direction: 1 },
      maxPageCount: 0
    }
  },
  created() {
    this.loadBugs()
  },
  methods: {
    loadBugs() {
			bugService.query(this.filterBy, this.sortBy)
			.then(({bugs, maxPageCount}) => {
				this.maxPageCount = maxPageCount
				this.bugs = bugs
			})
		},
    removeBug(bugId) {
      bugService
        .remove(bugId)
        .then(() => {
          const idx = this.bugs.findIndex(bug => bug._id === bugId)
          this.bugs.splice(idx, 1)
          showSuccessMsg('Bug removed')
        })
        .catch(err => {
          showErrorMsg('Cannot remove bug')
        })
    },
    setFilterBy(filterBy) {
      this.filterBy = { ...filterBy, pageIdx: 0 }
      this.loadBugs()
    },
    setSortBy(sortBy) {
      this.sortBy = { ...sortBy }
      this.loadBugs()
    },
    getPage(dir) {
      if (this.filterBy.pageIdx === 0 && dir === -1) return
      this.filterBy.pageIdx + 1 === this.maxPageCount && dir === 1 ? this.filterBy.pageIdx : this.filterBy.pageIdx += dir
      this.loadBugs()
    },
  },
  computed: {
    currPage() {
      return `${this.filterBy.pageIdx + 1} / ${this.maxPageCount}`
    }
  },
  components: {
    BugFilter,
    BugList,
  },
}