const bodyStyles = {
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    background: 'black',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundImage: `url("static/images/login.jpg")`,
};

const applyStyles = (element, styles) => {
    Object.assign(element.style, styles);
};
export default {
    name: 'Login',
    template: `
      <div>
        <div id="choose" class="container">
          <div class="wrapper">
            <h1>Welcome! Please choose one :)</h1>
            <div class="d-flex justify-content-evenly" style="margin-top:3vh;">
              <div class="border shadow" @click="Login"><b>Login / Sign in</b></div>
              <div class="border shadow" @click="Registration"><b>Register / Sign up</b></div>
            </div>
          </div>
        </div>
  
        <div id="usr-login" class="container">
          <form style="width:50vw">
            <div class="mb-5 cls-btn">
              <button type="button" class="btn-close" aria-label="Close" @click="cls('2')"></button>
            </div>
            <div class="mb-5 col-3" style="margin:auto;">
              <h3>Login / Sign in</h3>
            </div>
            <div class="mb-5 col-6" style="margin:auto;">
              <p style="color:red;" class="feedback">{{error}}</p>
              <label for="user_name-2" class="form-label">User Name</label>
              <input type="email" class="form-control" id="user_name-2" v-model="login_cred.email">
            </div>
  
            <div class="mb-5 col-6" style="margin:auto;">
              <label for="pwd-2" class="form-label">Password</label>
              <input type="password" class="form-control" id="pwd-2" v-model="login_cred.password">
            </div>
  
            <div class="mb-5 col-6" style="margin:auto;">
              <button type="button" class="btn btn-primary" style="justify-content:center;" @click="val">Login</button>
            </div>
          </form>
        </div>
  
        <div id="usr-regn" class="container">
          <form style="width:50vw">
            <div class="mb-3 cls-btn">
              <button type="button" class="btn-close" aria-label="Close" @click="cls('3')"></button>
            </div>
            <div class="mb-3 col-4" style="margin:auto;">
              <h3>Register / Sign up</h3>
            </div>
            <div class="mb-3 col-6" style="margin:auto;">
              <p style="color:red;" class="feedback"></p>
              <label for="user_name-3" class="form-label">User Name</label>
              <input type="text" class="form-control" id="user_name-3">
            </div>
  
            <div class="mb-3 col-6" style="margin:auto;">
              <label for="pwd-3" class="form-label">Password</label>
              <input type="password" class="form-control" id="pwd-3">
            </div>
  
            <div class="mb-4 col-6" style="margin:auto;">
              <label for="pwd-4" class="form-label">Re enter password</label>
              <input type="password" class="form-control" id="pwd-4">
            </div>
  
            <div class="mb-5 col-6" style="margin:auto;">
              <button type="button" class="btn btn-primary" style="justify-content:center;" @click="reg()">Login</button>
            </div>
          </form>
        </div>
      </div>
    `,
    data() {
        return {
          cred: {
            email: null,
            password: null,
          },
          login_cred: {
            email: null,
            password: null,
          },
          error: null,
        }
    },
    methods: {
        Login() {
          var el1 = document.getElementById("choose");
          var el3 = document.getElementById("usr-login");
          this.fadeOut(el1);
          setTimeout(() => {
            el3.style.display = "block";
            this.fadeIn(el3);
          }, 500);
        },
      
        Registration() {
          var el1 = document.getElementById("choose");
          var el4 = document.getElementById("usr-regn");
          this.fadeOut(el1);
          setTimeout(() => {
            el4.style.display = "block";
            this.fadeIn(el4);
          }, 500);
        },
      
        cls(i) {
          var el1 = document.getElementById("choose");
          var el3 = document.getElementById("usr-login");
          var el4 = document.getElementById("usr-regn");
          if (i == 2) {
            this.fadeOut(el3);
          }
          if (i == 3) {
            this.fadeOut(el4);
          }
          setTimeout(() => {
            el1.style.display = "flex";
            this.fadeIn(el1);
          }, 500);
        },
      
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
      

        
        async val() {
            const res = await fetch('/user-login', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.login_cred),
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('auth-token', data.token);
                localStorage.setItem('role', data.role);
                localStorage.setItem('email', data.email);
                window.location.href = '/dash';
            } else {
                this.error = data.message;
            }
        },
        reg() {
            // Implement your reg logic
        },
    },
    mounted() {
        applyStyles(document.body, bodyStyles);
        document.title = 'Login | Grocery Store';

        
        var el1 = document.getElementById("choose");
        var el3 = document.getElementById("usr-login");
        var el4 = document.getElementById("usr-regn");
            
        el1.style.opacity = "0.0";
        setTimeout(() => {
            this.fadeIn(el1);  // 'this' is automatically bound to the Vue instance
        }, 700);
    },
  };
  