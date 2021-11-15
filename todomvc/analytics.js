// example analytics lib
window.track = (eventName, arg = undefined) => {
  console.log(`tracking event *${eventName}* and optional argument *${arg}*`)
}
window.addEventListener('load', () => {
  track('window.load')
})
