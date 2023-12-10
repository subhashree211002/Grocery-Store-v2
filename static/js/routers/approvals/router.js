import Approvals from './Approvals.js'

const routes = [
    { path: '/approve', component: Approvals, name: 'Approvals' },
]

export default new VueRouter({
    mode: 'history',
    routes,
})
