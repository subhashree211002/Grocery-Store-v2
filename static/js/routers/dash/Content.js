import UserDashContent from "./UserDashContent.js";

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

    <UserDashContent v-for="cat in categories" :key="cat.Name" :cat = "cat"/>
    </div>`,
    data() {
        return {
            authToken: localStorage.getItem('auth-token'),
            categories: [], // Replace with your actual data
            selectedFilter: '0',
            filterInput: '',
        };
    },
    components: {
        UserDashContent,
    },
    methods: {
        applyFilter() {
            var lines = document.getElementsByClassName("line-item");
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
                const children = parent.querySelectorAll('.prod');
                children.forEach((child) => {
                child.style.display = "";
                });
                parent.style.display = "";
            }
        },

        filterByCategory(lines, value) {
            this.showall(lines);
            for (var i = 0; i < lines.length; i++) {
                if (lines[i].id.toLowerCase().indexOf(value) == -1) {
                    lines[i].style.display = "none";
                }
            }
        },

        filterByProduct(lines, value) {
            this.showall(lines);
            for (var i = 0; i < lines.length; i++) {
                var flag = 0;
                const parent = lines[i];
                const children = parent.querySelectorAll('.prod');
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
            }
        },

        filterByPrice(lines, value) {
            this.showall(lines);
            for (var i = 0; i < lines.length; i++) {
                var flag = 0;
                const parent = lines[i];
                const children = parent.querySelectorAll('.prod');
                children.forEach((child) => {
                var childPrice = parseFloat(child.querySelector('.price').innerHTML);
                if (childPrice <= value) {
                    flag = 1;
                    child.style.display = "";
                } else {
                    child.style.display = "none";
                }
                });

                if (flag != 1) {
                parent.style.display = "none";
                }
            }
        },
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