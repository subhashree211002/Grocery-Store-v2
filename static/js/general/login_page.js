export function cls(i){
    if(i==1){
        fadeOut(el2); 
    } 
    if(i==2){
        fadeOut(el3);
    }
    if(i==3){
        fadeOut(el4);
    }
    setTimeout(function(){
        el1.style.display = "flex";
        fadeIn(el1);
    }, 500);
    
}

export function userlogin(){
    fadeOut(el1);
    setTimeout(function(){
        el3.style.display = "block";
        fadeIn(el3);
    }, 500);
}

export function userregn(){
    fadeOut(el1);
    setTimeout(function(){
        el4.style.display = "block";
        fadeIn(el4);
    }, 500);
}

export function val(choose){
    var u = "";
    var p = "";
    var url = "/validate/";

    if(choose == 1){
        u = document.getElementById("user_name-1").value;
        p = document.getElementById("pwd-1").value;
        url = "/validate/manager";
    }
    if(choose == 2){
        u = document.getElementById("user_name-2").value;
        p = document.getElementById("pwd-2").value;
        url = "/validate/user";
    }

    if(u == "" || p == ""){
        document.getElementsByClassName("feedback")[choose-1].innerHTML="Both username and password are mandatory fields";
        return;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var ret = JSON.parse(xhttp.responseText);
            //window.alert(ret.stat);
            if(ret.stat == "invalid"){
                document.getElementsByClassName("feedback")[choose-1].innerHTML="Incorrect username or password";
            }
            else if(ret.stat == "valid"){
                //window.alert("Logging in!");
                if(choose == 1)
                    window.location.href = "/"+u+"/manager_dashboard";
                else if(choose == 2)
                    window.location.href = "/"+u+"/user_dashboard";
            } 
        }
    };
    
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    var data = { uname: u, pwd:p };
    xhttp.send(JSON.stringify(data));
}

export function reg(){
    var u = "";
    var p = "";
    var url = "/register_user";

    if(document.getElementById("pwd-4").value == ""){
        document.getElementsByClassName("feedback")[2].innerHTML="Please re enter password to proceed!";
        return;
    }

    u = document.getElementById("user_name-3").value;
    p = document.getElementById("pwd-3").value;
    
    if(document.getElementById("pwd-4").value != p){
        document.getElementsByClassName("feedback")[2].innerHTML="Entered passwords do not match!";
        return;
    }

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var ret = JSON.parse(xhttp.responseText);
            if(ret.stat == "valid"){
                window.location.href = "/"+u+"/user_dashboard";
            }
            document.getElementsByClassName("feedback")[2].innerHTML=ret.stat;
        }
    };
    
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    var data = { uname: u, pwd:p };
    xhttp.send(JSON.stringify(data));
}