import 'reveal.js/dist/reset.css'
import 'reveal.js/dist/reveal.css'
import 'reveal.js/dist/theme/league.css'

// pick code block syntax highlighting theme
// included with Reveal.js are monokai and zenburn
// import 'reveal.js/plugin/highlight/monokai.css'
// more themes from Highlight.js
// import 'highlight.js/styles/purebasic.css'
import 'highlight.js/styles/docco.css'

import Reveal from 'reveal.js'
import Markdown from 'reveal.js/plugin/markdown/markdown.esm.js'
import RevealHighlight from 'reveal.js/plugin/highlight/highlight.esm.js'

// something like
// {BASE_URL: "/reveal-markdown-example/", MODE: "development", DEV: true, PROD: false, SSR: false}
// https://vitejs.dev/guide/env-and-mode.html
console.log('env variables', import.meta.env)
const { BASE_URL, PROD } = import.meta.env
if (typeof BASE_URL !== 'string') {
  throw new Error('Missing BASE_URL in import.meta.env')
}

const getBaseName = (relativeUrl) => {
  if (!relativeUrl.startsWith('./')) {
    throw new Error(`Is not relative url "${relativeUrl}"`)
  }
  const parts = relativeUrl.split('/').filter((s) => s !== '.') // remove "."
  parts.pop() // ignore the file part
  return parts.join('/')
}

// fetch the Markdown file ourselves

// https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
const url = new URL(document.URL)
const slidesFolder = url.searchParams.get('p') || 'intro'
const toLoad = slidesFolder + '/PITCHME.md'
const markdownFilename = './' + (PROD ? toLoad : 'slides/' + toLoad)

const markdownFileBase = getBaseName(markdownFilename)
console.log('markdown file base', markdownFileBase)
const baseUrl = BASE_URL + markdownFileBase + '/'

const updateRelativeUrls = (md) => {
  return md.replace(/\.\//g, baseUrl)
}

fetch(markdownFilename)
  .then((r) => r.text())
  .then((md) => {
    const updatedUrlsMd = updateRelativeUrls(md)

    document.querySelector('.slides').innerHTML =
      '<section data-markdown data-separator="\\-\\-\\-" data-separator-vertical="\\+\\+\\+">\n' +
      '<textarea data-template>\n' +
      updatedUrlsMd +
      '\n' +
      '</textarea>\n' +
      '</section>\n'

    const deck = new Reveal({
      plugins: [Markdown, RevealHighlight]
    })
    deck.initialize({
      // presentation sizing config
      width: 1280,
      height: 720,
      minScale: 0.2,
      maxScale: 1.1,
      // show the slide number on the page
      // and in the hash fragment and
      // make sure they are the same
      slideNumber: true,
      hash: true,
      hashOneBasedIndex: true
    })
  })
