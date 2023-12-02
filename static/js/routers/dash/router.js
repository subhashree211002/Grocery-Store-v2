import Dashboard from './Dashboard.js'

const routes = [
    { path: '/dash', component: Dashboard, name: 'Dashboard' },
]

export default new VueRouter({
    mode: 'history',
    routes,
})
