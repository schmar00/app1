<script>
    import FuseSearch from "./fuseSearch.svelte";
    
    const endpoints = [
        'https://resource.geolba.ac.at/PoolParty/sparql/lithology' ,
        'https://resource.geolba.ac.at/PoolParty/sparql/GeologicUnit',
        'https://resource.geolba.ac.at/PoolParty/sparql/GeologicTimeScale',
        'https://resource.geolba.ac.at/PoolParty/sparql/tectonicunit',
        'https://resource.geolba.ac.at/PoolParty/sparql/mineral' ,
        'https://resource.geolba.ac.at/PoolParty/sparql/minres',
        'https://resource.geolba.ac.at/PoolParty/sparql/structure',
        'https://resource.geolba.ac.at/PoolParty/sparql/geoera'/* ,
        'https://resource.geolba.ac.at/PoolParty/sparql/ref' */
      ];
  
  </script>
  <div class="">
    <FuseSearch {endpoints}/>
  </div>
  