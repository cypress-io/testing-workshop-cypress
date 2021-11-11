const helloSeparateTaskFile3 = (name) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Hello ${name}`)
    }, 1000)
  })

module.exports = { helloSeparateTaskFile3 }
