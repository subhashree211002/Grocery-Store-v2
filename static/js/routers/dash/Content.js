import UserDashContent from "./UserDashContent.js";
import ManagerDashContent from "./ManagerDashContent.js";
import AdminDashContent from "./AdminDashContent.js";

export default{
    name: 'Content',
    template: `<div id="content" class="container border">
    <div style="margin-left: 1vw; margin-right: auto; margin-top: 5vh;">
      <h1>Your Cart</h1>
      Fresh Convenience at Your Fingertips: Your One-Stop Grocery App!<br>
    </div>

    <div class="container-fluid shadow" style="width: 100%; margin-top: 5vh; background-color: white;">
      <div class="row" style="margin-left: 1vw; padding-top: 1vh; padding-bottom: 1vh">
        <div class="col-2">
          <select v-model="selectedFilter" class="form-select" :style="{ backgroundColor: 'black', color: 'white', border: 'none' }" aria-label="Default select example">
            <option value="0">Show all</option>
            <option value="1">Category</option>
            <option value="2">Product</option>
            <option value="3">Price</option>
          </select>
        </div>
        <div class="col-2"></div>
        
        <input v-if="selectedFilter === '1'" v-model="filterInput" class="col-4 border" type="text" :style="{ border: '1px solid black' }">
        <input v-if="selectedFilter === '2'" v-model="filterInput" class="col-4 border" type="text" :style="{ border: '1px solid black' }">
        <input v-if="selectedFilter === '3'" v-model="filterInput" class="col-4 border" type="range"  min="0" max="3000" step ="0.5" :style="{ border: '1px solid black' }">

        <div v-if="selectedFilter === '3'" id="range-val" class="col-2"> <= Rs {{filterInput}}</div>
        <button type="button" class="btn btn-dark col-1" :disabled="!filterInput" @click="applyFilter">Apply</button>
      </div>
    </div>

    <UserDashContent v-if="userRole=='buyer'" v-for="cat in categories" :key="cat.Name" :cat = "cat"/>
    
    <button v-if="userRole=='store_manager'" id = "add-btn" type="button" class="btn btn-primary shadow-lg" @click = "">+ Add Category</button>
    <div v-if="userRole=='store_manager'" id = "initial-struct" style="display:'';">
        <ManagerDashContent v-for="cat in categories" :key="cat.Name" :cat = "cat"/>
        <div class="modal fade" id="confirmationModal-1" tabindex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="confirmationModalLabel">Confirmation Prompt</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Are you sure you want to proceed?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="confirmActionBtn-1">Confirm</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bootstrap Modal -->
        <div class="modal fade" id="confirmationModal-2" tabindex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="confirmationModalLabel">Confirmation Prompt</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Are you sure you want to proceed?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="confirmActionBtn-2">Confirm</button>
                    </div>
                </div>
            </div>
        </div>
    </div>



    <button v-if="userRole=='admin'" id = "add-btn" type="button" class="btn btn-primary shadow-lg" @click = "add_cat">+ Add Category</button>
    <div v-if="userRole=='admin'" id = "initial-struct" style="display:'';">
        <AdminDashContent v-for="cat in categories" :key="cat.Name" :cat = "cat"/>
        <div class="modal fade" id="confirmationModal-1" tabindex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="confirmationModalLabel">Confirmation Prompt</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Are you sure you want to proceed?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="confirmActionBtn-1">Confirm</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Bootstrap Modal -->
        <div class="modal fade" id="confirmationModal-2" tabindex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="confirmationModalLabel">Confirmation Prompt</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Are you sure you want to proceed?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" id="confirmActionBtn-2">Confirm</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    

    </div>`,
    data() {
        return {
            userRole: localStorage.getItem('role'),
            authToken: localStorage.getItem('auth-token'),
            categories: [], // Replace with your actual data
            selectedFilter: '0',
            filterInput: '',
        };
    },
    components: {
        UserDashContent,
        ManagerDashContent,
        AdminDashContent,
    },
    methods: {
        applyFilter() {
            var lines;
            if(this.userRole === 'buyer'){
                lines = document.getElementsByClassName("line-item");
            }
            else if(this.userRole === 'store_manager' || this.userRole === 'admin'){
                lines = document.getElementsByClassName("cat");
            }
            var value = this.filterInput.toLowerCase();

            this.showall(lines);

            if (this.selectedFilter == 1) {
                this.filterByCategory(lines, value);
            } else if (this.selectedFilter == 2) {
                this.filterByProduct(lines, value);
            } else if (this.selectedFilter == 3) {
                this.filterByPrice(lines, parseFloat(value));
            } else {
                // Show all
            }
        },

        showall(lines){
            for (var i = 0; i < lines.length; i++) {
                const parent = lines[i];
                var children;
                if(this.userRole === 'buyer'){
                    children = parent.querySelectorAll('.prod');
                }
                else if(this.userRole === 'store_manager' || this.userRole === 'admin'){
                    children = parent.querySelectorAll('.card-body-prod');
                }
                children.forEach((child) => {
                    child.style.display = "";
                });
                parent.style.display = "";
            }
        },

        filterByCategory(lines, value) {
            this.showall(lines);
            
            if(this.userRole === 'buyer'){
                for (var i = 0; i < lines.length; i++) {
                    if (lines[i].id.toLowerCase().indexOf(value) == -1) {
                        lines[i].style.display = "none";
                    }
                }
            }
            if(this.userRole === 'store_manager' || this.userRole === 'admin'){
                for(var i = 0; i < lines.length; i++){
                    //window.alert(lines[i].id)
                    var classlist = Array.from(lines[i].classList)
                    var name = classlist[classlist.length-1];
                    if(name.toLowerCase().indexOf(value) != -1){
                        lines[i].style.display = ""
                    }
                    else{
                        lines[i].style.display = "none"
                    }
                } 
            }
        },

        filterByProduct(lines, value) {
            this.showall(lines);    
            for (var i = 0; i < lines.length; i++) {
                var flag = 0;
                const parent = lines[i];
                var children;
                if(this.userRole === 'buyer')
                    children = parent.querySelectorAll('.prod');
                if(this.userRole === 'store_manager' || this.userRole === 'admin')
                    children = parent.querySelectorAll('.card-body-prod');
                
                    children.forEach((child) => {
                    if (child.id.toLowerCase().indexOf(value) != -1) {
                        flag = 1;
                        child.style.display = "";
                    } else {
                        child.style.display = "none";
                    }
                });

                if (flag != 1) {
                    parent.style.display = "none";
                }
                else{
                    parent.style.display = ""
                }
            }
        },

        filterByPrice(lines, value) {
            value = parseFloat(value);
            this.showall(lines);
            for (var i = 0; i < lines.length; i++) {
                var flag = 0;
                const parent = lines[i];

                var children;
                if(this.userRole === 'buyer')
                    children = parent.querySelectorAll('.prod');
                if(this.userRole === 'store_manager' || this.userRole === 'admin')
                    children = parent.querySelectorAll('.card-body-prod');
                
                if(this.userRole === 'buyer')
                    children.forEach((child) => {
                        var childPrice = parseFloat(child.querySelector('.price').innerHTML);
                        if (childPrice <= value) {
                            flag = 1;
                            child.style.display = "";
                        } else {
                            child.style.display = "none";
                        }
                    });
                if(this.userRole === 'store_manager' || this.userRole === 'admin')
                    children.forEach((child) => {
                        var child_price = child.querySelectorAll('.price');
                        //window.alert(child.id+" "+child_price[0].innerHTML+" || ")
                        if(parseFloat(child_price[0].innerHTML) <= value){
                            //window.alert("yes");
                            flag = 1;
                            child.style.display = ""
                        }
                        else{
                            //window.alert("no");
                            child.style.display = "none"
                        }
                    });

                if(flag == 1){
                    parent.style.display = ""
                }
                else{
                    parent.style.display = "none"
                }
            }
        },
        add_cat(){
            window.location.href = `/add_edit_cat/0`;
        }
    },



    async mounted() {
        const res = await fetch('/api/categories', {
        headers: {
            'Authentication-Token': this.authToken,
        },
        })
        const data = await res.json()
        if (res.ok) {
        this.categories = data
        } else {
        alert(data.message)
        }
    },

}