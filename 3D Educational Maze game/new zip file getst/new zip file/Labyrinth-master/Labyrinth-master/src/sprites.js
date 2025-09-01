initSprites = function () {

    addItems();
    for (var i = 0; i < map.length; i++) {
        spritePosition[i] = [];
    }

    var screen = $('screen');
    for (var i = 0; i < mapSprites.length; i++) {
        var sprite = mapSprites[i];
        var itemType = itemTypes[sprite.type];
        var img = document.createElement('img');
        img.src = itemType.img;
        img.style.display = "none";
        img.style.position = "absolute";
        img.style.overflow = "hidden";
        sprite.visible = false;
        sprite.block = itemType.block;
        sprite.img = img;
        sprite.damage = itemType.damage || 0; // Add damage property
        spritePosition[sprite.y][sprite.x] = sprite;
        sprites.push(sprite);
        screen.appendChild(img);
    }
}

//----------------------------------------------------------

var sprites = [];
var mapSprites = [];
var spritePosition = [];

// Player life system
var playerLife = 100; // Starting life
var maxLife = 100;

var itemTypes = [
    { 
        img: 'src/assets/bush.png', 
        block: false,
        damage: 5 // Damage dealt when player hits this sprite
    },
];

//----------------------------------------------------------

addItems = function () {
    for (var y = 0; y < mapHeight; y++) {
        for (var x = 0; x < mapWidth; x++) {
            var wall = map[y][x];

            if (wall == 0)
                if (Math.random() * 100 < 2) {
                    var item = {
                        type: 0,
                        x: x,
                        y: y
                    }
                    mapSprites.push(item)
                }
        }
    }
}

//----------------------------------------------------------

// New function to check collision with sprites
checkSpriteCollision = function(playerX, playerY) {
    var gridX = Math.floor(playerX);
    var gridY = Math.floor(playerY);
    
    // Check if there's a sprite at player position
    if (spritePosition[gridY] && spritePosition[gridY][gridX]) {
        var sprite = spritePosition[gridY][gridX];
        
        // Calculate distance between player and sprite center
        var dx = playerX - (sprite.x + 0.5);
        var dy = playerY - (sprite.y + 0.5);
        var distance = Math.sqrt(dx * dx + dy * dy);
        
        // If player is close enough to sprite (collision radius)
        if (distance < 0.3) { // Adjust collision radius as needed
            return sprite;
        }
    }
    
    return null;
}

//----------------------------------------------------------

// Function to damage player
damagePlayer = function(damage) {
    playerLife -= damage;
    if (playerLife < 0) {
        playerLife = 0;
    }
    
    console.log("Player hit! Life: " + playerLife + "/" + maxLife);
    
    // Update life display if you have one
    updateLifeDisplay();
    
    // Check for game over
    if (playerLife <= 0) {
        gameOver();
    }
}

//----------------------------------------------------------

// Function to update life display (you can customize this)
updateLifeDisplay = function() {
    var lifeElement = document.getElementById('playerLife');
    if (lifeElement) {
        lifeElement.innerHTML = "Life: " + playerLife + "/" + maxLife;
    }
}

//----------------------------------------------------------

// Function to handle game over
gameOver = function() {
    alert("Game Over! You ran out of life.");
    // Reset player life and position
    playerLife = maxLife;
    // Reset player position to starting point
    player.x = 1.5;
    player.y = 1.5;
    updateLifeDisplay();
}

//----------------------------------------------------------

clearSprites = function () {
    for (var i = 0; i < sprites.length; i++) {
        var sprite = sprites[i];
        sprite.visible = false;
    }
}

//----------------------------------------------------------

renderSprites = function () {
    for (var i = 0; i < sprites.length; i++) {

        var sprite = sprites[i];
        if (sprite.visible) {

            var img = sprite.img;
            img.style.display = "block";

            // translate position to viewer space
            var dx = sprite.x + 0.5 - player.x;
            var dy = sprite.y + 0.5 - player.y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            var angle = Math.atan2(dy, dx) - player.rotation;
            var size = viewDist / (Math.cos(angle) * distance);

            // x-position on screen
            var x = Math.tan(angle) * viewDist;
            img.style.left = (screenWidth / 2 + x - size / 2) + "px";
            // y is constant
            img.style.top = ((screenHeight - size) / 2) + "px";
            img.style.width = size + "px";
            img.style.height = size + "px";

            // fog on sprite
            img.style.filter = "brightness(" + (100 - 15 * distance) + "%)";
            img.style.zIndex = (size) >> 0;
        } else {
            sprite.img.style.display = "none";
        }
    }
}

//----------------------------------------------------------

// Call this function when player moves (add to your movement code)
handlePlayerMovement = function(newX, newY) {
    // Check for sprite collision at new position
    var collidedSprite = checkSpriteCollision(newX, newY);
    
    if (collidedSprite && collidedSprite.damage > 0) {
        // Check if this sprite was recently hit to avoid spam damage
        var currentTime = Date.now();
        if (!collidedSprite.lastHitTime || currentTime - collidedSprite.lastHitTime > 1000) {
            // Player hit a damaging sprite (1 second cooldown)
            collidedSprite.lastHitTime = currentTime;
            damagePlayer(collidedSprite.damage);
            
            // Optional: Remove the sprite after collision
            // collidedSprite.visible = false;
            // spritePosition[collidedSprite.y][collidedSprite.x] = null;
        }
    }
}