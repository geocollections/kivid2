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
    return fetch(`rock/?id=${id}${applyMode(mode)}&format=json`)
}
export function fetchRockImages (id,mode) {
  return fetch(`rock_image/?rock_id=${id}${applyMode(mode)}&format=json`)
}
export function fetchRockProperties (id,mode) {
  return fetch(`rock_property/?rock_id=${id}${applyMode(mode)}&format=json`)
}
export function fetchRockSynonyms (id,mode) {
  return fetch(`rock_synonym/?rock_id=${id}${applyMode(mode)}&format=json`)
}
export function fetchRockReferences (id,mode) {
  return fetch(`rock_reference/?rock_id=${id}${applyMode(mode)}&format=json`)
}
export function fetchRockLocalities (id,mode) {
  return fetch(`rock_locality/?rock_id=${id}${applyMode(mode)}&format=json`)
}
export function fetchRockTreeByRockId (id,mode) {
  return fetch(`rock_tree/?rock_id=${id}${applyMode(mode)}&format=json`)
}
export function fetchHierarchy (id,hierarchyString,clsId) {
  return fetch(`rock_tree/?rock_id!=${id}&rock_id__in=${hierarchyString}&rock_classification_id=${clsId}&format=json`)
}
export function fetchRockTree (clsId,parentId,mode) {
  return fetch(`rock_tree/?rock_classification_id=${clsId}&parent_id=${parentId}${applyMode(mode)}&rock__name__isnull=False&rock__name_en__isnull=False&format=json`)
}
export function cntSpecimenCollection(id) {
  return fetch(`solr/specimen/?q=rock_id:${id}&rows=1&format=json`)
}
export function fetchSpecimenCollection (id,mode,searchParameters) {
  let start = searchParameters.specimens.paginateBy*(searchParameters.specimens.page-1);
  let orderBy = searchParameters.specimens.order === 'ASCENDING' ? searchParameters.specimens.sortBy + ' asc': searchParameters.specimens.sortBy + ' desc';
  return fetch(`solr/specimen/?q=rock_id:${id}&rows=${searchParameters.specimens.paginateBy}&start=${start}&sort=${orderBy}&format=json`)
}
