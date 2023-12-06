function updateTotalCost() {
    this.totalCost = this.totalCostComputed;
}
function  editTable(pid, oid, curr_qt, price, email) {
    var bt_ele = document.getElementById("edit-btn-"+pid);
    console.log(pid, bt_ele) ;
    var ele = document.getElementById(pid);
    ele.innerHTML = "<input id = 'ip"+pid+"' type='number' class='form-control' oninput = 'update("+pid+","+price+")' value='"+curr_qt+"'>"
    parent = bt_ele.parentNode
    parent.removeChild(bt_ele); 
    parent.innerHTML = "<button type='button' class='btn btn-success' onclick = 'save("+pid+",'"+email+"')'>Save</button>";
    parent.innerHTML += "<button type='button' class='btn btn-danger' style='margin-left:1vw;' onclick = 'cancel("+pid+","+oid+","+curr_qt+","+price+","+email+")'>Cancel</button>"
}
function cancel(pid, oid, curr_qt, price, email){
    var ele = document.getElementById(pid);
    ele.innerHTML = curr_qt+" units";
    var parent = document.getElementById("buttons-"+pid)
    parent.innerHTML = "<button id = 'edit-btn-"+pid+"' type='button' class='btn btn-primary' onclick = 'editTable("+pid+","+oid+","+curr_qt+","+price+","+email+")'>Edit</button>"
    parent.innerHTML += "<button type='button' class='btn btn-danger' style='margin-left:1vw;' onclick = 'del("+pid+")'>Delete</button>"

}
function update(pid, price){
    //window.alert(pid, price);
    var ele = document.getElementsByClassName(pid)[0];
    ele.innerHTML = "Rs <span class='line-total'>"+(parseInt(document.getElementById("ip"+pid).value)*parseFloat(price))+"</span>"
    //calc();
}

function save(pid, email){
    var url = "/api/order_details";
    //q = parseInt(document.getElementById("ip"+pid).value);
    console.log(document.getElementById("ip"+pid))
    console.log(JSON.stringify({ "PID": pid, "email": this.email, "Qty": parseInt(document.getElementById("ip"+pid).value)}));
    return;
    fetch(url, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            'Authentication-Token': this.authToken,
            },
            body: JSON.stringify({ "PID": pid, "email": this.email, "Qty": parseInt(document.getElementById("ip"+pid).value)}),
        })
        .then(response => {
            response.json(); 
            console.log(response);
            if (!response.ok) {
                window.alert("failure");
            }
            else{
                window.alert("Update successful");
                window.location.reload();
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        }
    );
}