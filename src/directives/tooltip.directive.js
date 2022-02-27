export default {
  mounted: (el, {value}) => {
    M.Tooltip.init(el, {html: value})
  },
  beforeUnmount(el) {
    const tooltip = M.Tooltip.getInstance(el)
    if (tooltip && tooltip.destroy) {
      tooltip.destroy()
    }
  }
}
