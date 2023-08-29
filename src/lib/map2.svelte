<script>
    //import { onDestroy } from 'svelte';
    import * as L from 'leaflet';
    import 'leaflet/dist/leaflet.css';
    import { dataArr, resultsDE, resultsEN } from './fetch';

    let map;
    let mapKey = {}

    /**
     * @param {string | HTMLElement} container
     */
    function createMap(container) {
        // @ts-ignore
        let m = L.map(container).setView(['47.7','13.5'], 5);
        /* L.tileLayer("https://{s}.wien.gv.at/basemap/bmaphidpi/normal/google3857/{z}/{y}/{x}.jpeg", {
            'subdomains': ['maps', 'maps1', 'maps2', 'maps3', 'maps4']
        }).addTo(m); */
        L.tileLayer.wms('https://ows.mundialis.de/services/service?', {
               'layers': 'OSM-WMS',
               'opacity': '0.6',
               'format': 'image/png',
               'attribution': '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>, <a href="https://geoera.eu/projects/hike10/"> GeoERA - HIKE Fault Database</a>'
        }).addTo(m);
        return m;
    }

    /**
     * @param {string | HTMLElement} container
     */
    function mapAction(container) {
        map = createMap(container);

        // @ts-ignore
        let st = [$dataArr[0][5]]
        if ($resultsDE.hasOwnProperty('narrower1')){ //transitive???
            st.push($resultsDE['narrower1'].map(a=>a.split('§')[0]))
        }

        //console.log(selectedURIs);
        let wfsFeatures = [];
        const nql = 40; //network query limit defined by SQL DB proxy => max length "where in"
        st = st.map(a=>a.split('/').slice(-1));
        let searchIDs = new Array(Math.ceil(st.length / nql))
            .fill()
            .map(_ => st.splice(0, nql));
        let promises = [];

        console.log(searchIDs);
        searchIDs.forEach(s_part => {
            let orPart = (s_part.length > 1) ? ['<ogc:Or>', '</ogc:Or>'] : ['', ''];
            //console.log(orPart);
            let ogcFilter = `<ogc:Filter>
                                <ogc:And>
                                ${orPart[0]}
                                    <ogc:PropertyIsEqualTo>
                                    <ogc:PropertyName>ms:concept_id</ogc:PropertyName>
                                    <ogc:Literal>
                                    ${s_part.join(`</ogc:Literal>
                                        </ogc:PropertyIsEqualTo>
                                        <ogc:PropertyIsEqualTo>
                                            <ogc:PropertyName>ms:concept_id</ogc:PropertyName>
                                        <ogc:Literal>`)}
                                    </ogc:Literal>
                                    </ogc:PropertyIsEqualTo>
                                ${orPart[1]}
                                <ogc:Or>
                                <ogc:PropertyIsGreaterThan>
                                    <ogc:PropertyName>ms:depth</ogc:PropertyName>
                                    <ogc:Literal>-100</ogc:Literal>
                                </ogc:PropertyIsGreaterThan>
                                <ogc:PropertyIsNull>
                                    <ogc:PropertyName>ms:depth</ogc:PropertyName>
                                </ogc:PropertyIsNull>
                                </ogc:Or>
                                </ogc:And>
                                </ogc:Filter>`;
            //console.log(ogcFilter)

            promises.push(
                fetch(
                    (`https://geusegdi01.geus.dk/egdi/wfs/3034/
                    ?SERVICE=WFS
                    &VERSION=1.0.0
                    &REQUEST=GetFeature
                    &TYPENAME=hike_all_faults_layer
                    &MAXFEATURES=100000
                    &Filter=${ogcFilter}
                    &outputformat=geojson`).replace(/\r?\n|\r|\s/g, "")
                )
                .then(res => res.text())
                .then(data => { //console.log(JSON.parse(data.toString()).features);
                    wfsFeatures = wfsFeatures.concat(JSON.parse(data.toString()).features);
                })
                .catch(error => {
                    alert('Error when querying the WFS');
                })
            );
        });

        Promise.all(promises).then(() => {
            let faultLines = wfsFeatures.map(a => [a.geometry.coordinates.map(b => [b[1],b[0]]), a.properties.local_name]);
            //try catch??
            let coords = faultLines.map(a => a[0]).flat();
            let avgX = coords.map(a => a[0]).reduce((a,c) => a + c, 0) / coords.length;
            let avgY = coords.map(a => a[1]).reduce((a,c) => a + c, 0) / coords.length;
            console.log(avgX, avgY);

            for (let f of faultLines) {
                L.polyline(f[0], {color: 'red'})
                .addTo(map)
                .bindTooltip(f[1], { direction: 'bottom', offset: [0, 0], opacity: 0.80,});
            }
            map.setView([avgX, avgY], 8);
        });

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
    {#if $dataArr.length > 0 && $dataArr[0][5].includes('hike')}
        <div use:mapAction class="h-48 min-h-full dark:brightness-[0.85] hover:dark:brightness-[0.90] transition-all duration-300 cursor-pointer filter dark:invert dark:hue-rotate-[150deg]" />
    {/if}
{/key}
    