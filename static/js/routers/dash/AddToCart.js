import NavBar from "./NavBar.js";

export default {
  template: `<div style="height: 100%;">
    <NavBar />
    <div id="content" class="container" style="background-color: rgba(255, 255, 255, 0.0);">
      <div id="form-wrap">
        <h4 class="mb-5">{{ prod.cat.Name }} - {{ prod.Name }}</h4>
        <form style="width: 50vw">
          <div class="row g-5 align-items-center mb-2">
            <div class="col-auto col-sm-3">
              <b><p>Availability:</p></b>
            </div>
            <div class="col-auto col-sm-6">
              <p>{{ prod.Stock > 0 ? 'In stock' : 'Out of Stock' }}</p>
            </div>
          </div>

          <div class="row g-5 align-items-center mb-4">
            <div class="col-auto col-sm-3" style="padding-right:0;">
              <b><label for="prod-qty" class="col-form-label">Quantity:</label></b>
            </div>
            <div class="col-auto col-sm-2" style="padding-left:0;">
              <input v-model="pqty" type="number"  class="form-control" id="prod-qty">
            </div>
            <div class="col-auto col-sm-1" style="padding:0;">
              <p>&times;</p>
            </div>
            <div class="col-auto col-sm-2" style="padding:0; text-align:right;">
              <p>Rs. {{ prod.Price }} </p>
            </div>
            <div class="col-auto col-sm-1" style="padding:0;">
              <p> /{{ prod.Unit }} </p>
            </div>
          </div>

          <div class="row g-5 align-items-center mb-4">
                <div class="col-auto col-sm-3">
                    <b><p>Total Price:</p></b>
                </div>
                <div class="col-auto col-sm-1" style="padding:0;">
                    <p id="total">{{ totalPrice }}</p>
                </div>
                <div class="col-auto col-sm-1" style="padding:0;">
                    <p> Rupees </p>
                </div>
            </div>

            <div class="col-5">
                <button
                type="button"
                class="btn btn-success"
                :disabled="prod.Stock === 0"
                @click="addToCart"
                >
                Add to cart
                </button>
                <a v-if="prod.Stock === 0">Go back to dashboard</a>
            </div>
        </form>
      </div>
    </div>
  </div>`,
components: {
    NavBar,
  },
  props: ['pid'],
  data() {
    return {
      user: localStorage.getItem('email'),
      prod: {
        Name: '',
        Stock: 0,
        PID: '',
        Price: 0,
        Unit: '',
        cat: {
            CID: 0,
            Name: ''

        }
      },
      authToken: localStorage.getItem('auth-token'),
      pqty: "0",
    };
  },

  
  computed: {
    // Define your computed properties here
    totalPrice() {
      // Replace this with your actual computed property logic
      return this.prod.Price * parseInt(this.pqty);
    },
  },
  methods: {
    addToCart() {
        const url = "/api/order_details";

        if (!this.pqty || parseInt(this.pqty) <= 0) {
            window.alert("Quantity has to be a value > 0");
            return;
        }

        console.log({ email: this.user, PID: this.pid, Qty: this.pqty });
        fetch(url, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': this.authToken,
            },
            body: JSON.stringify({ email: this.user, PID: this.pid, Qty: this.pqty }),
        })
            .then(response => response.json())
            .then((ret) => {
            if (ret.stat !== "success") {
                window.alert(ret.stat);
            }
            window.location.replace("/cart");
            })
            .catch((error) => {
            console.error('Error:', error);
            });
    },

    fadeIn(el) {
      var opacity = 0;
      var interval = setInterval(() => {
        if (opacity < 1) {
          opacity += 0.05;
          el.style.opacity = opacity;
        } else {
          clearInterval(interval);
        }
      }, 40);
    },

    load() {
      const el1 = document.getElementById("content");
      const el2 = document.getElementById("nav");

      if (el1 && el2) {
        el1.style.opacity = "0.0";
        el2.style.opacity = "0.0";

        setTimeout(() => {
          this.fadeIn(el1);
        }, 700);

        setTimeout(() => {
          this.fadeIn(el2);
        }, 700);
      } else {
        console.error("One or more elements not found.");
      }
    },
  },
  async mounted() {
    const res = await fetch(`/api/product/${this.pid}`, {
      headers: {
        'Authentication-Token': this.authToken,
      },
    });

    const data = await res.json();

    if (res.ok) {
      this.prod = data;
      //console.log(this.prod);
    } else {
      alert(data.message);
    }
    this.load();
  },
};
