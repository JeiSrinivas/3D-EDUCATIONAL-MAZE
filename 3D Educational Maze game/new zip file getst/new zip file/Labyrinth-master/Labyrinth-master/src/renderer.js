//----------------------------------------------------------
// Screen setup
//----------------------------------------------------------

function initScreen() {

    var screen = $("screen");

    screen.style.height = screenHeight + 'px';
    screen.style.width = screenWidth + 'px';

    for (var i = 0; i < screenWidth; i += stripWidth) {
        var strip = document.createElement("div");
        strip.style.position = "absolute";
        strip.style.left = i + "px";
        strip.style.width = stripWidth + "px";
        strip.style.overflow = "hidden";

        var img = new Image();
        img.src = ("src/assets/walls.png");
        img.style.position = "absolute";
        img.prevStyle = {
            height: 0,
            width: 0,
            top: 0,
            left: 0
        }
        strip.appendChild(img);
        strip.img = img;

        var fog = document.createElement("span");
        fog.style.position = "absolute";
        strip.appendChild(fog);
        strip.fog = fog;

        screenStrips.push(strip);
        screen.appendChild(strip);
    }
}

//----------------------------------------------------------
// Screen / FOV variables
//----------------------------------------------------------

var screenWidth = 1024;
var screenHeight = 768;
var screenStrips = [];
var numoftex = 3;
var stripWidth = 2;
var fov = 80 * Math.PI / 180;
var numofrays = Math.ceil(screenWidth / stripWidth);
var viewDist = (screenWidth / 2) / Math.tan((fov / 2));

//----------------------------------------------------------
// Background rendering
//----------------------------------------------------------

updateBackground = function () {
    var ceiling = $("ceiling");
    // horizontal scroll for ceiling texture
    ceiling.style.backgroundPosition = -200 * player.rotation + "px " + (100 + player.pitch * 2) + "%";
}

//----------------------------------------------------------
// Raycasting
//----------------------------------------------------------

castRays = function () {
    var stripIdx = 0;

    for (var i = 0; i < numofrays; i++) {
        // where on the screen does ray go through
        var rayScreenPos = (-numofrays / 2 + i) * stripWidth;
        // distance from viewer to screen
        var rayViewDist = Math.sqrt(rayScreenPos * rayScreenPos + viewDist * viewDist);
        // relative angle
        var rayAngle = Math.asin(rayScreenPos / rayViewDist);

        castRay(
            player.rotation + rayAngle,
            stripIdx++
        );
    }
}

//----------------------------------------------------------
// Single ray
//----------------------------------------------------------

castRay = function (rayAngle, stripIdx) {

    // normalize angle
    rayAngle %= Math.PI * 2;
    if (rayAngle < 0) rayAngle += Math.PI * 2;

    var right = (rayAngle > Math.PI * 2 * 0.75 || rayAngle < Math.PI * 2 * 0.25);
    var up = (rayAngle < 0 || rayAngle > Math.PI);

    var wallType = 0;
    var angleSin = Math.sin(rayAngle);
    var angleCos = Math.cos(rayAngle);

    var distance = 0;
    var xHit = 0, yHit = 0;
    var textureX;
    var wallX, wallY;
    var shadow;

    // vertical intersections
    var slope = angleSin / angleCos;
    var dXVer = right ? 1 : -1;
    var dYVer = dXVer * slope;

    var x = right ? Math.ceil(player.x) : (player.x) >> 0;
    var y = player.y + (x - player.x) * slope;

    while (x >= 0 && x < mapWidth && y >= 0 && y < mapHeight) {
        wallX = (x + (right ? 0 : -1)) >> 0;
        wallY = (y) >> 0;

        if (spritePosition[wallY][wallX] && !spritePosition[wallY][wallX].visible) {
            spritePosition[wallY][wallX].visible = true;
        }

        if (map[wallY][wallX] > 0) {
            var distX = x - player.x;
            var distY = y - player.y;
            distance = distX * distX + distY * distY;

            wallType = map[wallY][wallX];
            textureX = y % 1;
            if (!right) textureX = 1 - textureX;

            xHit = x;
            yHit = y;
            shadow = true;
            break;
        }
        x += dXVer;
        y += dYVer;
    }

    // horizontal intersections
    slope = angleCos / angleSin;
    var dYHor = up ? -1 : 1;
    var dXHor = dYHor * slope;
    y = up ? (player.y) >> 0 : Math.ceil(player.y);
    x = player.x + (y - player.y) * slope;

    while (x >= 0 && x < mapWidth && y >= 0 && y < mapHeight) {
        wallY = (y + (up ? -1 : 0)) >> 0;
        wallX = (x) >> 0;

        if (spritePosition[wallY][wallX] && !spritePosition[wallY][wallX].visible) {
            spritePosition[wallY][wallX].visible = true;
        }

        if (map[wallY][wallX] > 0) {
            var distX = x - player.x;
            var distY = y - player.y;
            var blockDist = distX * distX + distY * distY;
            if (!distance || blockDist < distance) {
                distance = blockDist;
                xHit = x;
                yHit = y;

                wallType = map[wallY][wallX];
                textureX = x % 1;
                if (up) textureX = 1 - textureX;
                shadow = false;
            }
            break;
        }
        x += dXHor;
        y += dYHor;
    }

    // draw strip
    if (distance) {
        var strip = screenStrips[stripIdx];
        distance = Math.sqrt(distance);
        distance = distance * Math.cos(player.rotation - rayAngle);

        var height = Math.round(viewDist / distance);
        var width = height * stripWidth;

        // add vertical look offset (pitch)
        var top = Math.round((screenHeight - height) / 2 + player.pitch);

        var texX = Math.round(textureX * width);
        var prevStyle = strip.img.prevStyle;

        if (texX > width - stripWidth)
            texX = width - stripWidth;
        texX += (shadow ? width : 0);

        strip.style.height = height + "px";
        strip.style.top = top + "px";
        strip.style.zIndex = height >> 0;

        if (prevStyle.height != (height * numoftex) >> 0) {
            strip.img.style.height = (height * numoftex) >> 0 + "px";
            prevStyle.height = (height * numoftex) >> 0;
        }
        if (prevStyle.width != (width * 2) >> 0) {
            strip.img.style.width = (width * 2) >> 0 + "px";
            prevStyle.width = (width * 2) >> 0;
        }
        if (prevStyle.top != -(height * (wallType - 1)) >> 0) {
            strip.img.style.top = -(height * (wallType - 1)) >> 0 + "px";
            prevStyle.top = -(height * (wallType - 1)) >> 0;
        }
        if (prevStyle.left != -texX) {
            strip.img.style.left = -texX + "px";
            prevStyle.left = -texX;
        }
        strip.fog.style.height = height >> 0 + "px";
        strip.fog.style.width = (width * 2) >> 0 + "px";
        strip.fog.style.background = "rgba(0,0,0," + distance / 10 + ")";
    }

    drawRay(xHit, yHit);
}