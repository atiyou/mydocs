var utag_resize,
    breakpoint = getBreakpoint($(window).innerWidth());

function getDisplay(width){
    if(width > 1024) display_type = "desktop";
    else if(width > 768 && width <= 1024) display_type = "tablet";
    else display_type = "smartphone";
    return display_type;
}

function getBreakpoint(width){
    if(width > 1024) display_breakpoint = "xl";
    else if(width > 768 && width <= 1024) display_breakpoint = "l";
    else if(width > 480 && width <= 768) display_breakpoint = "m";
    else display_breakpoint = "s";
    return display_breakpoint;
}

function getDevice(){
    var md = new MobileDetect(window.navigator.userAgent), device = "";
    if(md.mobile()==null) device = "desktop";
    else if(md.tablet()!=null) device = "tablet";
    else if(md.phone()!=null) device = "smartphone";
    else device = "other";
    return device;
}

function doneResizing(){
    var display = getDisplay($(window).innerWidth()),
        current_breakpoint = getBreakpoint($(window).innerWidth());

    if(typeof(utag_data)!="undefined"){
        if(current_breakpoint != breakpoint) {
            utag.view({displaytype: display});
            breakpoint = current_breakpoint;
        }
    }
}

$(window).resize(function() {
    clearTimeout(utag_resize);
    utag_resize = setTimeout(doneResizing, 300);
});
