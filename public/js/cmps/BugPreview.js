export default {
  props: ['bug'],
  template: `
        <li class="bug-preview">
          <span>🐛</span>
          <h4 class="preview-title" :title="bug.title">{{bug.title}}</h4>
          <span :class='"severity" + bug.severity'>Severity: {{bug.severity}}</span>
          <span>Owner: {{bug.owner.fullname}}</span><br>
          <span>{{bug.description}}</span>
          <br>
          <div class="actions">
            <RouterLink :to="'/bug/' + bug._id">Details</RouterLink>
            <RouterLink :to="'/bug/edit/' + bug._id"> Edit</RouterLink>
          </div>
          <button @click="onRemove(bug._id)">X</button>
        </li>
`,
  methods: {
    onRemove(bugId) {
      this.$emit('removeBug', bugId)
    },
  },
}
