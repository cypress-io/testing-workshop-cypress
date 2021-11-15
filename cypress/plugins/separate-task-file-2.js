const helloSeparateTaskFile2 = (name) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Hello ${name}`)
    }, 1000)
  })

module.exports = { helloSeparateTaskFile2 }
