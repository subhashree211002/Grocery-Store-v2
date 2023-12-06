export default {
    template: `
    <div :class="['card', 'cat', 'shadow', cat.Name]" :id = "cat.CID" >
        <div class="card-body">
            <h5 class="card-title mb-5">{{ cat.Name }}</h5>
            <p class="card-text">
                <div v-for = "prod in cat.products" :class="['card', prod, 'shadow']" :id = "prod.PID" style = "width: 100%;" >
                    <div class="card-body card-body-prod" :id="prod.Name">
                        <p class="card-text">{{ prod.Name }}</p>
                        <p class="card-text">Price: Rs <span class="price">{{ prod.Price }}</span><span> </span> {{ prod.Unit }}</p>
                        <button type="button" class="btn btn-primary edit-cat" @click = "edit_prod(cat.CID, prod.PID)">Edit/View</button>
                        <button type="button" class="btn btn-danger del-cat delProdBtn"  @click = "del_prod(prod.PID)">Delete</button>
                    </div>
                </div>
                <p v-if = "!cat.products?.length" class="mb-4"> No items have been added yet </p>
            </p>
            <div class = "add-prod mb-3" @click = "add_prod(cat.CID)">
                <img :src = "getUrl('static', 'images/add-icon.jpg')">Add product<br><br>
            </div>
            <button type="button" class="btn btn-primary edit-cat mb-3" @click = "edit_cat(cat.CID)">Edit/View Category</button>
            <button type="button" class="btn btn-danger del-cat delCatBtn"  @click = "del_cat(cat.CID)" >Delete Category</button>
        </div>
    </div>`,
    props: ['cat'],
    data() {
      return {
        authToken: localStorage.getItem('auth-token'),
      }
    },
    methods: {
      getUrl(folder, filename) {
        // Add any necessary logic here to construct the URL
        return `${folder}/${filename}`;
      },
      add_prod(CID){
        window.location.href = `/add_edit_prod/${CID}/0`;
      },
      edit_prod(CID, PID){
        window.location.href = `/add_edit_prod/${CID}/${PID}`;
      },
      async del_prod(PID){

        var url = "/api/products/"+PID;
        const res = await fetch(url, {
          method: 'DELETE',
          headers: {
          'Content-Type': 'application/json',
          'Authentication-Token': this.authToken,
          },
        });

        var data = await res.json();
        if (res.ok) {
            window.alert(data.message);
            window.location.reload()
        } else {
           window.alert("Error!");
        }
      },

      edit_cat(CID){
        //console.log(CID);
        window.location.href = `/edit_cat/${CID}`;
      },
      del_cat(CID){
        //console.log(CID);
        //window.location.href = `/edit_cat/cat_${CID}`;
      },
    },
}