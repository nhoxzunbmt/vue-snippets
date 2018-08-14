if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope)
    }, err => {
      console.log('ServiceWorker registration failed: ', err)
    })
  })
}

const resultPanel = document.getElementById('hits')

const search = instantsearch({
  appId: 'AQKEBHIMMP',
  apiKey: '9906de1d3ad74b84b5e77b9ead8f4895',
  indexName: 'prod_VUE_SNIPPETS',
  routing: true,
  searchParameters: {
    hitsPerPage: 5
  },
  searchFunction (helper) {
    if (helper.state.query.trim() !== '') {
      helper.search()
    }
  }
})

search.addWidget(
  instantsearch.widgets.searchBox({
    container: '#searchBox',
    placeholder: 'Search',
    reset: false,
    autofocus: false
  })
)

const itemTemplate = `
<a class="search-result-item-{{type}} search-result-item" href="{{ relpermalink }}">
  <h3 class="title">{{#isTag}}#{{/isTag}}{{{ _highlightResult.title.value }}}</h3>
  {{#description}}
  <p class="description">{{{ _highlightResult.description.value }}}</p>
  {{/description}}
</a>
`

search.addWidget(instantsearch.widgets.hits({
  container: resultPanel,
  templates: {
    empty: '<span class="na">No results</span>',
    item: itemTemplate
  }
}))

const algoliaLogo = document.createElement('img')
algoliaLogo.src = 'https://www.algolia.com/static_assets/images/pricing/pricing_new/algolia-powered-by-14773f38.svg'
algoliaLogo.classList.add('algolia-logo')

search.on('render', () => resultPanel.appendChild(algoliaLogo))

search.start()

const searchBox = document.querySelector('#searchBox input')

const hideResultPanel = () => (resultPanel.style.display = 'none')
const showResultPanel = () => (resultPanel.style.display = 'block')

document.addEventListener('click', e => {
  if (!resultPanel.contains(e.target) && e.target !== searchBox) {
    hideResultPanel()
  }
})

searchBox.addEventListener('focus', hideResultPanel)

searchBox.addEventListener('input', e => {
  searchBox.value.trim() === '' ? hideResultPanel () : showResultPanel()
})
