export default{
    template: `<nav id = "nav" class="navbar sticky-top bg-body-tertiary text-center">
        <div class="nav" style = "text-align:left;">
            {{ email }}'s Dashboard
        </div>

        <div class="clickable nav shadow-sm" style = "margin-left:auto;text-align:right; border-right:2px solid black;">
            <div @click="dash">Dashboard</div>
        </div>

        <div v-if="userRole=='store_manager'" class="clickable nav shadow-sm" style = "text-align:right; border-right:2px solid black;">
            <div @click="export_csv">Export Product Details</div>
        </div>

        <div v-if="userRole=='admin'" class="clickable nav shadow-sm" style = "text-align:right; border-right:2px solid black;">
            <div @click="approve">Approvals</div>
        </div>
        <div v-if="userRole=='store_manager'" class="clickable nav shadow-sm" style = "text-align:right; border-right:2px solid black;">
            <div @click=summary>Summary</div>
        </div>
        <div v-if="userRole=='buyer'" class="clickable nav shadow-sm" style = "text-align:right; border-right:2px solid black;">
            <div @click=cart>Cart</div>
        </div>

        <div class="clickable nav shadow-sm" style = "margin-right:1vh; text-align:left;">
            <div @click="logout">Logout</div>
        </div>
    </nav>`,
    data() {
        return {
          userRole: localStorage.getItem('role'),
          email: localStorage.getItem('email'),
          isWaiting: false,
        }
    },
    methods: {
        logout() {
            localStorage.clear();
            window.location.href = "/login_page";
        },
        cart(){
            window.location.href = "/cart";
        },
        approve(){
            window.location.href = "/approve";
        },
        summary(){
            window.location.href = "/summary";
        },
        dash(){
            window.location.href = "/dash";
        },
        async export_csv(){
            this.isWaiting = true
            const res = await fetch('/download-csv')
            const data = await res.json()
            if (res.ok) {
                const taskId = data['task-id']
                const intv = setInterval(async () => {
                const csv_res = await fetch(`/get-csv/${taskId}`)
                if (csv_res.ok) {
                    this.isWaiting = false
                    clearInterval(intv)
                    window.location.href = `/get-csv/${taskId}`
                    window.alert("File exported");
                }
                }, 1000)
            }
            
        }
    },
}