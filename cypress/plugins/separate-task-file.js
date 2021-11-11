const helloSeparateTaskFile = (name) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Hello ${name}`)
    }, 1000)
  })

module.exports = { helloSeparateTaskFile }
