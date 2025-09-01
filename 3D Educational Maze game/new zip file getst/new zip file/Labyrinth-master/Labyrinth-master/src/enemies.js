// Enhanced enemies.js with intelligent chase and prediction

initEnemies = function () {
    addEnemies();
    var screen = $('screen');
    for (var i = 0; i < mapEnemies.length; i++) {
        var enemy = mapEnemies[i];
        var type = enemyTypes[enemy.type];
        var img = document.createElement('img');
        img.src = type.img;
        img.style.display = "none";
        img.style.position = "absolute";

        enemy.state = 0;
        enemy.rot = 0;
        enemy.dir = 0;
        enemy.speed = 0;
        enemy.moveSpeed = type.moveSpeed;
        enemy.rotSpeed = type.rotSpeed;
        enemy.numOfStates = type.numOfStates;
        enemy.health = type.health;
        enemy.attackDamage = type.attackDamage;
        enemy.attackRange = type.attackRange;
        enemy.attackCooldown = 0;
        enemy.lastAttackTime = 0;
        
        // Enhanced AI properties
        enemy.lastPlayerPos = { x: player.x, y: player.y };
        enemy.playerVelocity = { x: 0, y: 0 };
        enemy.predictedPos = { x: player.x, y: player.y };
        enemy.pathfindingCooldown = 0;
        enemy.currentPath = [];
        enemy.pathIndex = 0;
        enemy.lostPlayerTime = 0;
        enemy.huntingMode = false;
        enemy.lastDirectionChange = 0;
        
        enemy.prevStyle = {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
            clip: '',
            display: 'none',
            zIndex: 0
        };
        enemy.img = img;
        enemies.push(enemy);
        screen.appendChild(img);
    }
    
    // Initialize blood splash system
    initBloodSplash();
}

//----------------------------------------------------------

var enemies = [];
var mapEnemies = [];

//----------------------------------------------------------

var enemyTypes = [
    {
        img: 'src/assets/rat.png',
        moveSpeed: 0.08,  // Significantly increased speed - 2x faster
        rotSpeed: 5,      // Faster rotation for quicker direction changes
        numOfStates: 9,
        health: 100,
        attackDamage: 20,
        attackRange: 1.2,
        attackCooldown: 2500,
        detectionRange: 15,
        predictionTime: 2.0 // Increased prediction time for faster enemy
    }
];

//----------------------------------------------------------

addEnemies = function () {
    // Only add ONE intelligent enemy
    var enemy = {
        type: 0,
        x: 8.5,
        y: 27.5
    }
    mapEnemies.push(enemy);
}

//----------------------------------------------------------

renderEnemies = function () {
    for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        if (enemy.health <= 0) continue;
        
        var dx = enemy.x - player.x;
        var dy = enemy.y - player.y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 20) { // Increased render distance
            var angle = Math.atan2(dy, dx) - player.rotation;
            if (angle < -Math.PI) angle += Math.PI * 2;
            if (angle >= Math.PI) angle -= Math.PI * 2;
            if ((angle > -Math.PI) && (angle < Math.PI)) {

                var img = enemy.img;
                var size = viewDist / (Math.cos(angle) * distance);
                var x = Math.tan(angle) * viewDist;
                var prevStyle = enemy.prevStyle;

                if (size != prevStyle.height) {
                    img.style.height = size + 'px';
                    prevStyle.height = size;
                }
                if ((size * enemy.numOfStates) != prevStyle.width) {
                    img.style.width = (size * enemy.numOfStates) + 'px';
                    prevStyle.width = (size * enemy.numOfStates);
                }
                if (((screenHeight - size) / 2) != prevStyle.top) {
                    img.style.top = ((screenHeight - size) / 2) + 'px';
                    prevStyle.top = ((screenHeight - size) / 2);
                }
                if ((screenWidth / 2 + x - size / 2 - size * enemy.state) != prevStyle.left) {
                    img.style.left = (screenWidth / 2 + x - size / 2 - size * enemy.state) + 'px';
                    prevStyle.left = (screenWidth / 2 + x - size / 2 - size * enemy.state);
                }
                
                // Color tint based on hunting mode
                var brightness = 100 - 8 * distance;
                var filter = "brightness(" + brightness + "%)";
                if (enemy.huntingMode) {
                    filter += " sepia(1) hue-rotate(-50deg) saturate(2)"; // Reddish tint when hunting
                }
                if (filter != prevStyle.filter) {
                    img.style.filter = filter;
                    prevStyle.filter = filter;
                }
                
                if (size >> 0 != prevStyle.zIndex) {
                    img.style.zIndex = size >> 0;
                    prevStyle.zIndex = size >> 0;
                }
                if ('block' != prevStyle.display) {
                    img.style.display = 'block';
                    prevStyle.display = 'block';
                }
                if (('rect(0, ' + (size * (enemy.state + 1)) + ', ' + size + ', ' + (size * (enemy.state)) + ')') != prevStyle.clip) {
                    img.style.clip = ('rect(0, ' + (size * (enemy.state + 1)) + ', ' + size + ', ' + (size * (enemy.state)) + ')');
                    prevStyle.clip = ('rect(0, ' + (size * (enemy.state + 1)) + ', ' + size + ', ' + (size * (enemy.state)) + ')');
                }
            }
        } else {
            // Hide enemy if too far
            if (enemy.prevStyle.display !== 'none') {
                enemy.img.style.display = 'none';
                enemy.prevStyle.display = 'none';
            }
        }
        
        // Always run AI regardless of visibility
        intelligentEnemyAI(enemy);
    }
}

//----------------------------------------------------------

intelligentEnemyAI = function (enemy) {
    if (enemy.health <= 0) return;
    
    var currentTime = Date.now();
    var type = enemyTypes[enemy.type];
    var dx = player.x - enemy.x;
    var dy = player.y - enemy.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    
    // Calculate player velocity
    var deltaX = player.x - enemy.lastPlayerPos.x;
    var deltaY = player.y - enemy.lastPlayerPos.y;
    enemy.playerVelocity.x = deltaX * 0.7 + enemy.playerVelocity.x * 0.3; // Smooth velocity
    enemy.playerVelocity.y = deltaY * 0.7 + enemy.playerVelocity.y * 0.3;
    
    // Update last known player position
    enemy.lastPlayerPos.x = player.x;
    enemy.lastPlayerPos.y = player.y;
    
    // Predict where player will be
    predictPlayerPosition(enemy, type.predictionTime);
    
    // Line of sight check
    var hasLineOfSight = checkLineOfSight(enemy.x, enemy.y, player.x, player.y);
    
    // Update hunting mode
    if (distance <= type.detectionRange && hasLineOfSight) {
        enemy.huntingMode = true;
        enemy.lostPlayerTime = currentTime;
    } else if (enemy.huntingMode && (currentTime - enemy.lostPlayerTime) > 5000) {
        enemy.huntingMode = false; // Stop hunting after 5 seconds
        enemy.currentPath = [];
    }
    
    // Attack if close enough
    if (distance <= type.attackRange && (currentTime - enemy.lastAttackTime) >= type.attackCooldown) {
        enemyAttack(enemy);
        enemy.lastAttackTime = currentTime;
        enemy.state = 8; // Attack animation state
        return;
    }
    
    // Movement logic
    if (enemy.huntingMode) {
        // Direct chase or pathfind
        if (hasLineOfSight && distance < 8) {
            // Direct chase with prediction
            directChase(enemy, distance);
        } else {
            // Use pathfinding
            if ((currentTime - enemy.pathfindingCooldown) > 500) { // Pathfind every 0.5 seconds
                enemy.currentPath = findPath(enemy.x, enemy.y, enemy.predictedPos.x, enemy.predictedPos.y);
                enemy.pathIndex = 0;
                enemy.pathfindingCooldown = currentTime;
            }
            followPath(enemy);
        }
    } else {
        // Patrol or idle behavior
        patrolBehavior(enemy, currentTime);
    }
    
    // Update animation
    updateEnemyAnimation(enemy, currentTime);
}

//----------------------------------------------------------

predictPlayerPosition = function(enemy, predictionTime) {
    // Predict where player will be based on current velocity
    var futureX = player.x + (enemy.playerVelocity.x * predictionTime * 60); // 60 FPS assumption
    var futureY = player.y + (enemy.playerVelocity.y * predictionTime * 60);
    
    // Add some randomness to make it less perfect
    var uncertainty = 0.5;
    futureX += (Math.random() - 0.5) * uncertainty;
    futureY += (Math.random() - 0.5) * uncertainty;
    
    // Ensure predicted position is valid (not in walls)
    if (!isBlocking(Math.floor(futureX), Math.floor(futureY))) {
        enemy.predictedPos.x = futureX;
        enemy.predictedPos.y = futureY;
    } else {
        // Fall back to current player position
        enemy.predictedPos.x = player.x;
        enemy.predictedPos.y = player.y;
    }
}

//----------------------------------------------------------

checkLineOfSight = function(x1, y1, x2, y2) {
    var dx = Math.abs(x2 - x1);
    var dy = Math.abs(y2 - y1);
    var x = Math.floor(x1);
    var y = Math.floor(y1);
    var n = 1 + dx + dy;
    var x_inc = (x2 > x1) ? 1 : -1;
    var y_inc = (y2 > y1) ? 1 : -1;
    var error = dx - dy;
    
    dx *= 2;
    dy *= 2;
    
    for (; n > 0; --n) {
        if (isBlocking(x, y)) {
            return false;
        }
        
        if (error > 0) {
            x += x_inc;
            error -= dy;
        } else {
            y += y_inc;
            error += dx;
        }
    }
    
    return true;
}

//----------------------------------------------------------

directChase = function(enemy, distance) {
    // Chase predicted position instead of current position
    var targetX = enemy.predictedPos.x;
    var targetY = enemy.predictedPos.y;
    
    // Add some smart movement - try to cut off player
    var playerSpeed = Math.sqrt(enemy.playerVelocity.x * enemy.playerVelocity.x + enemy.playerVelocity.y * enemy.playerVelocity.y);
    if (playerSpeed > 0.01) {
        // Try to intercept - more aggressive prediction for faster enemy
        var interceptX = targetX + enemy.playerVelocity.x * 45; // Increased intercept distance
        var interceptY = targetY + enemy.playerVelocity.y * 45;
        
        if (!isBlocking(Math.floor(interceptX), Math.floor(interceptY))) {
            targetX = interceptX;
            targetY = interceptY;
        }
    }
    
    var angle = Math.atan2(targetY - enemy.y, targetX - enemy.x);
    enemy.rot = angle;
    enemy.speed = 1.3; // Increased chase speed multiplier
    
    enemyMove(enemy);
}

//----------------------------------------------------------

// Simple A* pathfinding implementation
findPath = function(startX, startY, targetX, targetY) {
    var start = { x: Math.floor(startX), y: Math.floor(startY) };
    var target = { x: Math.floor(targetX), y: Math.floor(targetY) };
    
    if (isBlocking(target.x, target.y)) {
        return []; // Can't path to blocked target
    }
    
    var openList = [];
    var closedList = [];
    var path = [];
    
    // Add starting node
    openList.push({
        x: start.x,
        y: start.y,
        g: 0,
        h: Math.abs(target.x - start.x) + Math.abs(target.y - start.y),
        f: 0,
        parent: null
    });
    
    var maxIterations = 100; // Prevent infinite loops
    var iterations = 0;
    
    while (openList.length > 0 && iterations < maxIterations) {
        iterations++;
        
        // Get node with lowest f score
        var current = openList.reduce((min, node) => node.f < min.f ? node : min);
        var currentIndex = openList.indexOf(current);
        
        openList.splice(currentIndex, 1);
        closedList.push(current);
        
        // Check if we reached the target
        if (current.x === target.x && current.y === target.y) {
            // Reconstruct path
            var temp = current;
            while (temp) {
                path.unshift({ x: temp.x + 0.5, y: temp.y + 0.5 }); // Center of tile
                temp = temp.parent;
            }
            break;
        }
        
        // Check neighbors
        var neighbors = [
            { x: current.x + 1, y: current.y },
            { x: current.x - 1, y: current.y },
            { x: current.x, y: current.y + 1 },
            { x: current.x, y: current.y - 1 }
        ];
        
        for (var i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];
            
            // Skip if blocked or already in closed list
            if (isBlocking(neighbor.x, neighbor.y) || 
                closedList.some(node => node.x === neighbor.x && node.y === neighbor.y)) {
                continue;
            }
            
            var g = current.g + 1;
            var h = Math.abs(target.x - neighbor.x) + Math.abs(target.y - neighbor.y);
            var f = g + h;
            
            // Check if this path is better
            var existingNode = openList.find(node => node.x === neighbor.x && node.y === neighbor.y);
            if (!existingNode || g < existingNode.g) {
                var node = {
                    x: neighbor.x,
                    y: neighbor.y,
                    g: g,
                    h: h,
                    f: f,
                    parent: current
                };
                
                if (existingNode) {
                    openList[openList.indexOf(existingNode)] = node;
                } else {
                    openList.push(node);
                }
            }
        }
    }
    
    return path;
}

//----------------------------------------------------------

followPath = function(enemy) {
    if (enemy.currentPath.length === 0) {
        enemy.speed = 0;
        return;
    }
    
    var target = enemy.currentPath[enemy.pathIndex];
    if (!target) {
        enemy.speed = 0;
        return;
    }
    
    var dx = target.x - enemy.x;
    var dy = target.y - enemy.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 0.4) { // Smaller waypoint threshold for faster movement
        // Move to next waypoint
        enemy.pathIndex++;
        if (enemy.pathIndex >= enemy.currentPath.length) {
            enemy.currentPath = [];
            enemy.speed = 0;
        }
    } else {
        var angle = Math.atan2(dy, dx);
        enemy.rot = angle;
        enemy.speed = 1.1; // Faster pathfinding speed
        enemyMove(enemy);
    }
}

//----------------------------------------------------------

patrolBehavior = function(enemy, currentTime) {
    // Simple patrol behavior when not hunting
    if ((currentTime - enemy.lastDirectionChange) > 3000) { // Change direction every 3 seconds
        enemy.rot = Math.random() * Math.PI * 2;
        enemy.lastDirectionChange = currentTime;
    }
    
    enemy.speed = 0.6; // Increased patrol speed
    enemyMove(enemy);
}

//----------------------------------------------------------

updateEnemyAnimation = function(enemy, currentTime) {
    if (enemy.speed > 0) {
        var walkCycleTime = enemy.huntingMode ? 600 : 900; // Much faster animation cycles
        var numWalkSprites = 7;
        enemy.state = Math.floor((currentTime % walkCycleTime) / (walkCycleTime / numWalkSprites)) + 1;
    } else {
        enemy.state = 0; // Idle
    }
}

//----------------------------------------------------------

enemyAttack = function(enemy) {
    var type = enemyTypes[enemy.type];
    
    // Deal damage to player
    if (typeof setHealth === 'function') {
        setHealth(health - type.attackDamage);
    } else if (typeof window.setHealth === 'function') {
        window.setHealth(window.health - type.attackDamage);
    }
    
    // Trigger blood splash effect
    triggerBloodSplash();
    
    // Screen shake effect
    screenShake();
    
    // Play damage sound if available
    if (typeof window.playDamageSound === 'function') {
        window.playDamageSound();
    }
    
    console.log("Intelligent enemy attacked! Damage: " + type.attackDamage);
}

//----------------------------------------------------------

enemyMove = function (enemy) {
    var moveStep = enemy.speed * enemy.moveSpeed;
    var newX = enemy.x + Math.cos(enemy.rot) * moveStep;
    var newY = enemy.y + Math.sin(enemy.rot) * moveStep;

    // Use proper collision detection
    var pos = checkCollision(enemy.x, enemy.y, newX, newY, 0.25);
    enemy.x = pos.x;
    enemy.y = pos.y;
}

//----------------------------------------------------------
// BLOOD SPLASH SYSTEM (Same as before)
//----------------------------------------------------------

var bloodSplashes = [];
var bloodCanvas;
var bloodCtx;

function initBloodSplash() {
    bloodCanvas = document.createElement('canvas');
    bloodCanvas.id = 'bloodCanvas';
    bloodCanvas.style.position = 'fixed';
    bloodCanvas.style.top = '0';
    bloodCanvas.style.left = '0';
    bloodCanvas.style.width = '100%';
    bloodCanvas.style.height = '100%';
    bloodCanvas.style.pointerEvents = 'none';
    bloodCanvas.style.zIndex = '99998';
    bloodCanvas.width = window.innerWidth;
    bloodCanvas.height = window.innerHeight;
    
    document.body.appendChild(bloodCanvas);
    bloodCtx = bloodCanvas.getContext('2d');
    
    window.addEventListener('resize', function() {
        bloodCanvas.width = window.innerWidth;
        bloodCanvas.height = window.innerHeight;
    });
}

function triggerBloodSplash() {
    var numSplatters = 8 + Math.random() * 12;
    
    for (var i = 0; i < numSplatters; i++) {
        var splash = {
            x: Math.random() * bloodCanvas.width,
            y: Math.random() * bloodCanvas.height,
            size: 3 + Math.random() * 15,
            opacity: 0.6 + Math.random() * 0.3,
            fadeRate: 0.008 + Math.random() * 0.012,
            color: getBloodColor()
        };
        bloodSplashes.push(splash);
    }
    
    for (var i = 0; i < 4; i++) {
        var drip = {
            x: Math.random() * bloodCanvas.width,
            y: 0,
            size: 2 + Math.random() * 6,
            opacity: 0.7,
            fadeRate: 0.005,
            color: getBloodColor(),
            isDrip: true,
            dripSpeed: 1 + Math.random() * 2
        };
        bloodSplashes.push(drip);
    }
}

function getBloodColor() {
    var colors = ['rgb(139, 0, 0)', 'rgb(165, 42, 42)', 'rgb(128, 0, 0)', 'rgb(178, 34, 34)'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function updateBloodSplash() {
    if (!bloodCtx) return;
    
    bloodCtx.clearRect(0, 0, bloodCanvas.width, bloodCanvas.height);
    
    for (var i = bloodSplashes.length - 1; i >= 0; i--) {
        var splash = bloodSplashes[i];
        
        bloodCtx.globalAlpha = splash.opacity;
        bloodCtx.fillStyle = splash.color;
        
        if (splash.isDrip) {
            splash.y += splash.dripSpeed;
            bloodCtx.fillRect(splash.x, splash.y, splash.size / 3, splash.size);
            if (splash.y > bloodCanvas.height) {
                bloodSplashes.splice(i, 1);
                continue;
            }
        } else {
            bloodCtx.beginPath();
            bloodCtx.arc(splash.x, splash.y, splash.size, 0, 2 * Math.PI);
            bloodCtx.fill();
            
            for (var j = 0; j < 2; j++) {
                var offsetX = (Math.random() - 0.5) * splash.size;
                var offsetY = (Math.random() - 0.5) * splash.size;
                var smallSize = splash.size * (0.4 + Math.random() * 0.3);
                
                bloodCtx.beginPath();
                bloodCtx.arc(splash.x + offsetX, splash.y + offsetY, smallSize, 0, 2 * Math.PI);
                bloodCtx.fill();
            }
        }
        
        splash.opacity -= splash.fadeRate;
        if (splash.opacity <= 0) {
            bloodSplashes.splice(i, 1);
        }
    }
    
    bloodCtx.globalAlpha = 1.0;
}

function screenShake() {
    var screen = document.getElementById('screen');
    if (!screen) return;
    
    var intensity = 8;
    var duration = 250;
    var startTime = Date.now();
    
    function shake() {
        var elapsed = Date.now() - startTime;
        if (elapsed < duration) {
            var shakeX = (Math.random() - 0.5) * intensity;
            var shakeY = (Math.random() - 0.5) * intensity;
            var progress = elapsed / duration;
            var currentIntensity = intensity * (1 - progress);
            
            screen.style.transform = 'translate(' + (shakeX * currentIntensity / intensity) + 'px, ' + (shakeY * currentIntensity / intensity) + 'px)';
            requestAnimationFrame(shake);
        } else {
            screen.style.transform = '';
        }
    }
    
    shake();
}

function damageEnemy(enemyIndex, damage) {
    if (enemyIndex >= 0 && enemyIndex < enemies.length) {
        var enemy = enemies[enemyIndex];
        enemy.health -= damage;
        
        if (enemy.health <= 0) {
            enemy.img.style.display = 'none';
            console.log("Intelligent enemy defeated!");
        }
    }
}

// Start blood update loop
setInterval(function() {
    updateBloodSplash();
}, 16);