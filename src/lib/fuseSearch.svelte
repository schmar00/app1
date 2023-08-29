
<script>
    import Fuzzy from "svelte-fuzzy";
    import { onMount } from 'svelte';
    import Xcircle from "../assets/xcircle.svelte";
    import { get } from "./fetch";
    import { lang } from './lang.js';
    import GseuIcon from "../assets/GSEU_icon.svg";
    import GseuInvertIcon from "../assets/GSEU_invert_icon.svg";
    //import * as Icon from 'svelte-heros-v2';
    //export let dark;
    let langValue;
    lang.subscribe(value => {
      langValue = value;
    });
    
    let data = [];
    export let endpoints;

    let sparql = `PREFIX skos:<http://www.w3.org/2004/02/skos/core#>
                  select distinct ?uri ${langValue=='en'?'(?L as ?label)':'(coalesce(?Lx,?L) as ?label)'}
                  where {
                  ?uri skos:prefLabel ?L filter(lang(?L)='en') filter(!regex(str(?L),'\\\\[')) filter(!regex(str(?uri),'geoera/ref'))
                  ${langValue=='en'?'':'optional{?uri skos:prefLabel ?Lx filter(lang(?Lx)="' + langValue + '")}'}
                  }
                  order by strlen(?label)`.replace(/\s\s+/g, ' ');
                  
    onMount(async () => {
      const fetchData = async () => {
        try { //console.log(sparql);
          const response = await Promise.all(
            endpoints.map((/** @type {string} */ url) => fetch(url + '?query=' + encodeURIComponent(sparql) + '&format=application/json').then(res => res.json()))
          )
          data = response.map(a=>a.results.bindings.map((/** @type {{ label: { value: any; }; uri: { value: any; }; }} */ a) => ({label: a.label.value, uri: a.uri.value}))).flat();
          //console.log(data);
        } catch (error) {
          //console.log("Error", error)
        }
      }
      fetchData()
    });
  
    let query = "";
  
    // Fuse.js options https://fusejs.io/api/options.html
    let options = { 
      keys: ["label"], 
      shouldSort: true, 
      minMatchCharLength: 3,
      threshold: 0.6,  //At what point does the match algorithm give up 0..1
      distance: 100
    };
  
    let result = [];
  
    // for drop down list on Safari important! style="position: fixed; transform: translateZ(100px); z-index: 1;"
  </script>
 
  <label for="default-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Fuse SEARCH ({data.length})</label>
  <div class="flex">
    <input type="text" id="default-input" class="border-r-0 rounded-l-lg bg-gray-50 text-gray-900 focus:ring-gray-300 focus:ring-0 focus:border-gray-300 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-600 dark:focus:border-gray-600" placeholder="search" bind:value={query} />
    <a href={null} class="cursor-pointer inline-flex items-center px-3 text-sm text-gray-900 bg-gray-50 border border-l-0 border-gray-300 rounded-r-lg dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600" on:click={() => (query = "")}>
        <Xcircle />
    </a>
    <button type="submit" class="p-2.5 ml-2 text-sm font-medium text-white bg-teal-700 rounded-lg border border-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-teal-800">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        <span class="sr-only">Search</span>
    </button>
  </div>
  
 
  <Fuzzy {query} {data} {options} bind:result />
  
  <div style="transform: translateZ(100px); z-index: 1;" class="z-50 absolute fixed mt-2 text-left text-sm font-medium text-gray-900 bg-white border border-none rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white ">
    <ul class="ml-2 overflow-y-auto text-gray-700 dark:text-gray-200" aria-labelledby="dropdownUsersButton">
      {#each result as item, index}
        {#if index < 7}
          <li>
            <a href={null} on:click={(e)=>{get([item.uri]); query='';}} class="flex w-full px-4 py-2 border-b border-gray-200 text-sm text-gray-900 cursor-pointer dark:text-white hover:bg-gray-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 hover:rounded-lg focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white">
              {#if item.uri.includes('geoera')}
                <img class="w-3 -ml-2 mr-1" src={GseuIcon} alt="" />
              {/if}
              <span class="whitespace-nowrap">
                {#if Array.isArray(item.label)}
                  {item.label.map((/** @type {{ text: any; }} */ a) => a.text).join('')}
                {:else}
                  {item.label}
                {/if}
              </span>
            </a>
          </li>
        {/if}
      {/each}
    </ul>
  </div>
