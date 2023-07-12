import { bugService } from '../services/bug.service.js'

export default {
	template: `
    <section v-if="bug" class="bug-details">
        <h1>{{bug.title}}</h1>
        <h3>{{bug.description}}</h3>
		<span>Owner: {{bug.owner.fullname}}</span><br>
		<span>Labels: </span>
		<span v-for="label in bug.labels" :key="label">{{label}}</span><br>
		<span :class='"severity" + bug.severity'>Severity: {{bug.severity}}</span>
		<RouterLink to="/bug">Back</RouterLink>
    </section>
    `,
	data() {
		return {
			bug: null,
		}
	},
	created() {
		const { bugId } = this.$route.params
		bugService
			.getById(bugId)
			.then((bug) => {
				this.bug = bug
			})
			.catch((err) => {
				alert('Cannot load bug')
				this.$router.push('/bug')
			})
	},
}
