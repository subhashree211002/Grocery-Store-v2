import NavBar from "../dash/NavBar.js"

export default {
    template: `<div style = "100%">
        <NavBar />
        <div id = "content" class="container">
            <div id = "form-wrap">
                <h4 class="mb-5">Create a new Category here!</h4>
                <p class="mb-3" id="feedback" style="color:red;"></p>
                <form style = "width:50vw">
                    <div class = "row g-5 align-items-center mb-5">           
                        
                        <div class="col-auto col-sm-4">
                            <b><label for="cat-name" class="col-form-label">Category Name:</label></b>
                        </div>

                        <div v-if ="!cat" class="col-auto col-sm-6">
                            <input type="text" class="form-control" id="cat-name">
                        </div>
                        
                        <div v-else class="col-auto col-sm-6">
                            <input type="text" class="form-control" id="cat-name" :value="cat.Name">
                        </div>

                    </div>
                    <div v-if ="!cat" class="col-1" style ="margin-left:auto; margin-right:9vw;">
                        <button type="button" class="btn btn-primary" @click = "create">Save</button>
                    </div>
                    <div v-else class="col-1" style ="margin-left:auto; margin-right:9vw;">
                        <button type="button" class="btn btn-primary" @click = "update">Save</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `,
    components: {
        NavBar,
    },
    props:['CID'],
    data() {
        return {
            cat: null,
            authToken: localStorage.getItem('auth-token'),
        }
    },
    methods: {
        async create(){
            var u = "";
            u = document.getElementById("cat-name").value;  
            //console.log({ Name: pname, Unit: punit, Price: parseFloat(prate), Stock: parseInt(pqt), CID: parseInt(this.CID)});
            var url = "/api/categories";

            const res = await fetch(url, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.authToken,
                    },
                    body: JSON.stringify({ Name: u })
                });

            var data = await res.json();
            if (res.ok) {
                window.alert(data.message);
                window.location.href = "/dash"
            } else {
                window.alert(data.message);
            }
            return;
        },
        async update(){
            var u = "";
            u = document.getElementById("cat-name").value;  
            //console.log({ Name: pname, Unit: punit, Price: parseFloat(prate), Stock: parseInt(pqt), CID: parseInt(this.CID)});
            var url = "/api/categories/"+this.CID;

            const res = await fetch(url, {
                    method: 'PUT',
                    headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.authToken,
                    },
                    body: JSON.stringify({ Name: u})
                });

            var data = await res.json();
            if (res.ok) {
                //window.alert("Category modified!");
                window.alert(data.message);
                window.location.href = "/dash"
            } else {
                window.alert(data.message);
                //window.alert("Error!");
            }
            return;
        },
        async fetch_cat(){
            if(this.CID == 0) {
                //console.log(this.cat);
                return
            }
            //console.log(this.CID, this.pid);
            var url = "/api/categories/"+this.CID;

            const res = await fetch(url, {
                    method: 'GET',
                    headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.authToken,
                    },
                });

            var data = await res.json();
            this.cat = {CID: data.CID, Name: data.Name};
            //console.log(this.cat);
        },
    },
    mounted() {
        this.fetch_cat(); 
    }
}
