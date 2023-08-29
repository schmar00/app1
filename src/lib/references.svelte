<script>
import {dataArr, resultsEN} from './fetch';
import * as Icon from 'svelte-heros-v2';

function refText(txt){
    let r = txt.includes('|')
    ? txt.split('|').filter(a=>!a.includes('@'))[0]
    : txt
    
    return r.includes(':')
    ? '<span class="font-semibold">' + r.split(':').shift() + ':</span>' + r.split(':').slice(1)
    : r
}


</script>


<!-- <Bell size="30" class="text-red-700 dark:text-green-700" /> -->

{#if $dataArr.filter(a=>a[1]=='http://purl.org/dc/terms/references').length>0}
    <ul class="text-xs text-left font-medium text-teal-900 rounded-lg dark:border-gray-600 dark:text-gray-300">
        {#each [...new Set($dataArr.filter(a=>a[1]=='http://purl.org/dc/terms/references').map(a=>a[3]))] as ref}
            <li class="mt-1.5 ">
                <span><Icon.BookOpen size="15" class="mr-1 inline-flex" /></span><!-- fill-black -->
                <span class="">{@html refText(ref.split('§')[0])}</span>
                {#if ref.split('§')[1]!==undefined}
                <span class="inline-flex">
					<a href={ref.split('§')[1]} target="_blank" rel="noreferrer">
						<Icon.FolderArrowDown size="15" class="text-gray-900 dark:border-gray-600 dark:text-white mb-[-3px]" /><!-- fill-black -->
					</a>
				</span>
                 
                {/if}
            </li>
        {/each}
    </ul>
{/if}

