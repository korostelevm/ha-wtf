import Vue from 'vue'
import App from './App.vue'
import './components/_globals'
import VueRouter from 'vue-router'
import Lol from './components/Lol.vue'
import Web from './components/Web.vue'
import Boxes from './components/Boxes.vue'
import vueCustomElement from 'vue-custom-element'
Vue.use(vueCustomElement);
Vue.use(VueRouter)

// const Home = { template: '<div>This is Home</div>' }
// const Foo = { template: '<div>This is Foo</div>' }
// const Bar = { template: '<div>This is Bar {{ $route.params.id }}</div>' }

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    // { path: '/', name: 'home', component: App },
    { path: '/web', name: 'foo', component: Web },
    { path: '/lol', name: 'foo', component:  Lol},
    { path: '/', name: 'foo', component:  Boxes},
    // { path: '/bar/:id', name: 'bar', component: Bar }
  ]
})







Vue.prototype.$api = '/api'

Vue.prototype.$dispatch = function(channel, o) {
  window.dispatchEvent(new CustomEvent(`express-lambda-ui:${channel}`, {
    detail: o, 
  }));
}

Vue.mixin({
  router,
  methods: {
    get_auth_header: function() {
      try{
        var user = JSON.parse(sessionStorage.getItem('user'))
        return user.id_token
      }catch(e){
        console.warn(e)
        return null
      }
    },
  }
})


Vue.config.productionTip = false
Vue.customElement('express-lambda-ui', App);
