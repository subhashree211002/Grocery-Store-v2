export default {
    template: 
    `<div id = "content" class="container border">    
        <div style = "margin-left:1vw; margin-right:auto; margin-top:5vh;">
            <h1>Your Cart</h1>
            <p>Fresh Convenience at Your Fingertips: Your One-Stop Grocery App!</p><br>
        </div>

        
        <h3 v-if="!orders">Your cart is empty go to home to start adding to the cart</h3>

        
        
        <div v-else v-for="( { OID, Qty, prod }, index) in orders" :key="index" style = "width: 100%;">
            <div :id="'list-' + index" :style="{ width: '100%', marginBottom: index === orders.length - 1 ? '10vh' : '0' }">
                
                <div class="container-fluid shadow line-item" :style="{ width: '100%', marginTop: '5vh', display: 'flex' }">
               
                    <div class="row" :style="{ margin: 'auto', width: '100%', height: 'fit-content', padding: '1vw' }">
                        
                        <div class="col-3 text-wrap" :style="{ marginBottom: '0px' }">{{ prod.Name }}</div>
                        
                        <div v-if = "!editmode[index]" :id="prod.PID" class="col-2 text-wrap" :style="{ marginBottom: '0px' }">{{ Qty }} units</div>
                        <input v-if = "editmode[index]" :id="prod.PID" type='number' class="col-2" :value="Qty" @input ="update(index, $event.target.value, index)">
                        
                        <div class="col-3 text-wrap" :style="{ marginBottom: '0px' }"> &times; {{ prod.Price }} {{ prod.Unit }} </div>
                        
                        <div :class="['col-2', 'text-wrap', prod.PID]" :style="{ marginBottom: '0px' }">
                            Rs <span class="line-total">{{ (Qty * prod.Price).toFixed(3) }}</span>
                        </div>
                        
                        <div :id="'buttons-' + prod.PID" class="col-2 text-wrap" :style="{ marginBottom: '0px', padding: '0px' }">
                            
                            <button v-if = "!editmode[index]" type="button" class="btn btn-primary" @click="toggle_edit(index, Qty)">
                                Edit
                            </button>
                            <button v-if = "!editmode[index]" type="button" class="btn btn-danger" style='margin-left:1vw;' @click="del(prod.PID)">
                                Delete
                            </button>

                            <button v-if = "editmode[index]" type='button' class='btn btn-success' @click = 'save(prod.PID, Qty)'>
                                Save
                            </button>
                            <button v-if = "editmode[index]" type='button' class='btn btn-danger' style='margin-left:1vw;' @click = 'toggle_edit(index, Qty)'>
                                Cancel
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
            editmode: [],
            buffered_qty: [],
        }
    },
    computed: {
        // Use a computed property for totalCost
        // This will automatically update whenever the dependent values change
        totalCostComputed() {
          return this.orders.reduce((total, { Qty, prod }) => total + Qty * prod.Price, 0).toFixed(3);
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
        toggle_edit(ind, qty) {
            //console.log(ind, qty);
            this.$set(this.editmode, ind, !this.editmode[ind]);
            
            if(this.buffered_qty[ind] == 0)
                this.$set(this.buffered_qty, ind, qty);
            else{
                var new_ord = this.orders[ind]
                new_ord.Qty = this.buffered_qty[ind];
                //console.log(new_ord)
                this.$set(this.orders, ind, new_ord);
                this.$set(this.buffered_qty, ind, 0);
            }
        },
        update(pid, qty, index){
            // console.log(pid, qty, index);
            // console.log(this.orders[index])
            var new_ord = this.orders[index]
            new_ord.Qty = qty;
            //console.log(new_ord)
            this.$set(this.orders, index, new_ord);
        },
        async checkout() {
            var oid = this.orders[0].OID
            //console.log(oid, this.authToken, "here");
            var url = "/api/orders_desc";
            //console.log({"expense": this.totalCostComputed});
            fetch(url, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.authToken,
                    },
                    body: JSON.stringify({ "OID": oid, "expense": this.totalCostComputed}),
                })
                .then(response => {
                    response.json(); 
                    //console.log(response);
                    if (!response.ok) {
                        window.alert("Checkout failed!");
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
        async save(pid, qty) {
            var url = "/api/order_details";

            fetch(url, {
                    method: 'PUT',
                    headers: {
                    'Content-Type': 'application/json',
                    'Authentication-Token': this.authToken,
                    },
                    body: JSON.stringify({ "PID": pid, "Qty": qty, "email": this.email }),
                })
                .then(response => {
                    response.json(); 
                    //console.log(response);
                    if (!response.ok) {
                        window.alert("Update failed");
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
                    //console.log(response);
                    if (!response.ok) {
                        window.alert("Delete failed");
                    }
                    else{update
                        window.alert("Delete successful");
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

            for(var i = 0; i < data.length; i++){
                this.editmode.push(false)
                this.buffered_qty.push(0)
            }
            //console.log(this.buffered_qty)
        } else {
            console.log(data.message)
        }
    }
}