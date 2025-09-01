var player = {
    x: 15.5,
    y: 16.5,
    direction: 0,        // right 1 left -1 (keyboard only)
    rotation: 0,         // yaw (horizontal angle)
    vertical: 0,         // forward 1 backwards -1
    moveSpeed: 0.075,    // step/update
    rotationSpeed: 5,    // rotation each update (in degrees, for keys)
    horizontal: false,   // strafe mode
    pitch: 0             // up/down look (new)
};

function findStartPosition() {
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 2) {
                return { x: x, y: y };
            }
        }
    }
    return { x: 1, y: 1 }; // fallback
}

//----------------------------------------------------------
// GLOBAL SOUND REGISTRY
//----------------------------------------------------------

let allSounds = [];   // every sound will be stored here
let isMuted = false;
let volumeLevel = 1.0; // 0.0 to 1.0

//----------------------------------------------------------
// FOOTSTEP SOUND SETUP
//----------------------------------------------------------

let footstepSounds = [];
let lastStepTime = 0;
let stepInterval = 350; // ms between footsteps

window.addEventListener("DOMContentLoaded", () => {
    // Load audio files
    footstepSounds = [
        new Audio("src/assets/sounds/footstep1.mp3"),
        new Audio("src/assets/sounds/footstep2.mp3")
    ];

    // add to global registry
    allSounds.push(...footstepSounds);

    // set volume initially
    footstepSounds.forEach(a => {
        a.volume = volumeLevel;
    });
});

function playFootstep() {
    if (isMuted || footstepSounds.length === 0) return;

    let now = Date.now();
    if (now - lastStepTime > stepInterval) {
        const sound = footstepSounds[Math.floor(Math.random() * footstepSounds.length)];
        sound.currentTime = 0;
        sound.volume = volumeLevel;
        sound.play();
        lastStepTime = now;
    }
}

//----------------------------------------------------------
// MOVEMENT
//----------------------------------------------------------

move = function (timeDelta) {
    var move_abs = timeDelta / gameCycleDelay;
    var moveStep;

    if (!player.horizontal) {
        moveStep = move_abs * player.vertical * player.moveSpeed;
        player.rotation += move_abs * player.direction * player.rotationSpeed * Math.PI / 180;
    } else {
        moveStep = move_abs * player.direction * player.moveSpeed;
    }

    while (player.rotation < 0) player.rotation += Math.PI * 2;
    while (player.rotation >= Math.PI * 2) player.rotation -= Math.PI * 2;

    var newX, newY;
    if (!player.horizontal) {
        newX = player.x + Math.cos(player.rotation) * moveStep;
        newY = player.y + Math.sin(player.rotation) * moveStep;
    } else {
        newX = player.x + Math.cos(player.rotation + 90 * Math.PI / 180) * moveStep;
        newY = player.y + Math.sin(player.rotation + 90 * Math.PI / 180) * moveStep;
    }

    var position = checkCollision(player.x, player.y, newX, newY, 0.35);
    player.x = position.x;
    player.y = position.y;

    // sprite interactions
    if (typeof handlePlayerMovement === 'function') {
        handlePlayerMovement(player.x, player.y);
        
    }

    // FOOTSTEP: only play if actually moving
    if (player.vertical !== 0 || player.direction !== 0) {
        playFootstep();
    }

    // ✅ Check if reached goal
    checkGoal();
};

//----------------------------------------------------------
// COLLISION
//----------------------------------------------------------

checkCollision = function (fromX, fromY, toX, toY, radius) {
    var position = { x: fromX, y: fromY };

    if (toY < 0 || toY >= mapHeight || toX < 0 || toX >= mapWidth)
        return position;

    var blockX = toX >> 0;
    var blockY = toY >> 0;

    if (isBlocking(blockX, blockY)) return position;

    position.x = toX;
    position.y = toY;

    var top = isBlocking(blockX, blockY - 1);
    var bottom = isBlocking(blockX, blockY + 1);
    var left = isBlocking(blockX - 1, blockY);
    var right = isBlocking(blockX + 1, blockY);

    if (top && toY - blockY < radius) position.y = blockY + radius;
    if (bottom && blockY + 1 - toY < radius) position.y = blockY + 1 - radius;
    if (left && toX - blockX < radius) position.x = blockX + radius;
    if (right && blockX + 1 - toX < radius) position.x = blockX + 1 - radius;

    

    // diagonal checks
    if (isBlocking(blockX - 1, blockY - 1) && !(top && left)) {
        var dx = toX - blockX, dy = toY - blockY;
        if (dx * dx + dy * dy < radius * radius) {
            if (dx * dx > dy * dy) position.x = blockX + radius;
            else position.y = blockY + radius;
        }
    }
    if (isBlocking(blockX + 1, blockY - 1) && !(top && right)) {
        var dx = toX - (blockX + 1), dy = toY - blockY;
        if (dx * dx + dy * dy < radius * radius) {
            if (dx * dx > dy * dy) position.x = blockX + 1 - radius;
            else position.y = blockY + radius;
        }
    }
    if (isBlocking(blockX - 1, blockY + 1) && !(bottom && left)) {
        var dx = toX - blockX, dy = toY - (blockY + 1);
        if (dx * dx + dy * dy < radius * radius) {
            if (dx * dx > dy * dy) position.x = blockX + radius;
            else position.y = blockY + 1 - radius;
        }
    }
    if (isBlocking(blockX + 1, blockY + 1) && !(bottom && right)) {
        var dx = toX - (blockX + 1), dy = toY - (blockY + 1);
        if (dx * dx + dy * dy < radius * radius) {
            if (dx * dx > dy * dy) position.x = blockX + 1 - radius;
            else position.y = blockY + 1 - radius;
        }
    }

    return position;
};

function isBlocking(x, y) {
    if (y < 0 || y >= mapHeight || x < 0 || x >= mapWidth) return true;
    if (map[y >> 0][x >> 0] != 0 && map[y >> 0][x >> 0] != 2 && map[y >> 0][x >> 0] != 3) return true; 
    // ✅ allow walking on start(2) and goal(3)
    if (spritePosition[y >> 0][x >> 0] && spritePosition[y >> 0][x >> 0].block) return true;
    return false;
}

//----------------------------------------------------------
// GOAL CHECK
//----------------------------------------------------------

function checkGoal() {
    let px = Math.floor(player.x);
    let py = Math.floor(player.y);
    if (map[py][px] === 3) {
        showWinScreen();
    }
}


//----------------------------------------------------------
// RAY DEBUG DRAW
//----------------------------------------------------------

function drawRay(rayX, rayY) {
    var objects = $("objects");
    var objectCtx = objects.getContext("2d");

    objectCtx.strokeStyle = "rgba(100,100,100,0.3)";
    objectCtx.lineWidth = 0.5;
    objectCtx.beginPath();
    objectCtx.moveTo(player.x * mapScale, player.y * mapScale);
    objectCtx.lineTo(rayX * mapScale, rayY * mapScale);
    objectCtx.closePath();
    objectCtx.stroke();
}

//----------------------------------------------------------
// KEYBOARD INPUT
//----------------------------------------------------------

addKeys = function () {
    document.onkeydown = function (event) {
        event = event || window.event;
        switch (event.keyCode) {
            case 38: player.vertical = 1; break;   // up
            case 40: player.vertical = -1; break;  // down
            case 16: player.horizontal = true; break; // strafe
            case 37: player.direction = -1; break; // left
            case 39: player.direction = 1; break;  // right
        }
    };

    document.onkeyup = function (event) {
        event = event || window.event;
        switch (event.keyCode) {
            case 38: case 40: player.vertical = 0; break;
            case 16: player.horizontal = false; break;
            case 37: case 39: player.direction = 0; break;
        }
    };
};

//----------------------------------------------------------
// MOUSE LOOK SUPPORT
//----------------------------------------------------------

document.body.addEventListener("click", () => {
    document.body.requestPointerLock();
});

document.addEventListener("pointerlockchange", () => {
    if (document.pointerLockElement === document.body) {
        document.addEventListener("mousemove", onMouseMove, false);
    } else {
        document.removeEventListener("mousemove", onMouseMove, false);
    }
});

function onMouseMove(e) {
    let sensitivity = 0.002;

    // yaw (left/right)
    player.rotation += e.movementX * sensitivity;

    // pitch (up/down)
    player.pitch -= e.movementY * sensitivity;

    // clamp pitch
    let maxPitch = Math.PI / 4; // 45°
    if (player.pitch > maxPitch) player.pitch = maxPitch;
    if (player.pitch < -maxPitch) player.pitch = -maxPitch;
}

//----------------------------------------------------------
// SETTINGS MENU LOGIC
//----------------------------------------------------------

function initSettingsMenu() {
    const settingsBtn = document.getElementById("settings-btn");
    const settingsMenu = document.getElementById("settings-menu");

    if (!settingsBtn || !settingsMenu) return;

    settingsBtn.addEventListener("click", () => {
        settingsMenu.style.display = 
            settingsMenu.style.display === "flex" ? "none" : "flex";
    });

    // Buttons inside menu
    const volUp = document.getElementById("btn-volume-up");
    const volDown = document.getElementById("btn-volume-down");
    const muteBtn = document.getElementById("btn-mute");
    const resumeBtn = document.getElementById("btn-resume");

    if (volUp) {
        volUp.addEventListener("click", () => {
            volumeLevel = Math.min(1.0, volumeLevel + 0.1);
            console.log("Volume:", volumeLevel.toFixed(1));
            allSounds.forEach(a => a.volume = volumeLevel); // ✅ apply to all
        });
    }

    if (volDown) {
        volDown.addEventListener("click", () => {
            volumeLevel = Math.max(0.0, volumeLevel - 0.1);
            console.log("Volume:", volumeLevel.toFixed(1));
            allSounds.forEach(a => a.volume = volumeLevel); // ✅ apply to all
        });
    }

    if (muteBtn) {
        muteBtn.addEventListener("click", () => {
            isMuted = !isMuted;
            console.log("Muted:", isMuted);
            muteBtn.textContent = isMuted ? "Unmute" : "Mute";
            allSounds.forEach(a => a.muted = isMuted); // ✅ mute/unmute all
        });
    }

    if (resumeBtn) {
        resumeBtn.addEventListener("click", () => {
            settingsMenu.style.display = "none";
            console.log("Game Resumed");
            // TODO: add pause/resume game loop handling
        });
    }
}

// Initialize after DOM ready
window.addEventListener("DOMContentLoaded", initSettingsMenu);

