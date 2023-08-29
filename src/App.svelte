<script>
  import { onMount } from "svelte";
  import Search from "./lib/search.svelte";
  import { DarkMode } from 'flowbite-svelte';
  import Details from "./lib/details.svelte";
  import Logo from "./assets/logo.svelte";
  import LogoNegativ from "./assets/logo_negativ.svelte";
  import AtFlag from "./assets/at_flag.svelte";
  import UkFlag from "./assets/uk_flag.svelte";
  import { lang } from './lib/lang.js';
  import References from "./lib/references.svelte";
  import SemRel from "./lib/sem_rel.svelte";
  import Images from "./lib/images.svelte";
  import MappingRelations from "./lib/mapping_relations.svelte";
  import Map from "./lib/map.svelte";
  import Map2 from "./lib/map2.svelte";
  //import DataViewer from "./lib/dataViewer.svelte";

  let addLang = ['de','es']; //available languages
  let langDE; //if only de or en, later may extended

  if (addLang.includes(navigator.language.split('-')[0])){
    lang.set(navigator.language.split('-')[0]);
    langDE = true;
  } else {
    lang.set('en');
    langDE = false;
  }
  
  function toggleLang() {
		lang.set(langDE?'en':'de');
    langDE=!langDE;
    newFuse()
	}

  let unique = {}
  function newFuse() {
    unique = {}
  }

  let dark
  onMount(() => 
    {if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
       dark = true;
    } else {
       dark = false;
    }}
  )
  
  function toggleTheme(){
    dark = parseInt(getComputedStyle(document.getElementById('darkIcon')).backgroundColor.split(',')[1]) < 120 ? true : false
  }
  
</script>

<body class="bg-white dark:bg-gray-900 pt-5 pb-96">

  <a href={null} title="change language" on:click={toggleLang} class="cursor-pointer absolute top-1 right-10 text-gray-900 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-2.5 mr-2 mb-2 dark:border-[#001a13] dark:text-white dark:hover:bg-gray-700 dark:hover:border-indigo-600 dark:focus:ring-gray-700">
    {#if langDE}
      <AtFlag />
    {:else}
      <UkFlag />
    {/if}
  </a>
  <a href={null} title="change theme" class="absolute top-1 right-1" on:click={toggleTheme}>
    <DarkMode id="darkIcon"/>
  </a>
  <div id="logo" class="w-36 fixed top-4 left-5 z-10" on:loadstart={toggleTheme}>
    {#if dark}
      <LogoNegativ />
    {:else}
      <Logo />  
    {/if}
  </div>

  <div class="container mx-auto mt-20 lg:max-w-screen-lg text-md">
    <div class="grid md:grid-cols-3 gap-2 grid-flow-row-dense">
      <div class="rounded-md p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        {#key unique}
        <div class="">
          <Search />
        </div>
        {/key}
      </div>
      <div class="md:order-first md:col-span-2 md:row-span-3 p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <Details bind:dark/>
      </div>
      <div class="md:row-span-2 p-0 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <Map />
      </div>
      <div class="max-h-96 overflow-auto rounded-md p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <References />
      </div>
      <div class="max-h-96 overflow-auto p-2 dark:text-gray-300 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <SemRel />
      </div>
      <div class="max-h-96 overflow-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <Images />
      </div>
      <div class="max-h-96 overflow-auto p-2 md:row-span-2 dark:text-gray-300 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <MappingRelations />
      </div>
      <div class="bg-sky-500 rounded-md p-0">
       <Map2 />
      </div>
      <div class="bg-green-500 rounded-md p-4">
        
      </div>
      <div class="bg-red-500 rounded-md p-4">10</div>

    </div>

  </div>

 
</body>

<style>
	:global(body) {
		transition: background-color 0.5s
	}

</style>