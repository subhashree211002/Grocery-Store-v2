export default {
    template: `<div class ="scrollable-comp">
        <div v-for= "req in requests" class ="req-line-item my-5 py-3" style = "display: flex; background-color:rgba(255, 255, 255, 0.5);">
            <div class = "req-cat-name  mx-3"><b>{{req.cat.Name}}</b></div>

            <div v-if = "req.update_name" class = "req-type mx-3">Update name to <b>{{req.update_name}}</b> req</div>
            <div v-if = "!req.update_name && req.cat.show" class = "req-type mx-3">Delete category req</div>
            <div v-if = "!req.update_name && !req.cat.show" class = "req-type mx-3">Create category req</div>

            <div class = "req-cat-name  mx-3" style = "display: flex; flex-direction:column;">
                <div><b>by {{req.user.username}}</b></div>
                <div>mail: {{req.user.email}}</div>
            </div>


            <button type = "button" class = "btn-primary mx-3" @click="approve(req.id)"> Approve </button>
        </div>
    </div>`,
    data() {
        return {
            authToken: localStorage.getItem('auth-token'),
            requests: null,
        }
    },
    methods: {
        async approve(id) {
            //console.log(id);
            var url = "/api/requests/"+id;

            const res = await fetch(url, {
                    method: 'PUT',
                    headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.authToken,
                    },
                });
            const data = await res.json()
            window.alert(data.message);

            if(res.ok){
                window.location.reload();
            }
        },
    },
    async mounted() {
        var url = "/api/requests";

        const res = await fetch(url, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                'Authentication-Token': this.authToken,
                },
            });
        
        if (res.ok){
            var data = await res.json();
            this.requests = data;   
        }     
    },
}