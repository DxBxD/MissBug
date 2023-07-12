import { utilService } from '../services/util.service.js'

export default {
	template: `
        <section class="bug-filter">
            <div>
				<input placeholder="Search by text" type="text" v-model="filterBy.txt">
				<input placeholder="Filter by min severity" type="number" v-model="filterBy.minSeverity" max=3>
				<label v-for="label in labels" :key="label">
					<input type="checkbox" :value="label" v-model="filterBy.labels">{{label}}
				</label>
			</div>
			<div>
				<select v-model="sortBy.type">
					<option value="" disabled>Sort By</option>
					<option value="title">Title</option>
					<option value="severity">Severity</option>
					<option value="createdAt">Created At</option>
				</select>
				<select v-model="sortBy.direction">
					<option value="" disabled>Sort Direction</option>
					<option value="1">Ascending</option>
					<option value="-1">Descending</option>
				</select>
			</div>
        </section>
    `,
	data() {
		return {
			sortBy: { type: 'title', direction: '1' },
			labels: ['critical', 'need-CR', 'dev-branch'],
			filterBy: { txt: '', labels: [], minSeverity: 1 },
		}
	},
	created() {
		this.emitSort = utilService.debounce(() => {
			this.$emit('sort', this.sortBy)
		}, 450)
		this.emitFilter = utilService.debounce(() => {
			this.$emit('filter', this.filterBy)
		}, 450)
	},
	watch: {
		filterBy: {
			handler() {
				this.emitFilter()
			},
			deep: true,
		},
		sortBy: {
			handler() {
				this.emitSort()
			},
			deep: true,
		},
	},
}