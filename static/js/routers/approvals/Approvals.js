import NavBar from "../dash/NavBar.js"
import Managers from "./Managers.js"
import Category from "./Category.js"
export default {
    template:`<div>
      <NavBar />
      <div id="content" style = "width: 90%; margin: auto; display: flex; flex-direction: row;">
        <div id="manager-app" style = "width: 50%; height: 100%; border: 10px solid white; display: flex; flex-direction: column;">
          <div style = "background-color: rgba(255, 255, 255, 0.5);">
            <center><h3>Manager Login Requests</h3></center>
          </div>
          <Managers />
        </div>
        
        <div id="category-app" style = "width: 50%; height: 100%; border: 10px solid white; display: flex; flex-direction: column;">
          <div style = "background-color: rgba(255, 255, 255, 0.5);">
            <center><h3>Category Approval Requests</h3></center>
          </div>
          <Category />
        </div>
      </div>
    </div>
            `,
    components: {
        NavBar,
        Managers,
        Category,
    }
}