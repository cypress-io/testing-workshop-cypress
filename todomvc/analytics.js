// example analytics lib
window.track = (eventName) => {
  console.log('tracking event "%s"', eventName)
}
window.addEventListener('load', () => {
  track('window.load')
})
