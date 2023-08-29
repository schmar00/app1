<script>
import {dataArr, get} from './fetch.js';

const imgFormat = ['.jpg', '.png'];


</script>

{#if $dataArr.length > 1}
  {#each $dataArr as src}
    {#if imgFormat.includes(src[2].slice(-4).toLowerCase())}
      {#if src[6]==''}
        <a href="{src[2]}" target="_blank" rel="noreferrer"><img class="object-cover min-h-full" src={src[2]} alt="" /></a>
      {:else}
        <span class="inline-flex cursor-pointer"><a href={null} on:click={()=>get([src[6]])}>
            <img class="w-12 h-12 m-2 rounded-full shadow-lg" src={src[2]} alt="" />
        </a></span>
      {/if}
    {/if}
  {/each}
{/if}

