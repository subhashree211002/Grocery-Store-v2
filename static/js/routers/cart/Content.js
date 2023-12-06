export default {
    template: 
    `<div id = "content" class="container border">    
        <div style = "margin-left:1vw; margin-right:auto; margin-top:5vh;">
            <h1>Your Cart</h1>
            <p>Fresh Convenience at Your Fingertips: Your One-Stop Grocery App!</p><br>
        </div>

        <h3 v-if="!orders">Your cart is empty go to home to start adding to the cart</h3>

        <div v-else v-for="( { OID, Qty, prod }, index) in orders" :key="index" style = "width: 100%;">
            <div
            :id="'list-' + index"
            :style="{ width: '100%', marginBottom: index === orders.length - 1 ? '10vh' : '0' }">
                
                <div
                class="container-fluid shadow line-item"
                :style="{ width: '100%', marginTop: '5vh', display: 'flex' }">
               
                    <div class="row" :style="{ margin: 'auto', width: '100%', height: 'fit-content', padding: '1vw' }">
                        <div class="col-3 text-wrap" :style="{ marginBottom: '0px' }">{{ prod.Name }}</div>
                        
                        <div :id="prod.PID" class="col-2 text-wrap" :style="{ marginBottom: '0px' }">{{ Qty }} units</div>
                        
                        <div class="col-3 text-wrap" :style="{ marginBottom: '0px' }">
                        &times; {{ prod.Price }} {{ prod.Unit }}
                        </div>
                        
                        <div :class="['col-2', 'text-wrap', prod.PID]" :style="{ marginBottom: '0px' }">
                        Rs <span class="line-total">{{ Qty * prod.Price }}</span>
                        </div>
                        
                        <div
                        :id="'buttons-' + prod.PID"
                        class="col-2 text-wrap"
                        :style="{ marginBottom: '0px', padding: '0px' }"
                        >
                            <button :id="'edit-btn-'+prod.PID" type="button" class="btn btn-primary" @click="editTable(prod.PID, OID, Qty, prod.Price)">
                                Edit
                            </button>
                            <button type="button" class="btn btn-danger" @click="del(prod.PID)">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="index === 0">
                <nav class="navbar fixed-bottom bg-body-tertiary" style="border-top: 3px solid black">
                <div class="container-fluid row">
                    <p class="col-2" style="font-size: 3vh; text-align: right; margin: 0px">Grand Total: </p>
                    <p id="grand-total" class="col-4" style="font-size: 3vh; margin: 0px">Rs. {{totalCost}} </p>
                    <p class="col-6" style="font-size: 3vh; text-align: right; padding-right: 10vw; margin: 0px">
                    <button
                        id="checkout-btn"
                        type="button"
                        class="btn btn-info"
                        style="padding-left: 8vh; padding-right: 8vh"
                        @click="showConfirmationModal()"
                    >
                        Confirm and Buy
                    </button>
                    </p>
                </div>
                </nav>

                <!-- Bootstrap Modal -->
                <div class="modal fade" id="confirmationModal" tabindex="-1" aria-labelledby="confirmationModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="confirmationModalLabel">Confirmation Prompt</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">Are you sure you want to proceed?</div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-primary" @click="checkout(); hideConfirmationModal()">
                        Confirm
                        </button>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </div>    
    </div>`,
    data() {
        return {
            orders: null,
            email: localStorage.getItem('email'),
            authToken: localStorage.getItem('auth-token'),
        }
    },
    computed: {
        // Use a computed property for totalCost
        // This will automatically update whenever the dependent values change
        totalCostComputed() {
          return this.orders.reduce((total, { Qty, prod }) => total + Qty * prod.Price, 0);
        },
      },
    
      watch: {
        // Watch for changes in the orders array and update totalCost accordingly
        orders: {
          handler() {
            this.updateTotalCost();
          },
          deep: true,
        },
      },
    methods: {
        updateTotalCost() {
            this.totalCost = this.totalCostComputed;
        },
        editTable(pid, oid, curr_qt, price) {
            var bt_ele = document.getElementById("edit-btn-"+pid);
            console.log(pid, bt_ele) ;
            var ele = document.getElementById(pid);
            ele.innerHTML = "<input id = 'ip"+pid+"' type='number' class='form-control' oninput = 'update("+pid+","+price+")' value='"+curr_qt+"'>"
            parent = bt_ele.parentNode
            parent.removeChild(bt_ele); 
            parent.innerHTML = "<button type='button' class='btn btn-success' onclick = 'save("+pid+")'>Save</button>";
            parent.innerHTML += "<button type='button' class='btn btn-danger' style='margin-left:1vw;' onclick = 'cancel("+pid+","+oid+","+curr_qt+","+price+")'>Cancel</button>"
        },
        cancel(pid, oid, curr_qt, price){
            var ele = document.getElementById(pid);
            ele.innerHTML = curr_qt+" units";
            var parent = document.getElementById("buttons-"+pid)
            parent.innerHTML = "<button type='button' class='btn btn-primary' onclick = 'edittable("+pid+","+oid+","+curr_qt+","+price+")'>Edit</button>"
            parent.innerHTML += "<button type='button' class='btn btn-danger' style='margin-left:1vw;' onclick = 'del("+pid+")'>Delete</button>"
        
        },
        update(pid, price){
            //window.alert(pid, price);
            var ele = document.getElementsByClassName(pid)[0];
            ele.innerHTML = "Rs <span class='line-total'>"+(parseInt(document.getElementById("ip"+pid).value)*parseFloat(price))+"</span>"
            //calc();
        },
        async checkout() {
            var oid = this.orders[0].OID
            //console.log(oid, this.authToken);
            var url = "/api/orders_desc";

            fetch(url, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.authToken,
                    },
                    body: JSON.stringify({ "OID": oid }),
                })
                .then(response => {
                    response.json(); 
                    console.log(response);
                    if (!response.ok) {
                        window.alert("failure");
                    }
                    else{
                        window.alert("Checkout successful");
                        window.location.href = '/dash';
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                }
            );
        },
        async del(pid) {
            var url = "/api/order_details";

            fetch(url, {
                    method: 'DELETE',
                    headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.authToken,
                    },
                    body: JSON.stringify({ "PID": pid, "email": this.email }),
                })
                .then(response => {
                    response.json(); 
                    console.log(response);
                    if (!response.ok) {
                        window.alert("failure");
                    }
                    else{update
                        window.alert("Update successful");
                        window.location.reload();
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                }
            );

        },
        showConfirmationModal() {
            // Implement logic to show the confirmation modal
            $('#confirmationModal').modal('show');
        },
        hideConfirmationModal() {
            // Implement logic to hide the confirmation modal
            $('#confirmationModal').modal('hide');
        },

    },
    async mounted() {
        const res = await fetch(`/api/cartdetails/${this.email}`, {
        headers: {
            'Authentication-Token': this.authToken,
        },
        });
        const data = await res.json()
        if (res.ok) {
        this.orders = data
        } else {
            alert(data.message)
        }
    }
}