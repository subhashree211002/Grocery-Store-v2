export default{
    template: `<nav id = "nav" class="navbar sticky-top bg-body-tertiary text-center">
        <div class="nav" style = "text-align:left;">
            {{ email }}'s Dashboard
        </div>

        <div v-if="userRole=='admin'" class="clickable nav shadow-sm" style = "margin-left:auto;text-align:right; border-right:2px solid black;">
            <div @click=logout>Validate Instructors</div>
        </div>
        <div v-if="userRole=='store_manager'" class="clickable nav shadow-sm" style = "margin-left:auto;text-align:right; border-right:2px solid black;">
            <div @click=logout>Summary</div>
        </div>
        <div v-if="userRole=='buyer'" class="clickable nav shadow-sm" style = "margin-left:auto;text-align:right; border-right:2px solid black;">
            <div @click=cart>Cart</div>
        </div>

        <div class="clickable nav shadow-sm" style = "margin-right:1vh; text-align:left;">
            <div @click=logout>Logout</div>
        </div>
    </nav>`,
    data() {
        return {
          userRole: localStorage.getItem('role'),
          email: localStorage.getItem('email'),
        }
    },
    methods: {
        logout() {
            localStorage.clear();
            window.location.href = "/login_page";
        },
        cart(){
            window.location.href = "/cart";
        }
    },
}