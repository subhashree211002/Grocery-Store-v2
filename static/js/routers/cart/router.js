import Cart from './Cart.js'

const routes = [
    { path: '/cart', component: Cart, name: 'Cart' },
]

export default new VueRouter({
    mode: 'history',
    routes,
})
