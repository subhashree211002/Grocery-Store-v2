export default{
    template: `<nav id = "nav" class="navbar sticky-top bg-body-tertiary text-center">
        <div class="nav" style = "text-align:left;">
            {{ user }}'s Dashboard
        </div>

        <div v-if="userRole=='admin'" class="clickable nav shadow-sm" style = "margin-left:auto;text-align:right; border-right:2px solid black;">
            <a href="/{{ user }}/allow" style = "text-decoration:none; color:black;">Validate Instructors</a>
        </div>
        <div v-if="userRole=='store_manager'" class="clickable nav shadow-sm" style = "margin-left:auto;text-align:right; border-right:2px solid black;">
            <a href="/{{ user }}/summary" style = "text-decoration:none; color:black;">Summary</a>
        </div>
        <div v-if="userRole=='buyer'" class="clickable nav shadow-sm" style = "margin-left:auto;text-align:right; border-right:2px solid black;">
            <a href="/{{ user }}/cart" style = "text-decoration:none; color:black;">Cart</a>
        </div>

        <div class="clickable nav shadow-sm" style = "margin-right:1vh; text-align:left;">
            <div @click=logout>Logout</div>
        </div>
    </nav>`,
    data() {
        return {
          userRole: localStorage.getItem('role'),
        }
    },
    methods: {
        logout() {
            localStorage.clear();
            window.location.href = "/login_page";
        },
    }
}