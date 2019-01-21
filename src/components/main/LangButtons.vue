<template>
  <div class="lang-buttons">
    <span @click="changeLang('et')" class="p-2">EST &nbsp;<span class="flag-icon flag-icon-ee flag-icon-squared circle-flag"></span></span>
    <span @click="changeLang('en')" class="p-2" >ENG &nbsp;<span class="flag-icon flag-icon-gb flag-icon-squared circle-flag"></span></span>
    <span @click="changeLang('ru')" class="p-2" >RUS &nbsp;<span class="flag-icon flag-icon-ru flag-icon-squared circle-flag"></span></span>
  </div>
</template>

<script>
  export default {
    name: "lang-buttons",
    methods: {
      changeLang(lang) {
        if (this.$localStorage.get('kivid_lang') === lang) return;
        this.$i18n.locale = lang;
        this.$localStorage.set('kivid_lang', lang);
      }
    }
  }
</script>

<style scoped>
  .lang-buttons {
    position: absolute;
    right: 0;
  }

  .lang-buttons > span:hover {
    cursor: pointer;
    background-color: #f8f9fa;
  }

  .lang-buttons > span:active {
    font-weight: bold;
  }

  .circle-flag {
    border-radius: 100%;
  }
</style>
