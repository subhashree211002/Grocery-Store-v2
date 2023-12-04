function edittable(pid, oid, curr_qt, price, bt_ele){
    var ele = document.getElementById(pid);
    ele.innerHTML = "<input id = 'ip"+pid+"' type='number' class='form-control' oninput = 'update("+pid+","+price+")' value='"+curr_qt+"'>"
    parent = bt_ele.parentNode
    parent.removeChild(bt_ele); 
    parent.innerHTML = "<button type='button' class='btn btn-success' onclick = 'save("+oid+","+pid+")'>Save</button>";
    parent.innerHTML += "<button type='button' class='btn btn-danger' style='margin-left:1vw;' onclick = 'cancel("+pid+","+oid+","+curr_qt+","+price+")'>Cancel</button>"
}

function update(pid, price){
    //window.alert(pid, price);
    var ele = document.getElementsByClassName(pid)[0];
    ele.innerHTML = "Rs <span class='line-total'>"+(parseInt(document.getElementById("ip"+pid).value)*parseFloat(price))+"</span>"
    calc();
}

function save(oid, pid){
    var q = ""
    q = parseInt(document.getElementById("ip"+pid).value);
    var url = "/update_item";

    //window.alert(oid, pid, document.getElementById("ip"+pid));

    
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var ret = JSON.parse(xhttp.responseText);
            if(ret.stat == "success"){
                location.reload();
            }
            else{
                window.alert("Something went wrong!");
            }
        }
    };
    
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    var data = { oid: oid, pid: pid, qty: q};
    xhttp.send(JSON.stringify(data));
}

function cancel(pid, oid, curr_qt, price){
    var ele = document.getElementById(pid);
    ele.innerHTML = curr_qt+" units";
    var parent = document.getElementById("buttons-"+pid)
    parent.innerHTML = "<button type='button' class='btn btn-primary' onclick = 'edittable("+pid+","+oid+","+curr_qt+","+price+", this)'>Edit</button>"
    parent.innerHTML += "<button type='button' class='btn btn-danger' style='margin-left:1vw;' onclick = 'del("+pid+", "+oid+")'>Delete</button>"

}

function del(pid, oid){
    //window.alert(pid +","+ oid);
    var url = "/del_item";

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var ret = JSON.parse(xhttp.responseText);
            if(ret.stat == "success"){
                location.reload();
            }
            else{
                window.alert("Something went wrong!");
            }
        }
    };
    
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    var data = { oid: oid, pid: pid};
    xhttp.send(JSON.stringify(data));
}

function checkout(usr, oid){
    //window.alert(oid);
    const currentDate = new Date();
    const isoDateTime = currentDate.toISOString();

    var url = "/checkout_cart";

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var ret = JSON.parse(xhttp.responseText);
            if(ret.stat == "success"){
                window.alert("Checkout succesful");
                window.location.href = "/"+usr+"/user_dashboard";
            }
            else{
                window.alert("Something went wrong!");
            }
        }
    };
    
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    var data = { oid: oid, date: isoDateTime };
    xhttp.send(JSON.stringify(data));
}