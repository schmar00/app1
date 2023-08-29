<script>
// @ts-nocheck

import { dataArr, resultsDE, resultsEN } from './fetch.js';
import { lang } from './lang.js';
import Gseu from '../assets/GSEU.svelte';
import GseuInvert from '../assets/GSEU_invert.svelte';

const langCls = `bg-gray-500 text-white text-[10px] font-bold mr-2 ml-1 px-0.5 py-0 rounded dark:bg-gray-400 dark:text-gray-800`;
export let dark;

</script>
<div class="text-left relative text-gray-700 dark:text-gray-400">
    {#if $dataArr.length > 1}
    <pre class="text-sm mb-2 text-gray-900 dark:text-white">URI: {$dataArr[0][5]}</pre>
    {#if $dataArr[0][5].includes('geoera')}
    <div class="w-20 z-8 absolute top-9 right-2">
        {#if dark}
          <GseuInvert />
        {:else}
          <Gseu />  
        {/if}
    </div>
    {/if}
    {#if $lang=='de'}
        {#if $resultsDE.hasOwnProperty('prefLabel0')}
            <p class="max-w-lg mb-2 text-3xl font-bold tracking-tight text-lime-500 dark:text-lime-500">{$resultsDE.prefLabel0[0]}</p>
          {#if $resultsDE.hasOwnProperty('altLabel0') || $dataArr.filter(a=>a[1]=='http://www.w3.org/2004/02/skos/core#prefLabel')[0][3].includes('|')}
          <span class="font-semibold text-gray-900 dark:text-gray-300">Bezeichung: </span>
            {#if $resultsDE.hasOwnProperty('altLabel0')}
            <span class="mb-3 font-normal text-gray-700 dark:text-gray-400">{@html $resultsDE.altLabel0[0].replaceAll(',','').replaceAll('§lang§',langCls)}</span>
            {/if}
            <span class="mb-3 font-normal text-gray-700 dark:text-gray-400">{@html ' '+$dataArr.filter(a=>a[1]=='http://www.w3.org/2004/02/skos/core#prefLabel')[0][3].split('|').map(a=>a.replace('@', ' <span class="' + langCls + '">') + '</span>').join(' ')}</span>
          {/if}
        {/if}
        {#if $resultsDE.hasOwnProperty('notation0')}
            <p class="font-semibold text-gray-900 dark:text-gray-300">Notation: <span class="mb-3 font-normal text-lime-700 dark:text-lime-400">{$resultsDE.notation0[0]}</span></p>
        {/if}
        {#if $resultsDE.hasOwnProperty('definition0')}
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{$resultsDE.definition0[0]}</p>
        {/if}
        {#if $resultsDE.hasOwnProperty('scopeNote0')}
            <details>
                <summary class="text-gray-700 dark:text-gray-400">Anmerkungen</summary>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{@html $resultsDE.scopeNote0.join('<br><br>')}</p>
            </details>
        {/if}
        {#if $resultsDE.hasOwnProperty('description0')}
            <details>
                <summary class="text-gray-700 dark:text-gray-400">weitere Beschreibung</summary>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{@html $resultsDE.description0.join('<br><br>')}</p>
            </details>
        {/if}
    {/if}
    {#if $lang=='en'}
        {#if $resultsEN.hasOwnProperty('prefLabel0')}
            <p class="max-w-lg mb-2 text-3xl font-bold tracking-tight text-lime-500 dark:text-lime-500">{$resultsEN.prefLabel0[0]}</p>
          {#if $resultsEN.hasOwnProperty('altLabel0') || $dataArr.filter(a=>a[1]=='http://www.w3.org/2004/02/skos/core#prefLabel')[0][3].includes('|')}
          <span class="font-semibold text-gray-900 dark:text-gray-300">Label: </span>
            {#if $resultsEN.hasOwnProperty('altLabel0')}
            <span class="mb-3 font-normal text-gray-700 dark:text-gray-400">{@html $resultsEN.altLabel0[0].replaceAll(',','').replaceAll('§lang§',langCls)}</span>
            {/if}
            <span class="mb-3 font-normal text-gray-700 dark:text-gray-400">{@html ' ' + $dataArr.filter(a=>a[1]=='http://www.w3.org/2004/02/skos/core#prefLabel')[0][3].split('|').map(a=>a.replace('@', ' <span class="' + langCls + '">') + '</span>').join(' ')}</span>
          {/if}
        {/if}
        {#if $resultsEN.hasOwnProperty('notation0')}
            <p class="font-semibold text-gray-900 dark:text-gray-300">Notation: <span class="mb-3 font-normal text-lime-700 dark:text-lime-400">{$resultsEN.notation0[0]}</span></p>
        {/if}
        {#if $resultsEN.hasOwnProperty('definition0')}
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{$resultsEN.definition0[0]}</p>
        {/if}
        {#if $resultsEN.hasOwnProperty('scopeNote0')}
        <details>
            <summary class="text-gray-700 dark:text-gray-400">notes</summary>
            <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{@html $resultsEN.scopeNote0.join('<br><br>')}</p>
        </details>
        {/if}
        {#if $resultsEN.hasOwnProperty('description0')}
            <details>
                <summary class="text-gray-700 dark:text-gray-400">read more</summary>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{@html $resultsEN.description0.join('<br><br>')}</p>
            </details>
        {/if}
    {/if}
    {:else}
    <div class="blur-sm">
        <img class="object-cover h-full w-full" src="https://www.geosphere.at/bilder/siteroot/datenzentrum.png/@@images/image/great" alt="" />
    </div>
    
    {/if}
</div>



