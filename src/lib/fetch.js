import { writable, derived } from 'svelte/store'
export let dataArr = writable([])

const query1 = `PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>
				PREFIX skos:<http://www.w3.org/2004/02/skos/core#>
				PREFIX dcterms:<http://purl.org/dc/terms/>
				SELECT ?dist ?uri ?p ?o
				(GROUP_CONCAT(DISTINCT(IF(LANG(?l), CONCAT(?l,'@',LANG(?l)), STR(?l))); SEPARATOR='|') AS ?label)
				(IF(?label='',REPLACE(STR(?o), "^.*/([^/]*)$", "$1"),?label) as ?altlabel)
				(IF(COUNT(DISTINCT(?c))=1,MIN(?c),'') AS ?uri2)
				WHERE {
							VALUES ?uri {<§>}
							{?uri ?p ?l FILTER (!isIRI(?l)) BIND('' AS ?o) BIND(0 AS ?dist)}
											UNION
							{{?uri ?p ?o BIND(1 AS ?dist)}
											UNION
							{?uri ?b ?c . ?c ?p ?o . FILTER isIRI(?c) FILTER(?uri != ?o) BIND(2 AS ?dist)}
				FILTER isIRI(?o)}
				VALUES ?pl {skos:prefLabel rdfs:label dcterms:bibliographicCitation}
				OPTIONAL{?o ?pl ?l}
				}
				GROUP BY ?dist ?uri ?p ?o
				ORDER BY ?dist ?p`;

const findLabels = `PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>
					PREFIX dcterms:<http://purl.org/dc/terms/>
					SELECT ?s (GROUP_CONCAT(DISTINCT(IF(LANG(?l), CONCAT(?l,'@',LANG(?l)), STR(?l))); SEPARATOR='|') AS ?label)
					(GROUP_CONCAT(DISTINCT(?link); SEPARATOR='|') AS ?source)
					WHERE
					{ VALUES ?s {<§>} VALUES ?p {rdfs:label dcterms:bibliographicCitation}
					  VALUES ?p2 {dcterms:source}
						?s ?p ?l 
						OPTIONAL {?s ?p2 ?link}
					}
					GROUP BY ?s`;

const endpoint = {
	gba: 'https://resource.geolba.ac.at/PoolParty/sparql/',
	gsml: '',
	wikidata: 'https://query.wikidata.org/sparql',
	dbp: 'https://dbpedia.org/sparql'
}

/**
 * @param {any[]} uriArr
 * @param {string} qry
 */
function restQuery(uriArr,qry) { //only uriArr from same endpoint
	let sparqlScript = qry.replaceAll('§',uriArr.join('> <'));

	switch (uriArr[0].split('/')[2]) {
		case 'resource.geolba.ac.at':
			return `${endpoint.gba}${uriArr[0].split('/').at(-2)}?query=${encodeURIComponent(sparqlScript)}&format=application/json`
		case 'data.geoscience.earth':
			return `${endpoint.gba}geoera?query=${encodeURIComponent(sparqlScript)}&format=application/json`
		case 'www.wikidata.org':
			return `${endpoint.wikidata}?query=${encodeURIComponent(sparqlScript)}&format=json`
		case 'dbpedia.org':
			return `${endpoint.dbp}?query=${encodeURIComponent(sparqlScript)}&format=application/json`
		default:
			return ''
	}
}

/**
 * @param {any[]} datax
 * @param {string} u
 */
function emptyLabel(datax,u){
	//console.log('emptyLabel: ' + datax.map(a=>a[3]+a[2]).filter(a=>a.indexOf(u)==0))
	return [...new Set(datax.map(a=>a[3]+a[2]).filter(a=>a.indexOf(u)==0))] //uris to retrieve missing labels
}

/**
 * @param {any[]} uriArr
 */
export function get(uriArr) {
	const extResources = ['http://resource.geolba.ac.at/ref/','http://resource.geolba.ac.at/geoera/', 'http://www.wikidata.org/entity/'];
	let datax, addLabels
	fetch(restQuery(uriArr, query1))
		.then(r => r.json())
		.then(data => { //sem. dist 1
			datax = data.results.bindings.map(a => [a.dist.value, a.p.value, a.o.value, a.label.value, a.altlabel.value, a.uri.value, a.uri2.value])
			.filter(a => a[1] !== 'http://purl.org/dc/terms/isReferencedBy')
			dataArr.set(data.results.bindings.map(a => [a.dist.value, a.p.value, a.o.value, a.label.value, a.altlabel.value, a.uri.value, a.uri.value])
			.filter(a => a[1] !== 'http://purl.org/dc/terms/isReferencedBy'));
			//console.log(datax);

			let actResources = extResources.filter(a => emptyLabel(datax, a).length > 0);
			//console.log('actResources: ' + actResources);
			//########### OPTIONAL: lookup other ressources ###########################################
			 Promise.all(actResources.map(a => fetch(restQuery(emptyLabel(datax, a), findLabels))))
				.then(r => Promise.all(r.map(res => res.json())))
				.then(t => {
					//console.log(t);
					let newLabels = Object.fromEntries(t.map(a => a.results.bindings).flat()
					.map(a => [a.s.value, a.label.value + '§' + a.source.value]));
					//console.log(newLabels);
					let datay = [];
					for (let i of datax) {
						if (newLabels.hasOwnProperty(i[3] + i[2])) {
							datay.push([i[0], i[1], i[2], newLabels[i[2]], i[4], i[5], i[6]]);
						} else {
							datay.push(i[3]==''?[i[0],i[1],i[2],i[2].split(/\/|#/).at(-1), i[4], i[5], i[6]]:i);
						}
					}
					dataArr.set(datay);
					console.log('datay: ', datay)
				}); 
		})
}

function createLabel(prop, txt, language){
	let noTag = ['prefLabel', 'definition', 'scopeNote', 'broader', 'narrower', 'related', 'references']; //remove lang tags
	if(noTag.includes(prop.split(/\/|#/).at(-1))){
		return txt.includes('@'+language) 
			? txt.split('|').find(a=>a.includes('@'+language)).split('@')[0]
			: txt.split('|')[0].split('@')[0] //good for de/en
	} else { 
		return txt.includes('@')
			? txt.replaceAll('@','<span class="§lang§">').replaceAll('|','</span>, ') + '</span>'
			: txt.replaceAll('|',', ')
	}
}

export let resultsEN = derived(dataArr, ($dataArr) => { //, set) => {
	if ($dataArr !== undefined) {
		return $dataArr.map(a => [a[1].split(/\/|#/).at(-1) + a[0], a[0]=='0'?createLabel(a[1], a[3], 'en'):`${a[2]}§${createLabel(a[1], a[3], 'en')}`])
			.reduce((acc, post) => {
				let [category, id] = post;
				return {...acc, [category]: [...(acc[category] || []), id]};
			}, {})
	} else {
		return
	}
});

export let resultsDE = derived(dataArr, ($dataArr) => { //, set) => {

	if ($dataArr !== undefined) {

		 console.log($dataArr.map(a => [a[1].split(/\/|#/).at(-1) + a[0], a[0]=='0'?createLabel(a[1], a[3], 'de'):`${a[2]}§${createLabel(a[1], a[3], 'de')}`])
		.reduce((acc, post) => {
			let [category, id] = post;
			return {...acc, [category]: [...(acc[category] || []), id]};
		}, {})) 
		
		return $dataArr.map(a => [a[1].split(/\/|#/).at(-1) + a[0], a[0]=='0'?createLabel(a[1], a[3], 'de'):`${a[2]}§${createLabel(a[1], a[3], 'de')}`])
			.reduce((acc, post) => {
				let [category, id] = post;
				return {...acc, [category]: [...(acc[category] || []), id]};
			}, {})

	} else {
		return
	}
});



  
  