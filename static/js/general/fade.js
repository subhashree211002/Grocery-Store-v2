function fadeIn(el) {
    var opacity = 0; // Initial opacity
    var interval = setInterval(function() {
    if (opacity < 1) {
        opacity += 0.05;
        el.style.opacity = opacity;
    } else {
        clearInterval(interval); // Stop the interval when opacity reaches 0
    }
    }, 40);
}

function fadeOut(el) {
    var opacity = 1; // Initial opacity
    var interval = setInterval(function() {
    if (opacity > 0.04) {
        opacity -= 0.05;
        el.style.opacity = opacity;
    } else {
        el.style.opacity = 0;
        el.style.display = "none";
        clearInterval(interval); // Stop the interval when opacity reaches 0
    }
    }, 40);
}