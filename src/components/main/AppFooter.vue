<template>
  <div>
    <footer class="footer">
      <div style="margin: 10px 0 10px 0; border-left: solid 0px #ccc; border-right: dotted 0px #ccc;">
      <a href="https://natarc.ut.ee" target="_blank">
        <img border="0" style="height: 50px; padding: 0 10px;"  src="https://files.geocollections.info/img/natarclogovalge1.png" alt="NATARC" title="NATARC">
      </a>      
      <a href="https://taltech.ee/geoloogia-instituut" target="_blank">
        <img border="0" style="height: 50px;"  src="https://files.geocollections.info/img/tutaltech2.png" alt="SARV" title="TalTech geoloogia instituut">
      </a>
      <a href="http://www.natmuseum.ut.ee/et/content/geoloogiakogud" target="_blank">
        <img border="0" style="height: 60px; padding: 0 10px;"  src="https://files.geocollections.info/img/TY_logo_ring_jooneta_valge.png" alt="TÜ Loodusmuuseumi geokogud" title="TÜ Loodusmuuseumi geokogud">
      </a>
      <a href="https://loodusmuuseum.ee/geoloogilised-kogud" target="_blank">
        <img border="0" style="height: 60px; padding: 0 10px;"  src="https://files.geocollections.info/img/ELM_logo_white1.png" alt="Eesti Loodusmuuseumi geoloogia osakond" title="Eesti Loodusmuuseumi geoloogia osakond">
      </a>      
      <br />
      </div>
    
    <div style="margin: 10px 0 10px 0;">
    &copy; Data contributors 2019. 
    Content on this site is licensed under <a href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA Licence</a>, if not indicated otherwise.<br />
    Developed as part of <a href="https://natarc.ut.ee">NATARC</a> infrastructure and a component of <a href="https://geocollections.info">SARV</a>. 
    Hosted by the <a href="https://taltech.ee/geoloogia-instituut">Department of Geology, TalTech</a>
    </div>
</footer>


</div>


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
    padding: 5px 15px 10px;
    text-align: center;
    background-color: #A52A2A;
    border-top: 2px solid rgba(0, 68, 148, .1);
    color: #fff;
    opacity: 0.9;
    font-family: arial, sans-serif;
  }
  .underFooter {
    position: absolute;
    bottom: 0;
    width: 100%;
    font-size: 0.7rem;
    padding: 15px 15px;
    text-align: center;
    background-color: #222;
    opacity: 0.9;
  }

  .footer a {
    color: #ccc;
  }
  .footer a:hover {
    color: #fff;
  } 

  /* Footer logo is 40px for small mobile screens */
  @media (max-width: 401px) {
    #eitrawLogo {
      height: 40px;
    }
  }

</style>
