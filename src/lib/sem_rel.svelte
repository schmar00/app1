<script>
    // @ts-nocheck
 import { get, dataArr, resultsDE, resultsEN } from './fetch.js';
 import { lang } from './lang.js';

 let sem_rel1 = ['broader1', 'narrower1', 'related1'];
 let sem_rel2 = ['broader2', 'narrower2', 'related2'];

 function translate(id, lang){
    let label = {
        de:['semantische Relationen', 'übergeordnet', 'untergeordnet', 'verwandt', 'erweiterte sem. Relationen'],
        en:['semantic relations', 'broader', 'narrower', 'related', 'extended sem. relations']
    }
    return label[lang][id]
 }



</script>

<div class="text-left">
    {#if $dataArr.length > 1}<p class="text-xl font-semibold text-lime-500 dark:text-gray-300">{translate(0, $lang)}</p>
        {#each sem_rel1 as rel, i}
          {#if $lang=='de' ? $resultsDE[rel] : $resultsEN[rel]}<p class="text-lg font-semibold text-gray-900 dark:text-gray-300">{translate(i + 1, $lang)}</p>
            {#each $lang=='de' ? $resultsDE[rel] : $resultsEN[rel] as c}
                <button on:click={(e)=>{get([c.split('§')[0]])}} 
                    class="cursor-pointer text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-2 py-1 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                    {c.split('§')[1]}
                </button>
            {/each}
          {/if}
        {/each}
        {#if Object.keys($lang=='de' ? $resultsDE : $resultsEN).filter(x => sem_rel2.includes(x)).length > 0}<details>
        <summary class="text-gray-500 dark:text-gray-500">{translate(4, $lang)}</summary>
          {#each sem_rel2 as rel, i}
            {#if $lang=='de' ? $resultsDE[rel] : $resultsEN[rel]}<p class="text-lg text-gray-500 dark:text-gray-500">{translate(i + 1, $lang)}</p>
              {#each $lang=='de' ? $resultsDE[rel] : $resultsEN[rel] as c}
                  <button on:click={(e)=>{get([c.split('§')[0]])}} 
                    class="cursor-pointer text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-2 py-1 mr-2 mb-2 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                    {c.split('§')[1]}
                  </button>
              {/each}
            {/if}
          {/each}
        </details>
        {/if}
    {/if} 
</div>
