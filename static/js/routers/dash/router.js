import Dashboard from './Dashboard.js'
import AddToCart from './AddToCart.js'

const routes = [
    { path: '/dash', component: Dashboard, name: 'Dashboard' },
    { path: '/add_to_cart/:pid', component: AddToCart, name: 'AddToCart', props: true,},
]

export default new VueRouter({
    mode: 'history',
    routes,
})
