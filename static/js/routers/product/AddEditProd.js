import NavBar from "../dash/NavBar.js"
export default {
    name: 'AddEditProd',
    template:`<div style = "height:100%;">
        <NavBar />
        <div id = "content" class="container" style = "min-height:93vh;">
            <div id = "form-wrap">
                <h4 class="mb-5">Create a new Product here!</h4>
                <p class="mb-3" id="feedback" style="color:red;"></p>
                <form style = "width:50vw">
                    
                    <div class = "row g-5 align-items-center mb-3">
                        <div class="col-auto col-sm-4">
                            <b>Category:</b>
                        </div>     
                        <div class="col-auto col-sm-5">
                            {{ cat.Name }}
                        </div>      
                    </div>

                    <div class = "row g-5 align-items-center mb-3">           
                        <div class="col-auto col-sm-4">
                            <b><label for="prod-name" class="col-form-label">Product Name:</label></b>
                        </div>
                        <div class="col-auto col-sm-5">
                            <input v-if="!prod" type="text" class="form-control" id="prod-name">
                            <input v-if="prod" type="text" class="form-control" id="prod-name" :value = "prod.Name">
                        </div>
                    </div>

                    <div class = "row g-5 align-items-center mb-3">           
                        <div class="col-auto col-sm-4">
                            <b><label for="prod-unit" class="col-form-label">Unit:</label></b>
                        </div>
                        <div class="col-auto col-sm-5">
                            <select class="form-select" aria-label="Default select example" id="prod-unit">
                                    <option v-if="!prod" selected>Open this select menu</option>
                                    <option v-if="!prod" value="/Kg">/Kg</option>
                                    <option v-if="!prod" value="/100mL">/100mL</option>
                                    <option v-if="!prod" value="/Block">/Block</option>
                                    <option v-if="!prod" value="/Bunch">/Bunch</option>
                                    <option v-if="!prod" value="/Each">/Each</option>
                                    <option v-if="!prod" value="/Litre">/Litre</option>
                                    <option v-if="!prod" value="/100g">/100g</option>
                                    <option v-if="!prod" value="/Dozen">/Dozen</option>
                                    
                                    <option v-if="prod" >Open this select menu</option>
                                    <option v-if="prod" value="/Kg" :selected = "prod.Unit === '/Kg'">/Kg</option>
                                    <option v-if="prod" value="/100mL" :selected = "prod.Unit === '/100mL'">/100mL</option>
                                    <option v-if="prod" value="/Block" :selected = "prod.Unit === '/Block'">/Block</option>
                                    <option v-if="prod" value="/Bunch" :selected = "prod.Unit === '/Bunch'">/Bunch</option>
                                    <option v-if="prod" value="/Each" :selected = "prod.Unit === '/Each'">/Each</option>
                                    <option v-if="prod" value="/Litre" :selected = "prod.Unit === '/Litre'">/Litre</option>
                                    <option v-if="prod" value="/100g" :selected = "prod.Unit === '/100g'">/100g</option>
                                    <option v-if="prod" value="/Dozen" :selected = "prod.Unit === '/Dozen'">/Dozen</option>
                            </select>
                        </div>
                    </div>

                    <div class = "row g-5 align-items-center mb-3">           
                        <div class="col-auto col-sm-4">
                            <b><label for="prod-rate" class="col-form-label">Rate/Unit:</label></b>
                        </div>
                        <div class="col-auto col-sm-4">
                            <input v-if="!prod" type="text" class="form-control" id="prod-rate" pattern="[0-9]*[.,]?[0-9]*">
                            <input v-else type="text" class="form-control" id="prod-rate" pattern="[0-9]*[.,]?[0-9]*" :value = "prod.Price">
                        </div>
                    </div>
                    
                    <div class = "row g-5 align-items-center mb-3">           
                        <div class="col-auto col-sm-4">
                            <b><label for="prod-qt" class="col-form-label">Quantity:</label></b>
                        </div>
                        <div class="col-auto col-sm-4">
                            <div class="col-auto col-sm-4">
                                <input v-if="!prod" type="number" class="form-control" id="prod-qt">
                                <input v-else type="number" class="form-control" id="prod-qt" :value = "prod.Stock">
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-1" style ="margin:auto;">
                        <button v-if="!prod" type="button" class="btn btn-primary" @click = "create">Save</button>
                        <button v-else type="button" class="btn btn-primary" @click = "update">Save</button>
                    </div>
                </form>
            </div>
        </div>
    </div>`,
    components: {
        NavBar,
    },
    props:['CID', 'pid'],
    data() {
        return {
            cat: {
                CID: null,
                Name: null,
            },
            prod: null,
            authToken: localStorage.getItem('auth-token'),
        }
    },
    methods: {
        async create(){
            var pname = "";
            var punit = "";
            var prate = "";
            var pqt = "";
            pname = document.getElementById("prod-name").value;
            punit = document.getElementById("prod-unit").value;
            prate = document.getElementById("prod-rate").value;
            pqt = document.getElementById("prod-qt").value;     
            //console.log({ Name: pname, Unit: punit, Price: parseFloat(prate), Stock: parseInt(pqt), CID: parseInt(this.CID)});
            var url = "/api/products";

            const res = await fetch(url, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.authToken,
                    },
                    body: JSON.stringify({ Name: pname, Unit: punit, Price: parseFloat(prate), Stock: parseInt(pqt), CID: parseInt(this.CID) })
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
            var pname = "";
            var punit = "";
            var prate = "";
            var pqt = "";
            pname = document.getElementById("prod-name").value;
            punit = document.getElementById("prod-unit").value;
            prate = document.getElementById("prod-rate").value;
            pqt = document.getElementById("prod-qt").value;     
            //console.log({ Name: pname, Unit: punit, Price: parseFloat(prate), Stock: parseInt(pqt), CID: parseInt(this.CID)});
            var url = "/api/products/"+this.pid;

            const res = await fetch(url, {
                    method: 'PUT',
                    headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.authToken,
                    },
                    body: JSON.stringify({ Name: pname, Unit: punit, Price: parseFloat(prate), Stock: parseInt(pqt), CID: parseInt(this.CID) })
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
        async fetch_cat(){
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
            var prods = data.products;
            prods.forEach(element => {
                if(element.PID == this.pid){
                    this.prod = element;
                }
            });
            //console.log(this.cat, this.prod);
        },
    },
    mounted() {
        this.fetch_cat(); 
    }
}