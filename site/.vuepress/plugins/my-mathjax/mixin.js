export default {
  data: () => ({
    scriptMathjax: null,
    scriptMathJaxLoaded: false
  }),
  mounted () {
    window.MathJax = { tex: { inlineMath: [['$', '$']] }}
    this.scriptMathjax = document.createElement('script')
    this.scriptMathjax.id = 'MathJax-script'
    this.scriptMathjax.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js'
    this.scriptMathjax.addEventListener('load', () => {
      this.scriptMathJaxLoaded = true
    })
    document.body.append(this.scriptMathjax)
    this.triggerMathjaxTypeset()
    this.$router.afterEach((to, from) => {
      if (from.path !== to.path) {
        this.$nextTick(() => {
          this.triggerMathjaxTypeset()
        })
      }
    })
    this.$on('updated', this.triggerMathjaxTypeset)
  },
  methods: {
    triggerMathjaxTypeset () {
      if (this.ready && this.scriptMathJaxLoaded) {
        window.MathJax.typeset()
      } else if (!this.ready) {
        this.$once('ready', this.triggerMathjaxTypeset)
      } else {
        this.scriptMathjax.addEventListener('load', () => {
          this.triggerMathjaxTypeset()
        })
      }
    }
  }
}
