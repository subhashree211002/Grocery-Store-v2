import NavBar from "../dash/NavBar.js"
import Content from "./Content.js"
export default {
    template:`<div>
                <NavBar />
                <Content />
              </div>
            `,
    components: {
        NavBar,
        Content,
    }
}