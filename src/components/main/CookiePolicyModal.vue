<template>
  <div>
    <div class="p-2" id="cookie_ribbon"  >
      <div class="col-lg-12">
        {{$t('main.policyMessage')}}
        <span style="margin-left: -10px"><button type="button" class="btn btn-link"  data-toggle="modal" data-target="#myModal" >üldtingimustega</button></span>
        <span  class="pl-2"  ><button type="button" class="btn btn-outline-primary btn-cookie-agree" @click.prevent="agreePolicy()">{{$t('main.policyAgreeBtn')}}</button></span>
        <span class="pb-3" style=" position: fixed;bottom: 0;right:0;">
          <button class="btn btn-link" style="color:white;font-size: small" @click.prevent="$parent.cookiePolicy = false"><font-awesome-icon :icon="icon"/></button></span>
      </div>
    </div>
    <!--&lt;!&ndash; Button to Open the Modal &ndash;&gt;-->
    <!--<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#myModal">-->
      <!--Open modal-->
    <!--</button>-->

    <!-- The Modal -->
    <div class="modal fade" id="myModal">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">

          <!-- Modal Header -->
          <div class="modal-header">
            <h3 class="modal-title">{{$t('main.policyHeader')}}</h3>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>

          <!-- Modal body -->
          <div class="modal-body" style="font-size: 0.85rem !important;">
            <span class="p-3" v-if="termsOfService !== null" v-translate="{ et: termsOfService.content_et, en: termsOfService.content_en }"></span><hr>
            <span class="p-3" v-if="cookiePolicyList !== null" v-translate="{ et: cookiePolicyList.content_et, en: cookiePolicyList.content_en }"></span><hr>
            <span class="p-3" v-if="privicyPolicy !== null" v-translate="{ et: privicyPolicy.content_et, en: privicyPolicy.content_en }"></span>
          </div>

          <!-- Modal footer -->
          <!--<div class="modal-footer">-->
            <!--<button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>-->
          <!--</div>-->

        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
  import faWindowClose from '@fortawesome/fontawesome-free-solid/faTimes'
  import {fetchPage} from "../../api";
    export default {
        name: "CookiePolicyModal",
      props: {
        cookiePolicy: Boolean
      },
      data() {return { cookiePolicyList : null, privicyPolicy : null, termsOfService: null}},
      computed: {
        icon() { return faWindowClose }
      },
      components: {
        FontAwesomeIcon
      },
      created() {
        fetchPage(67).then((response) => {this.cookiePolicyList = response.results[0]});
        fetchPage(68).then((response) => {this.privicyPolicy = response.results[0]});
        fetchPage(69).then((response) => {this.termsOfService = response.results[0]});
      },
      methods: {
        agreePolicy() {
          this.$localStorage.set('kivid_cookie_policy', 1)
          this.$parent.cookiePolicy = false
        }
      }
    }
</script>

<style scoped>
  .btn-cookie-agree {
    text-transform: uppercase;
    font-size: .75rem;
    border-radius: 1%;
    letter-spacing: 1px;
    color:#fff  !important;
    border-color:#fff  !important;
  }

  .btn-cookie-agree:hover, .btn-cookie-agree:active{
    color:#fff  !important;
    border-color:#fff  !important;
    background-color: #b2b5b9 !important;
  }
  #cookie_ribbon button {
    color: #373737 !important;
    font-size: 0.7rem;
    font-weight: bolder;
  }
  #cookie_ribbon button:hover {
    color: #000 !important;
    font-weight: bolder;
  }
  #cookie_ribbon {
    position: fixed;
    /*height: 50px;*/
    bottom: 0;
    text-align: center;
    width: 100%;
    font-size: .75rem;
    color: #fff;
    background: #82858c;
    box-shadow: 0 0px 4px rgba(0,0,0,.3);
  }
</style>
