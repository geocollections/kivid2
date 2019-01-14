<template>
  <footer class="footer">
    <div style="margin: 10px 0 10px 0;">
      <a href="http://geokogud.info" target="_blank">
        <img border="0" style="height: 50px;"  src="https://files.geocollections.info/img/sarv_logo.svg" alt="SARV" title="SARV: geokogude infosüsteem">
      </a>
    </div>
  </footer>
</template>

<script>
  import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
  import faCreativeCommons from '@fortawesome/fontawesome-free-brands/faCreativeCommons'

  export default {
    components: {
      FontAwesomeIcon
    },
    name: "app-footer",
    computed: {
      icon() {
        return faCreativeCommons
      }
    }
  }
</script>

<style scoped>
  .footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    font-size: 0.7rem;
    padding: 5px 15px 15px;
    text-align: center;
    background-color: #FFFFFF;
    border-top: 2px solid rgba(0, 68, 148, .1);
    color: #333;
    opacity: 0.9;
  }

  #eitrawLogo {
    height: 50px;
    margin: 10px;
  }

  /* Footer logo is 40px for small mobile screens */
  @media (max-width: 401px) {
    #eitrawLogo {
      height: 40px;
    }
  }

</style>
