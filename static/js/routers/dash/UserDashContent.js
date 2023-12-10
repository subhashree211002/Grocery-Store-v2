export default {
    template: `<div id="list" style="width: 100%;">
      <div :id="cat.Name" class="container-fluid shadow line-item" style="width: 100%; margin-top: 5vh;">
        <div class="row" style="margin-left: 1vw; padding-top: 3vh">
          <h3>{{ cat.Name }}</h3>
        </div>
        <div class="row cat" style="margin: auto; width: 100%; height: fit-content; padding: 1vw; overflow-x: auto;">
          <div v-for="prod in cat.products" :key="prod.Name" :id="prod.Name" class="card prod shadow" style="margin-left: 1vw;">
            <div class="card-body" style="padding-left: 0px;">
              <div class="card-text row" style="margin: auto">
                <p class="col-5" style="text-align: left; padding: 0;">{{ prod.Name }}</p>
                <p class="col-4" style="text-align: right; padding-left: 0; padding-right: 0;">Rs <span class="price">{{ prod.Price }}</span></p>
                <p class="col-3" style="text-align: left; padding: 0; text-align: left;">{{ prod.Unit }}</p>
              </div>
              <button type="button" class="btn btn-primary edit-cat" @click="buyProduct(prod.PID)">Buy</button>
              <img :src="getUrl('static', 'images/cart.png')" style="width: 15%">
            </div>
          </div>
          <p v-if="!cat.products?.length" class="mb-4">Items arriving Soon</p>

        </div>
      </div>
    </div>`,
    props: ['cat'],
    methods: {
      getUrl(folder, filename) {
        // Add any necessary logic here to construct the URL
        return `${folder}/${filename}`;
      },
      buyProduct(productId) {
        // Implement logic to handle buying a product
        // You can use productId to identify the selected product
        this.$router.push({ path: `/add_to_cart/${productId}` });
      },
    },
}