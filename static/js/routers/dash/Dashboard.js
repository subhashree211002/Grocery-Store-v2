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

    load(){
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
  },

  mounted(){
    this.load();    
  }

}
