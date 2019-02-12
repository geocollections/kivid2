<template>
  <div>
    <footer class="footer">
      <div style="margin: 10px 0 10px 0; border-left: solid 0px #ccc; border-right: dotted 0px #ccc;">
        {{ $t(' footer.licence ') }}
        <div><br/>
          <a class="cc-large" href="http://creativecommons.org/licences/by-nc/3.0/">
            <img width="88px" height="31px"
                 alt="Creative Commons Licence"
                 src="/static/images/ccbync.png"
                 typeof="foaf:Image"></a>
          <br/>

        </div>
      </div>
      <div style="margin: 10px 0 10px 0;">
        <a href="http://geokogud.info">
          <img border="0" style="height: 50px;"  src="https://files.geocollections.info/img/sarv_logo.svg" alt="SARV"
               title="SARV: geokogude infosüsteem">
        </a>
        <a href="http://natarc.ut.ee">
          <img border="0" style="height: 50px; margin-left: 25px;"  src="https://elurikkus.ee/assets/images/natarc_logo_black.svg"
               alt="Natural History Archives and Information Network (NATARC)"
               title="SARV is part of national infrastructure Natural History Archives and Information Network (NATARC)">
        </a>
        <a href="http://struktuurifondid.ee">
          <img border="0" style="height: 50px; margin-left: 25px;" src="http://geokogud.info/images/EL_mv.png" alt="EU" title="Euroopa Liit">
        </a>

      </div>
    </footer>
    <div class="underFooter"><a style="color: #bbb !important;" target="_blank" href="http://ttu.ee/geoloogia-instituut">Developed and hosted by the Department of Geology, Tallinn University of Technology</a></div>
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
    padding: 5px 15px 50px;
    text-align: center;
    background-color: #FFFFFF;
    border-top: 2px solid rgba(0, 68, 148, .1);
    color: #333;
    opacity: 0.9;
  }
  .underFooter {
    position: absolute;
    bottom: 0;
    width: 100%;
    font-size: 0.7rem;
    padding: 15px 15px;
    text-align: center;
    background-color: #342b60;
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
