<script>
    import { onMount } from "svelte";
//https://gisgba.geologie.ac.at/arcgis/rest/services/dataviewer/AT_GBA_DATAVIEWER/MapServer/0

    
    /* let data =[];
    onMount(async () => {
        let queryMap = `(LEGTEXT like 'Wettersteinkalk')`;
		const res = await fetch(`https://gisgba.geologie.ac.at/arcgis/rest/services/dataviewer/AT_GBA_DATAVIEWER/MapServer/0/query?where=${encodeURI(queryMap)}&outFields=*&f=geojson`);
		data = await res.json();
        console.log(data);
	}); */

    /* C01.GBA.DATAVIEWER.GBANR ( type: esriFieldTypeString, alias: GBANR, length: 20 )
    C01.GBA.DATAVIEWER.SHAPE ( type: esriFieldTypeGeometry, alias: SHAPE )
    C01.gba.GE_GeologicFeature.LEGTEXT ( type: esriFieldTypeString, alias: LEGTEXT, length: 500 ) */


</script>
