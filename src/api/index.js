import Vue from 'vue';
import VueResource from 'vue-resource';

Vue.use(VueResource);
const logRequests = !!process.env.DEBUG_API;

const api = {
  url: 'https://api.geocollections.info/'
};

function fetch (child) {
  // logRequests && console.log(`fetching ${child}...`);
    return new Promise((resolve, reject) => {
        Vue.http.get(api.url+child, {}).then(response => {
            resolve(response.body);
            // console.log(response.url)
        }, errResponse => {
            console.log('ERROR: ' + JSON.stringify(errResponse));
            reject(errResponse)
        });
    });
}
function applyMode(mode, separator = '=', queryJoiner = '&') {
  let returnVal = "";
  // if(mode === 'in_baltoscandia') returnVal = `${queryJoiner}in_baltoscandia${separator}1`;
  if (mode === 'in_estonia') returnVal = `${queryJoiner}in_estonia${separator}1`;
  return returnVal
}
export function fetchRock (id,mode) {
    return fetch(`rock/?id=${id}&format=json`)
}
export function fetchRockImages (id,mode) {
  return fetch(`rock_image/?rock_id=${id}&format=json`)
}
export function fetchRockProperties (id,mode) {
  return fetch(`rock_property/?rock_id=${id}&format=json`)
}
export function fetchRockSynonyms (id,mode) {
  return fetch(`rock_synonym/?rock_id=${id}&format=json`)
}
export function fetchRockReferences (id,mode) {
  return fetch(`rock_reference/?rock_id=${id}&format=json`)
}
export function fetchRockLocalities (id,mode) {
  return fetch(`rock_locality/?rock_id=${id}&format=json`)
}
export function fetchRockTreeByRockId (id,mode) {
  return fetch(`rock_tree/?rock_id=${id}&format=json`)
}
export function fetchHierarchy (id,hierarchyString,clsId) {
  return fetch(`rock_tree/?rock_id!=${id}&rock_id__in=${hierarchyString}&rock_classification_id=${clsId}&format=json`)
}
export function fetchRockTree (clsId,parentId,mode) {
  return fetch(`rock_tree/?rock_classification_id=${clsId}&parent_id=${parentId}&rock__name__isnull=False&rock__name_en__isnull=False&format=json`)
}
export function fetchRockSiblings (clsId,id,mode) {
  return fetch(`rock_tree/?rock_classification_id=${clsId}&parent_id=${id}&rock__name__isnull=False&rock__name_en__isnull=False&format=json`)
}
export function cntSpecimenCollection(id) {
  return fetch(`solr/specimen/?fq=hierarchy_string_rock:${id}&rows=1&format=json`)
}
export function fetchSpecimenCollection (id,mode,searchParameters) {
  let start = searchParameters.specimens.paginateBy*(searchParameters.specimens.page-1);
  let orderBy = searchParameters.specimens.order === 'ASCENDING' ? searchParameters.specimens.sortBy + ' asc': searchParameters.specimens.sortBy + ' desc';
  let isFq = searchParameters.specimens.onlyImgs === true || searchParameters.specimens.git === true || searchParameters.specimens.tug === true || searchParameters.specimens.elm === true
  let fq = '';
  if (isFq === true) {
    fq += '&fq=';
    fq += searchParameters.specimens.onlyImgs === true ? 'image_preview_url:[%27%27 TO *]':'';
    if(searchParameters.specimens.git === true || searchParameters.specimens.tug === true || searchParameters.specimens.elm === true) {
      if (searchParameters.specimens.onlyImgs === true) fq += '%20AND%20';
      fq += 'acronym:';
      fq += searchParameters.specimens.git === true ? 'GIT%20or':'';
      fq += searchParameters.specimens.tug === true ? 'TUG%20or':'';
      fq += searchParameters.specimens.elm === true ? 'ELM%20or':'';
    }
  }
  return fetch(`solr/specimen/?fq=hierarchy_string_rock:${id}${fq}&rows=${searchParameters.specimens.paginateBy}&start=${start}&sort=${orderBy}&format=json`)
}
export function fetchSearch (name,mode) {
  //return fetch(`rock/?multi_search=value:${name};fields:name,name_en;lookuptype:icontains&fields=id,name,name_en${applyMode(mode)}&format=json`)
  return fetch(`rock/?sql=simple_rock_search&keyword=${name}${applyMode(mode)}&format=json`)
}
export function fetchLastChangedRocks (mode) {
  //return fetch(`rock/?multi_search=value:${name};fields:name,name_en;lookuptype:icontains&fields=id,name,name_en${applyMode(mode)}&format=json`)
  return fetch(`rock/?fields=id,name,name_en,date_changed&paginate_by=5&page=1&order_by=-date_changed&format=json`)
}
export function fetchPhotoGallery (parentString,mode) {
  return fetch(`rock/?sql=rock_photo_gallery&keyword=${parentString}&page=1&paginate_by=25&format=json`)
}
export function fetchMinerals (id,mode) {
  return fetch(`rock_mineral/?rock_id=${id}&format=json`)
}
export function fetchMineralsByRock (id,mode) {
  return fetch(`rock_mineral/?mineral__id=${id}&format=json`)
}
export function fetchRockPropertyType () {
  return fetch(`rock_property_type/?format=json`)
}
export function fetchSearchByMineral (ids) {
  return fetch(`rock_mineral/?mineral__id__in=${ids}&fields=rock_id,rock__name,rock__name_en&format=json`)
}
export function fetchMineralList () {
  return fetch(`rock_mineral/?fields=mineral__id,mineral__name,mineral__name_en&distinct=true&format=json`)
}
export function fetchSearchByPropertyType (property_type,operand,value) {
  return fetch(`rock_property/?property_type=${property_type}&value_min__${operand}=${value}&fields=rock_id,rock__name,rock__name_en,value_min,value_max,value_txt&format=json`)
}
