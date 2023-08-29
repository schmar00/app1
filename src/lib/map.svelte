<script>
    //import { onDestroy } from 'svelte';
    import * as L from 'leaflet';
    import 'leaflet/dist/leaflet.css';
    import { dataArr, resultsDE } from './fetch';

    let map;
    let mapKey = {}

    const svgIcon = L.divIcon({
        html: `<svg fill="MediumVioletRed" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path clip-rule="evenodd" fill-rule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"></path>
            </svg>`,
        className: "",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
    });

    /**
     * @param {string | HTMLElement} container
     */
    function createMap(container) {
        // @ts-ignore
        let m = L.map(container).setView($resultsDE.lat_long0[0].split(',').map(a=>parseFloat(a)), 8);
        L.tileLayer("https://{s}.wien.gv.at/basemap/bmaphidpi/normal/google3857/{z}/{y}/{x}.jpeg", {
            'subdomains': ['maps', 'maps1', 'maps2', 'maps3', 'maps4']
        }).addTo(m);
        return m;
    }

    //https://github.com/pointhi/leaflet-color-markers
    const greenIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    /**
     * @param {string | HTMLElement} container
     */
    function mapAction(container) {
        map = createMap(container);
        // @ts-ignore
        for (let pts of $resultsDE.lat_long0) { //mapCoords
            new L.Marker(pts.split(','), {icon: svgIcon}).addTo(map).bindTooltip("type location", { direction: 'bottom', offset: [0, 0], opacity: 0.80,});
        }
        return {
            destroy: () => {
                map.off();
                map.remove();
            },
        };
    }

    $: $dataArr, mapKey = {} //refresh when URI and coords changed

</script>

<svelte:head>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css" />
</svelte:head>
    {#key mapKey}
        {#if $dataArr.length > 0 && $resultsDE.hasOwnProperty('lat_long0')}
            <div use:mapAction class="h-48 min-h-full dark:brightness-[0.85] hover:dark:brightness-[0.90] transition-all duration-300 cursor-pointer filter dark:invert dark:hue-rotate-[150deg]" />
        {/if}
    {/key}
    