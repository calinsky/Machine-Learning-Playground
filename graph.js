function load() {
    $("#canvas").click(function( e ) { getPosition(e); });
    drawAxes();
}

var pointSize = 5;
var arrayForMatrix = new Array()

// When the user clicks on div, open the popup
function myFunction() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
}

function getPosition(event){
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    var color = "#0ECB48"; /* Green */
    var color_name = "green"
    var color_num = 0

    if (event.shiftKey) {
        color = "#ff2626"; /* Red */
        color_name = "red"
        color_num = 1
    }
    arrayForMatrix.push(x,y,color_num)
    
    drawCoordinates(x,y,color);
}

function drawCoordinates(x,y,color){	
    var ctx = document.getElementById("canvas").getContext("2d");


    ctx.fillStyle = color; // Red color

    ctx.beginPath();
    ctx.arc(x, y, pointSize, 0, Math.PI * 2, true);
    ctx.fill();
}

var canvas_width  = 760
var canvas_height = 400

var x_drawx = 50
var y_drawx = canvas_height/2.0

var x_drawy = canvas_width /2.0
var y_drawy = x_drawx

var pad = 5
var unitDistance = 20

function drawAxes() {
    var c = document.getElementById("canvas")
    var ctx = c.getContext("2d")

    // DRAW GRID
    var space = 0;
    for (var i = 0; i < 19; i++) {
        ctx.beginPath()
        ctx.strokeStyle = "#e8dcca"
        ctx.moveTo(x_drawy + space,                0)
        ctx.lineTo(x_drawy + space, canvas_height)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(x_drawy - space,                0)
        ctx.lineTo(x_drawy - space, canvas_height)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(           0, y_drawx + space)
        ctx.lineTo(canvas_width, y_drawx + space)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(           0, y_drawx - space)
        ctx.lineTo(canvas_width, y_drawx - space)
        ctx.stroke()
        space += unitDistance;
    }


    // DRAW X-AXIS
    // draw x-axis line
    ctx.beginPath()
    ctx.strokeStyle = "black"
    ctx.moveTo(               x_drawx, y_drawx)
    ctx.lineTo(canvas_width - x_drawx, y_drawx)
    ctx.stroke()

    // triangle left
    ctx.beginPath()
    ctx.moveTo(x_drawx     , y_drawx     )
    ctx.lineTo(x_drawx +pad, y_drawx +pad)
    ctx.lineTo(x_drawx +pad, y_drawx -pad)
    ctx.fillStyle = "black"
    ctx.fill()

    // triangle right
    ctx.beginPath()
    ctx.moveTo(canvas_width - x_drawx     , y_drawx     )
    ctx.lineTo(canvas_width - x_drawx -pad, y_drawx +pad)
    ctx.lineTo(canvas_width - x_drawx -pad, y_drawx -pad)
    ctx.fill()

    // DRAW Y-AXIS
    // draw y-axis line
    ctx.beginPath()
    ctx.moveTo(x_drawy,                 y_drawy)
    ctx.lineTo(x_drawy, canvas_height - y_drawy)
    ctx.stroke()

    // triangle up
    ctx.beginPath();
    ctx.moveTo(x_drawy     , y_drawy     );
    ctx.lineTo(x_drawy -pad, y_drawy +pad);
    ctx.lineTo(x_drawy +pad, y_drawy +pad);
    ctx.fill();

    // triangle down
    ctx.beginPath();
    ctx.moveTo(x_drawy     , canvas_height - y_drawy     );
    ctx.lineTo(x_drawy -pad, canvas_height - y_drawy -pad);
    ctx.lineTo(x_drawy +pad, canvas_height - y_drawy -pad);
    ctx.fill();
}


function resetBtn() {
    // remove coordinates print1-out
    $("pre").empty();
    
    // remove "under construction" text
    $("#result").empty();
    
    // reset arrayForMatrix
    arrayForMatrix = new Array()
    
    // reset grid
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawAxes();
}

// Coordinate system switching functions
function arrayXPhysicalToLogicalCoordSys( arrayXPhys ) {
    var arrayXLogical = new Array()
    for (var i = 0; i < arrayXPhys.length; i++) {
        arrayXLogical.push((arrayXPhys[i] - canvas_width/2)/unitDistance)
    }
    return arrayXLogical
}

function arrayYPhysicalToLogicalCoordSys( arrayYPhys ) {
    var arrayYLogical = new Array()
    for (var i = 0; i < arrayYPhys.length; i++) {
        arrayYLogical.push(((arrayYPhys[i] - canvas_height/2)/unitDistance) *(-1))
    }
    return arrayYLogical
}

function arrayXLogicalToPhysicalCoordSys( arrayXLogical ) {
    var arrayXPhys = new Array()
    for (var i = 0; i < arrayXLogical.length; i++) {
        arrayXPhys.push((arrayXLogical[i] *unitDistance + canvas_width/2))
    }
    return arrayXPhys
}

function arrayYLogicalToPhysicalCoordSys( arrayYLogical ) {
    var arrayYPhys = new Array()
    for (var i = 0; i < arrayYLogical.length; i++) {
        arrayYPhys.push((arrayYLogical[i] *unitDistance *(-1) + canvas_height/2) )
    }
    return arrayYPhys
}

function getPhysX( x ) {
    return x *unitDistance + canvas_width/2
}

function getPhysY( y ) {
    return y *unitDistance *(-1) + canvas_height/2
}

function getLogX( x ) {
    return (x - canvas_width/2)/unitDistance
}

function getLogY( y ) {
    return ((y - canvas_height/2)/unitDistance) *(-1)
}

function getMinLogX() {
    return getLogX(0)
}

function getMaxLogX() {
    return getLogX(canvas_width)
}

function getMinLogY() {
    return getLogY(canvas_height)
}

function getMaxLogY() {
    return getLogY(0)
}

/* Global variables for ML functions */
var isGreen = false;
var arrayGreenX = new Array();
var arrayGreenY = new Array();

var isRed = false;
var arrayRedX = new Array();
var arrayRedY = new Array();

$(window).ready(load)