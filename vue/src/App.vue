<template>

  <div class='main'>
    <canvas id=c></canvas>
  </div>

</template>
 
<script>
var c = require('./canvas.js')
var moment = require('moment')
export default {
    name: 'microfrontend',
    data() {
      return {
        error: false,
        loading: false,
        reqs:[],
        req_body:false,
        active: null
      }
    },
    mounted: function() {
      console.log(c)
      c.run()
      // this.stub()
      // this.stub()
    },
    created: function() {
    },
    methods: {
      get_req:function(r){
        return new Promise((resolve,reject)=>{
          this.loading = r.id
          fetch(this.$api + '/integration/'+r.id, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': this.get_auth_header()
              },
              // body: JSON.stringify(d),
            })
            .then(res => res.json()) 
            .then(data => {
              this.loading = false;
              if("req_body" in data && data.req.headers['content-type'] == 'application/json'){
                try{
                  data.req_body =  JSON.parse(data.req_body)
                }catch(e){
                  console.warn(e)
                }
              }
              resolve(data)
            })
          })
      },
      collapse_show: async function(e){
        this.$root.$emit('bv::toggle::collapse',e.id)
        console.log(e.id)
        if(this.active != e.id){
          this.req_body = null
          this.req_body = await this.get_req(e)
        }
        this.active = e.id
      },
       stub: function(d) {
        return new Promise((resolve,reject)=>{
          fetch(this.$api + '/integrations', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': this.get_auth_header()
              },
              // body: JSON.stringify(d),
            })
            .then(res => res.json()) 
            .then(data => {
              this.reqs=data.map(r=>{
                var ts  = moment.utc(r.d + ' ' + r.t, 'YYYY-MM-DD HH:mm:ss:SSSS' )
                r.time_ago = ts.fromNow()
                r.ts = ts.format('LLLL')
                return r
              })
              resolve(data)
            }).catch(e => {
              this.error = e; console.error('exception:', e);
            })
          })
      },
      },
  }
</script>

<style>
.main {
  margin:0 ;
  /* width:1000px; */
}

</style>
