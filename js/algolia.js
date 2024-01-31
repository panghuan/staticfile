// const { algoliasearch, instantsearch } = window;
// const { autocomplete } = window['@algolia/autocomplete-js'];
// const { createLocalStorageRecentSearchesPlugin } =
//   window['@algolia/autocomplete-plugin-recent-searches'];
// const { createQuerySuggestionsPlugin } =
//   window['@algolia/autocomplete-plugin-query-suggestions'];

// const searchClient = algoliasearch(
//   'B1G2GM9NG0',
//   'aadef574be1f9252bb48d4ea09b5cfe5'
// );

// 文档中的 cssclass 都是适配 daisyui 的类名

const searchClient = algoliasearch(
  '9X40HLS2PE',
  '44e12d350210ae17fd8d0967e7c033e5'
);

const search = instantsearch({
  // indexName: 'demo_ecommerce',
  indexName: 'Meditations',
  searchClient,
  // future: { preserveSharedStateOnUnmount: true },
  insights: true,
});

// const virtualSearchBox = instantsearch.connectors.connectSearchBox(() => {});

// const { searchBox } = instantsearch.widgets;
// searchBox({
//   container: '#searchbox',
//   placeholder: 'Search for foods',
// });

const customRefinementListWithSearchBox = instantsearch.connectors.connectRefinementList(
  ({ items, refine, searchForItems, isFromSearch }, isFirstRender) => {
    const container = document.getElementById('brand-list');

    if (isFirstRender) {
      container.innerHTML = `
        <div>
          <input type="search" />
          <ul></ul>
        </div>
      `;

      container.addEventListener('click', ({target}) => {
        const input = target.closest('input[type="checkbox"]');

        if (input) {
          refine(input.value);
        }
      });

      container.addEventListener('input', ({target}) => {
        const isSearchInput =
          target.nodeName === 'INPUT' && target.type === 'search';

        if (isSearchInput) {
          searchForItems(target.value);
        }
      });

      return;
    }

    if (!isFromSearch) {
      container.querySelector('input[type="search"]').value = '';
    }

    container.querySelector('ul').innerHTML = items
      .map(
        ({value, isRefined, highlighted, count}) => `
          <li>
            <label>
              <input
                type="checkbox"
                value="${value}"
                ${isRefined ? 'checked' : ''}
              />
              ${highlighted} (${count})
            </label>
          </li>
        `
      )
      .join('');
  }
);


search.addWidgets([
  // virtualSearchBox({}),
  instantsearch.widgets.searchBox({
    container: '#searchbox',
    placeholder: '搜索食材',
    showReset: false,
    cssClasses: {
      form: 'MyCustomSearchBoxForm',
      input: 'MyCustomSearchBoxInput',
      reset: 'MyCustomSearchBoxReset',
      submit: 'MyCustomSearchBoxSubmit',
      loadingIndicator: 'MyCustomSearchBoxLoadingIndicator'
    }
  }),
  instantsearch.widgets.poweredBy({
    container: '#powered-by',
    cssClasses: {
      root: 'MyCustomPoweredBy',
      link: [
        'MyCustomPoweredByLink',
        'MyCustomPoweredByLink--subclass',
      ],
    },
  }),
  // customRefinementListWithSearchBox({
  //   attribute: 'categories',
  // }),
  instantsearch.widgets.hits({
    container: '#hits',
    cssClasses: {
      root: 'root-custom-css-class',
      list: 'list-custom-css-class',
      item: 'item-custom-css-class',
    },
    templates: {
      item(hit, { html, components, sendEvent }) {
        return html`
          <button class="daisy-card daisy-card-compact items-center shadow-xl" onClick="${(event) => {
            document.getElementById('my_modal_'+ hit.objectID).showModal();
            sendEvent('click', hit, '点开 '+hit.slug)
          }}">
            <figure>
              <img src="${hit.cover}" alt="${hit.slug}" />
            </figure>
            <div class="daisy-card-body">
              <h2 class="daisy-card-title text-center block text-base" onclick="my_modal_2.showModal()">${components.Highlight({ hit, attribute: 'slug' })}</h2>
            </div>
          </button>
          <dialog id="my_modal_${hit.objectID}" class="daisy-modal">
            <div class="daisy-modal-box w-10/12 max-w-5xl daisy-card lg:card-side">
              <figure>
                <img src="${hit.cover}" alt="${hit.slug}" />
              </figure>
              <div class="daisy-card-body">
                <h2 class="daisy-card-title border-b-2 mb-4 w-fit border-info">${hit.slug}</h2>
                <h3 class="font-normal text-base text-info">食材</h3>
                <p class="">${hit.foodstuffs}</p>
                <h3 class="font-normal text-base text-info">配料</h3>
                <p class="">${hit.ingredient}</p>
                <h3 class="font-normal text-base text-info">做法</h3>
                <p class="">${hit.method}</p>
                <h3 class="font-normal text-base text-info">注意事项</h3>
                <p class="">${hit.tips}</p>
              </div>
            </div>
            <form method="dialog" class="daisy-modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
        `;
      },
      empty: '<div>没有关于 {{ query }} 的菜品</div>'
    },
  }),
  // instantsearch.widgets.clearRefinements({
  //   container: '#clear-refinements',
  // }),
  // instantsearch.widgets.refinementList({
  //   container: '#brand-list',
  //   attribute: 'categories',
  //   // transformItems(items) {
  //   //   return items.filter(item => item.count >= 2);
  //   // }
  // }),
  instantsearch.widgets.configure({
    filters: 'categories:"烹饪手记"',
    // disjunctiveFacetsRefinements: {
    //   categories: ['烹饪手记'],
    // },
    hitsPerPage: 8,
  }),
  instantsearch.widgets.pagination({
    container: '#pagination',
    cssClasses: {
      list: 'daisy-join',
      item: [
        'daisy-join-item',
        'daisy-btn',
      ],
      selectedItem: 'daisy-btn-active',
    }
  }),
]);

search.start();

// const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
//   key: 'instantsearch',
//   limit: 3,
//   transformSource({ source }) {
//     return {
//       ...source,
//       onSelect({ setIsOpen, setQuery, item, event }) {
//         onSelect({ setQuery, setIsOpen, event, query: item.label });
//       },
//     };
//   },
// });

// const querySuggestionsPlugin = createQuerySuggestionsPlugin({
//   searchClient,
//   indexName: 'instant_search_demo_query_suggestions',
//   getSearchParams() {
//     return recentSearchesPlugin.data.getAlgoliaSearchParams({ hitsPerPage: 6 });
//   },
//   transformSource({ source }) {
//     return {
//       ...source,
//       sourceId: 'querySuggestionsPlugin',
//       onSelect({ setIsOpen, setQuery, event, item }) {
//         onSelect({ setQuery, setIsOpen, event, query: item.query });
//       },
//       getItems(params) {
//         if (!params.state.query) {
//           return [];
//         }

//         return source.getItems(params);
//       },
//     };
//   },
// });

// autocomplete({
//   container: '#searchbox',
//   openOnFocus: true,
//   detachedMediaQuery: 'none',
//   onSubmit({ state }) {
//     setInstantSearchUiState({ query: state.query });
//   },
//   plugins: [recentSearchesPlugin, querySuggestionsPlugin],
// });

// function setInstantSearchUiState(indexUiState) {
//   search.mainIndex.setIndexUiState({ page: 1, ...indexUiState });
// }

// function onSelect({ setIsOpen, setQuery, event, query }) {
//   if (isModifierEvent(event)) {
//     return;
//   }

//   setQuery(query);
//   setIsOpen(false);
//   setInstantSearchUiState({ query });
// }

// function isModifierEvent(event) {
//   const isMiddleClick = event.button === 1;

//   return (
//     isMiddleClick ||
//     event.altKey ||
//     event.ctrlKey ||
//     event.metaKey ||
//     event.shiftKey
//   );
// }
