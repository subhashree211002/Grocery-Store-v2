export default {
    template: `<div class ="scrollable-comp">
        <div v-for= "mgr in managers" class ="mgr-line-item my-5 py-3" style = "display: flex; background-color:rgba(255, 255, 255, 0.5);">
            <div class = "mgr-usr-id  mx-5">{{mgr.email}}</div>
            <button type = "button" class = "btn-primary mx-5" @click="approve(mgr.id)"> Approve </button>
        </div>
    </div>`,
    data() {
        return {
            authToken: localStorage.getItem('auth-token'),
            managers: null,
        }
    },
    methods: {
        async approve(uid) {
            var url = "/api/users/"+uid;

            const res = await fetch(url, {
                    method: 'PUT',
                    headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.authToken,
                    },
                });

            window.alert(await res.json());
        },
    },
    async mounted() {
        var url = "/api/users";

        const res = await fetch(url, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                'Authentication-Token': this.authToken,
                },
            });
        
        if(res.ok){
            var data = await res.json();
            this.managers = data;        
        }
    },
}