import { bugService } from "../services/bug.service.js"
import { userService } from "../services/user.service.js"
import BugList from "../cmps/BugList.js"

export default {
    template: `
    <section>
        <h2 v-if="user" class="user-headline">
            {{ user.fullname }}
        </h2>
        <BugList v-if="userBugs" :bugs="userBugs" @remove="removeBug"/>
    </section>
    <section class="pagination">
        <button @click="getPage(-1)" :disabled="!pageIdx">Prev</button>
        <p>{{currPage}}</p>
        <button @click="getPage(1)" :disabled="pageIdx + 1 === maxPageCount">Next</button>
    </section>`,
    data() {
        return {
            user: null,
            userBugs: [],
            maxPageCount: 0,
            filterBy: {},
            sortBy: {},
            pageIdx: 0 
        }
    },
    created() {
        const userId = this.$route.params.userId
        const user = userService.getLoggedinUser()
        this.user = user
        this.filterBy = { txt: '', labels: [], minSeverity: 1, ownerId: userId }
        this.sortBy = { type: 'severity', direction: 1 }
        return bugService.query(this.filterBy, this.sortBy)
            .then(({ bugs, maxPageCount }) => {
                this.maxPageCount = maxPageCount
                this.userBugs = bugs
                console.log(maxPageCount)
                console.log(bugs)
            })
            .catch(err => {
                console.error('Cannot fetch user or bugs', err)
            })
    },
    methods: {
        loadBugs() {
            bugService.query(this.filterBy, this.sortBy)
                .then(({ bugs, maxPageCount }) => {
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
        getPage(dir) {
            if (this.pageIdx === 0 && dir === -1) return
            this.pageIdx + 1 === this.maxPageCount && dir === 1 ? this.pageIdx : this.pageIdx += dir
            this.loadBugs()
        },
    },
    computed: {
        currPage() {
            return `${this.pageIdx + 1} / ${this.maxPageCount}`
        }
    },
    components: {
        BugList
    }
}