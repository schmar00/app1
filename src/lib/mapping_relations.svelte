<script>
    // @ts-nocheck
 import { get, dataArr, resultsDE, resultsEN } from './fetch.js';
 import { lang } from './lang.js';

 let map_rel1 = ['exactMatch1', 'closeMatch1', 'sameAs1', 'seeAlso1', 'broadMatch1', 'narrowMatch1', 'relateMatch1'];
 let map_rel2 = ['exactMatch2', 'closeMatch2', 'sameAs2', 'seeAlso2', 'broadMatch2', 'narrowMatch2', 'relateMatch2'];

 function translate(id, lang){
    let label = {
        de:['Mappings', 'exactMatch', 'closeMatch', 'sameAs', 'seeAlso', 'broadMatch', 'narrowMatch', 'relateMatch', 'erweiterte mapping Relationen'],
        en:['mapping relations', 'exactMatch', 'closeMatch', 'sameAs', 'seeAlso', 'broadMatch', 'narrowMatch', 'relateMatch', 'extended mapping relations']
    }
    return label[lang][id]
 }

 function createPrefix(uri){
    const nameSpaces = ['inspire', 'geosciml', 'dbpedia', 'wikidata', 'freebase', 'bgs', 'geolba', ''];
    return nameSpaces.filter(a => uri.includes(a))[0]  
 }

</script>

<div class="text-left">
    {#if $dataArr.length > 1}<!-- <p class="text-xl font-semibold text-lime-500 dark:text-gray-300">{translate(0, $lang)}</p> -->
        {#each map_rel1 as rel, i}
          {#if $lang=='de' ? $resultsDE[rel] : $resultsEN[rel]}<p class="text-lg font-semibold text-gray-900 dark:text-gray-300">{translate(i + 1, $lang)}</p>
            {#each $lang=='de' ? $resultsDE[rel] : $resultsEN[rel] as c}
                <button on:click={()=>{c.split('§')[0].includes('geolba') ? get([c.split('§')[0]]) : window.open(c.split('§')[0], '_blank').focus()}} 
                    class="cursor-pointer text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-2 py-1 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                    {createPrefix(c.split('§')[0])}:{c.split('§')[1]}
                </button>
            {/each}
          {/if}
        {/each}
        {#if Object.keys($lang=='de' ? $resultsDE : $resultsEN).filter(x => map_rel2.includes(x)).length > 0}<details>
        <summary class="text-gray-500 dark:text-gray-500">{translate(8, $lang)}</summary>
          {#each map_rel2 as rel, i}
            {#if $lang=='de' ? $resultsDE[rel] : $resultsEN[rel]}<p class="text-lg text-gray-500 dark:text-gray-500">{translate(i + 1, $lang)}</p>
              {#each $lang=='de' ? $resultsDE[rel] : $resultsEN[rel] as c}
                  <button on:click={()=>{c.split('§')[0].includes('geolba') ? get([c.split('§')[0]]) : window.open(c.split('§')[0], '_blank').focus()}} 
                    class="cursor-pointer text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-2 py-1 mr-2 mb-2 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                    {createPrefix(c.split('§')[0])}:{c.split('§')[1]}
                  </button>
              {/each}
            {/if}
          {/each}
        </details>
        {/if}
    {/if} 
</div>


<!-- <div class="text-left leading-loose text-gray-900 dark:text-gray-300">
    {#if $dataArr.length > 1}
    <p class="text-xl font-bold">mapping relations</p>
 
        {#if $resultsDE.hasOwnProperty('exactMatch1')}<p class="font-semibold">vergleichbare Begriffe:</p>
            {#each $resultsDE.exactMatch1 as c}<a href={c.split('§')[0]} class="cursor-pointer cursor-pointer text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-2 py-1 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                {c.split('§')[0].replace('data.','').replace('resource.','').split('/')[2].split('.')[0]}:{c.split('§')[1]}</a><br>{/each}
        {/if}
        {#if $resultsDE.hasOwnProperty('sameAs1')}
            {#each $resultsDE.sameAs1 as c}<a href={c.split('§')[0]} class="cursor-pointer cursor-pointer text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-2 py-1 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                {c.split('§')[0].replace('rdf.','').replace('sw.','').split('/')[2].split('.')[0]}:{c.split('§')[1]}</a><br>{/each}
        {/if}
        {#if ($resultsDE.hasOwnProperty('exactMatch1') || $resultsDE.hasOwnProperty('sameAs1'))}
        <details>
          <summary>more</summary>
            {#if $resultsDE.hasOwnProperty('exactMatch2')}
                {#each $resultsDE.exactMatch2 as c}<a href={c.split('§')[0]} class="cursor-pointer cursor-pointer text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-2 py-1 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                    {c.split('§')[0].replace('rdf.','').replace('sw.','').split('/')[2].split('.')[0]}:{c.split('§')[1]}</a><br>{/each}
            {/if}
            {#if $resultsDE.hasOwnProperty('sameAs2')}
                {#each $resultsDE.sameAs2 as c}<a href={c.split('§')[0]} class="cursor-pointer cursor-pointer text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-2 py-1 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                    {c.split('§')[0].replace('rdf.','').replace('sw.','').split('/')[2].split('.')[0]}:{c.split('§')[1]}</a><br>{/each}
            {/if}
        </details>
        {/if}

        {#if $resultsDE.hasOwnProperty('closeMatch1')}<p>ähnliche Begriffe:</p>
            {#each $resultsDE.closeMatch1 as c}<a href={c.split('§')[0]} class="cursor-pointer cursor-pointer text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-2 py-1 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                {c.split('§')[0].replace('data.','').replace('resource.','').split('/')[2].split('.')[0]}:{c.split('§')[1]}</a><br>{/each}
        {/if}
        {#if ($resultsDE.hasOwnProperty('closeMatch2'))}
        <details>
          <summary>more</summary>
            {#if $resultsDE.hasOwnProperty('closeMatch2')}
                {#each $resultsDE.closeMatch2 as c}<a href={c.split('§')[0]} class="cursor-pointer cursor-pointer text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-2 py-1 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                    {c.split('§')[0].replace('rdf.','').replace('sw.','').split('/')[2].split('.')[0]}:{c.split('§')[1]}</a><br>{/each}
            {/if}
        </details>
        {/if}

 
    {/if}

</div> -->
