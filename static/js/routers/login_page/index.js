import router from './router.js'

router.beforeEach((to, from, next) => {
  if (to.name === 'Login' && localStorage.getItem('auth-token') ? true : false)
  window.location.href = '/dash';//next('/dash');
  else next()
})

new Vue({
  el: '#app',
  template: `<div id = "app" style = "height: 100%; width: 100%;">
  <router-view /></div>`,
  router,
  components: {
  },
  data: {
    has_changed: true,
  },
  watch: {
    $route(to, from) {
      this.has_changed = !this.has_changed
    },
  },
})
