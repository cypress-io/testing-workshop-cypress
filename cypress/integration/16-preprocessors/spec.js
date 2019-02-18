/// <reference types="cypress" />

describe('included transforms', () => {
  it('transpiles method', () => {
    class Foo {
      name () {
        return 'Foo'
      }
    }
    expect(new Foo().name()).to.equal('Foo')
  })

  it('transpiles static property', () => {
    class Foo {
      static name = 'Foo'
    }
    expect(Foo.name).to.equal('Foo')
  })

  it('transpiles static method', () => {
    class Foo {
      static name () {
        return 'Foo'
      }
    }
    expect(Foo.name()).to.equal('Foo')
  })

  it('transpiles spread operator', () => {
    const concat = (...strings) => strings.join('')
    expect(concat('foo', 'bar')).to.equal('foobar')
  })

  it('transpiles JSX', () => {
    // need to require React to actually use transpiled function "foo"
    const foo = () => <p>Hello, JSX</p>
    expect(foo).to.be.a('function')
  })
})

it.skip('transpiles Object.fromEntries', () => {
  // https://github.com/tc39/proposal-object-from-entries
  const obj = Object.fromEntries([['a', 0], ['b', 1]])
})

it.skip('transpiles do expression', () => {
  // only will transpile if you add @babel/plugin-proposal-do-expressions plugin
  // https://babeljs.io/docs/en/next/babel-plugin-proposal-do-expressions
  // const x = 100
  // const y = 20
  // const a = do {
  //   if (x > 10) {
  //     if (y > 20) {
  //       ;('big x, big y')
  //     } else {
  //       ;('big x, small y')
  //     }
  //   } else {
  //     if (y > 10) {
  //       ;('small x, big y')
  //     } else {
  //       ;('small x, small y')
  //     }
  //   }
  // }
  // expect(a).to.equal('big x, small y')
})
