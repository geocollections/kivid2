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
