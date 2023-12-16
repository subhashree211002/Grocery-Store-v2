import NavBar from "./NavBar.js"
import Content from "./Content.js"

export default {
  name: 'Dashboard',
  template: `<div style = "height: 100%;">
    <NavBar />
    <Content />
  </div>`
  ,
  
  components: {
    NavBar,
    Content,
  },

  data() {
    return {
      role: localStorage.getItem('role'),
      columns: 0,
    }
  },

  methods: {
    fadeIn(el) {
      var opacity = 0; // Initial opacity
      var interval = setInterval(function() {
      if (opacity < 1) {
          opacity += 0.05;
          el.style.opacity = opacity;
      } else {
          clearInterval(interval); // Stop the interval when opacity reaches 0
      }
      }, 40);
    },

    fadeOut(el) {
      var opacity = 1;
      var interval = setInterval(() => {
        if (opacity > 0.04) {
          opacity -= 0.05;
          el.style.opacity = opacity;
        } else {
          el.style.opacity = 0;
          el.style.display = "none";
          clearInterval(interval);
        }
      }, 40);
    },
    load_buyer(){
      var el1 = document.getElementById("content");
      el1.style.opacity = "0.0";
      
      var el2 = document.getElementById("nav");
      el2.style.opacity = "0.0";
      setTimeout(() => {
        this.fadeIn(el1);
      }, 700);
    
      setTimeout(() => {
        this.fadeIn(el2);
      }, 700);
    },
    restructure(){
      var is = document.getElementById("initial-struct");
      var ns = document.createElement("div");
      ns.setAttribute("id", "new-struct")
      
      var nca = {};
      for (let j = 0; j < this.columns; j++) {
          nca[j] = document.createElement("div");
          nca[j].classList.add("column");
      }
      //console.log(nca);
      
      var i = 0
      var chl = Array.from(is.children);
      for (let ch of chl) {
          is.removeChild(ch);
          nca[i%this.columns].appendChild(ch);
          //console.log(ch);
          i+=1;
      }   
  
      for (let j = 0; j < this.columns; j++) {
          ns.appendChild(nca[j]);
      }
  
      document.getElementById("content").appendChild(ns);
    },
    load_manager(){
      //console.log("hereee");
      var el1 = document.getElementById("content");
      el1.style.opacity = "0.0";
      
      var el2 = document.getElementById("nav");
      el2.style.opacity = "0.0";

      this.columns = 0;
      var sw = window.screen.width      
      if(sw < 768){
        this.columns = 1
      }
      else if(sw < 992){
        this.columns = 2
      }
      else if(sw < 1200){
        this.columns = 3
      }
      else{
        this.columns = 4
      }
      
      setTimeout(() => {
        this.fadeIn(el1);
      }, 700);
    
      setTimeout(() => {
        this.fadeIn(el2);
      }, 700);
  
      setTimeout(() => {
        this.restructure();
      }, 800);  
      
      //window.alert(document.getElementsByClassName('delProdBtn').length)
      var bts = document.getElementsByClassName('delProdBtn');
      for(var i = 0; i < bts.length; i++){
          bts[i].addEventListener('click', function () {
              // Show the Bootstrap modal when the button is clicked
              $('#confirmationModal-1').modal('show');
          });
      }
  
      bts = document.getElementsByClassName('delCatBtn');
      for(var i = 0; i < bts.length; i++){
          bts[i].addEventListener('click', function () {
              // Show the Bootstrap modal when the button is clicked
              $('#confirmationModal-2').modal('show');
          });
      }
      
      // Attach a click event handler to the "Confirm" button inside the modal
      document.getElementById('confirmActionBtn-1').addEventListener('click', function () {
          // Perform the action here, e.g., submit a form or execute some function
          del_prod();
          // ...
  
          // Close the modal after the action is performed
          $('#confirmationModal-1').modal('hide');
      });
  
      // Attach a click event handler to the "Confirm" button inside the modal
      document.getElementById('confirmActionBtn-2').addEventListener('click', function () {
          // Perform the action here, e.g., submit a form or execute some function
          del_cat();
          // ...
  
          // Close the modal after the action is performed
          $('#confirmationModal-2').modal('hide');
      });
    }
  },

  mounted(){
    if(this.role === 'buyer'){
      this.load_buyer();
    }
    else if(this.role === 'store_manager' || this.role === 'admin'){
      this.load_manager();
    }
        
  }

}
