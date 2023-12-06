import AddEditProd from './AddEditProd.js'

const routes = [
    { path: '/add_edit_prod/:CID/:pid', component: AddEditProd, name: 'AddEditProd', props: true,},
]

export default new VueRouter({
    mode: 'history',
    routes,
})
