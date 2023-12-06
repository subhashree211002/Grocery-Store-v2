import AddEditCat from './AddEditCat.js'

const routes = [
    { path: '/add_edit_cat/:CID', component: AddEditCat, name: 'AddEditCat', props: true,},
]

export default new VueRouter({
    mode: 'history',
    routes,
})
