// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue' // https://vuejs.org/v2/guide/
import VueResource from 'vue-resource' // https://github.com/pagekit/vue-resource
import App from './App'
import router from './router' // https://router.vuejs.org/en/
import BootstrapVue from 'bootstrap-vue' // https://bootstrap-vue.js.org/docs
import '../static/css/styles.css'
import VueSession from 'vue-session' // https://www.npmjs.com/package/vue-session
import moment from 'moment' // https://momentjs.com/
import VueLocalStorage from 'vue-localstorage' // VueLocalStorage for using local storage
import VueI18n from 'vue-i18n' // Translations
import VueCookie from 'vue-cookie'

import 'vue-multiselect/dist/vue-multiselect.min.css' // Select input
import VueIziToast from 'vue-izitoast' // Pop-up messages
import 'izitoast/dist/css/iziToast.min.css' // Pop-up messages style
import 'flag-icon-css/css/flag-icon.min.css' // Flag icons

Vue.use(VueResource);
Vue.use(BootstrapVue);
Vue.use(VueSession);
Vue.use(VueLocalStorage);
Vue.use(VueI18n);
Vue.use(VueCookie);
Vue.use(VueIziToast)
Vue.config.productionTip = false;

// Gets translations from json files
const messages = {
  ru: require('@/assets/locales/ru.json'),
  en: require('@/assets/locales/en.json'),
  et: require('@/assets/locales/et.json'),
};

// Gets preferred language from localStorage (fallback is et)
const lang = Vue.localStorage.get('kivid_lang', 'et')

// Translation settings
const i18n = new VueI18n({
  locale: lang,
  fallbackLocale: 'en',
  messages
})
Vue.directive('translate', function (el, binding) {
  let value;
  //temporary solution. Not all values contain ru translation
  switch(i18n.locale)  {
    case 'et':
      value = (binding.value.et === undefined || binding.value.et === null) ? binding.value.en : binding.value.et;
      break;
    case 'ru':
      value = (binding.value.ru === undefined || binding.value.ru === null) ? binding.value.en : binding.value.ru;
      break;
    default:
      value = (binding.value.en === undefined || binding.value.en === null) ? binding.value.et : binding.value.en;
      break;
  }

  el.innerHTML = value === undefined || value === null ? '' : value
});
// This adds session id and csrf to request | MUST BE BEFORE new Vue()
Vue.http.interceptors.push((request, next) => {
  let csrftoken = Vue.cookie.get('csrftoken')

  request.credentials = true;
  request.headers.set('X-CSRFTOKEN', csrftoken)

  next();
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  router,

  template: '<App/>',
  localStorage: {
    kivid_lang: {
      type: String,
      default: 'en'
    },
    kivid_mode: {
      type: String,
      default: 'in_global'
    }
  },
  components: { App },
});
Vue.filter('getLangCode', function (value) {
  let code = 'ENG';
  switch (value) {
    case 'et': code = 'EST'; break;
    case 'ru': code = 'RUS'; break;
    default: break;
  }
  return code;
});

Vue.filter('formatDate', function (value) {
  if (value) {
    return moment(String(value)).format('ddd, MMMM Do YYYY, HH:mm')
  }
});
