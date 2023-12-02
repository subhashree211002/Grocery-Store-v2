import Login from './Login.js'

const routes = [
    { path: '/login_page', component: Login, name: 'Login' },
]

export default new VueRouter({
    mode: 'history',
    routes,
})
