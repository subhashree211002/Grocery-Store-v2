import router from './router.js'

router.beforeEach((to, from, next) => {
  if (!localStorage.getItem('auth-token') ? true : false)
    window.location.href = '/login_page';//next('/login_page')
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
