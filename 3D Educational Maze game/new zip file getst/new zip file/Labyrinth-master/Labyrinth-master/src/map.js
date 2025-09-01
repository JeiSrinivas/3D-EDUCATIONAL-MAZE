// ========================== MAP LEGEND ==========================
// 0 = open space → can move here
// 1 = wall → blocked
// 2 = start → player starts here (blue)
// 3 = goal → player must reach here (green)
// =================================================================

var map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1],
    [1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 3, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
function $(id) {
    return document.getElementById(id);
}

// ======================= MAP SETTINGS =======================
var mapWidth = map[0].length;
var mapHeight = map.length;
var mapScale = 8; // size of each minimap block in pixels

// Start & Goal detection
var startPos = null;
var goalPos = null;
for (var y = 0; y < mapHeight; y++) {
    for (var x = 0; x < mapWidth; x++) {
        if (map[y][x] === 2) startPos = { x, y };
        if (map[y][x] === 3) goalPos = { x, y };
    }
}

// ======================= DRAW MAP =======================
drawMap = function () {
    var container = $("map");
    var miniMap = $("minimap");
    var objects = $("objects");

    if (!container || !miniMap || !objects) {
        console.error("Map elements not found in DOM");
        return;
    }

    miniMap.width = mapWidth * mapScale;
    miniMap.height = mapHeight * mapScale;
    objects.width = miniMap.width;
    objects.height = miniMap.height;

    var widthDim = (mapWidth * mapScale) + "px";
    var heightDim = (mapHeight * mapScale) + "px";
    miniMap.style.width = objects.style.width = container.style.width = widthDim;
    miniMap.style.height = objects.style.height = container.style.height = heightDim;

    var ctx = miniMap.getContext("2d");
    ctx.clearRect(0, 0, miniMap.width, miniMap.height);

    for (var y = 0; y < mapHeight; y++) {
        for (var x = 0; x < mapWidth; x++) {
            var wall = map[y][x];

            if (wall === 1) {
                ctx.fillStyle = "black"; // wall
                ctx.fillRect(x * mapScale, y * mapScale, mapScale, mapScale);
            } else if (wall === 2) {
                ctx.fillStyle = "blue"; // start
                ctx.fillRect(x * mapScale, y * mapScale, mapScale, mapScale);
            } else if (wall === 3) {
                ctx.fillStyle = "green"; // goal
                ctx.fillRect(x * mapScale, y * mapScale, mapScale, mapScale);
            }
        }
    }
}

// ======================= UPDATE MAP =======================
updateMap = function () {
    var miniMap = $("minimap");
    var objects = $("objects");

    if (!miniMap || !objects) {
        console.error("Map elements not found in DOM");
        return;
    }

    var objectCtx = objects.getContext("2d");
    objectCtx.clearRect(0, 0, miniMap.width, miniMap.height);

    // Player
    if (typeof player !== 'undefined') {
        objectCtx.fillStyle = "red";
        objectCtx.fillRect(
            player.x * mapScale - 2,
            player.y * mapScale - 2,
            4, 4
        );
    }

    // Enemies
    if (typeof enemies !== 'undefined' && enemies.length > 0) {
        for (var i = 0; i < enemies.length; i++) {
            var enemy = enemies[i];
            objectCtx.fillStyle = "orange";
            objectCtx.fillRect(
                enemy.x * mapScale - 2,
                enemy.y * mapScale - 2,
                4, 4
            );
        }
    }
}

// ======================= PATH DRAWING =======================
function drawPathOnMinimap(path) {
    const canvas = $("minimap");
    const ctx = canvas.getContext("2d");

    drawMap(); // redraw minimap

    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < path.length; i++) {
        const { x, y } = path[i];
        const cx = x * mapScale + mapScale / 2;
        const cy = y * mapScale + mapScale / 2;

        if (i === 0) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
    }
    ctx.stroke();
}

// ======================= ALGORITHMS =======================

// BFS
function bfs(grid, start, goal) {
    let queue = [start];
    let visited = new Set();
    let cameFrom = {};
    visited.add(start.y + "," + start.x);

    const dirs = [{x:0,y:-1},{x:1,y:0},{x:0,y:1},{x:-1,y:0}];

    while (queue.length > 0) {
        let current = queue.shift();

        if (current.x === goal.x && current.y === goal.y) {
            let path = [];
            let node = current;
            while (node) {
                path.push({ x: node.x, y: node.y });
                node = cameFrom[node.y + "," + node.x];
            }
            return path.reverse();
        }

        for (let d of dirs) {
            let nx = current.x + d.x;
            let ny = current.y + d.y;
            if (nx>=0 && ny>=0 && nx<mapWidth && ny<mapHeight && grid[ny][nx]!==1) {
                let key = ny + "," + nx;
                if (!visited.has(key)) {
                    visited.add(key);
                    cameFrom[key] = current;
                    queue.push({x:nx,y:ny});
                }
            }
        }
    }
    return [];
}

// DFS
function dfs(grid, start, goal) {
    let stack = [start];
    let visited = new Set();
    let cameFrom = {};
    visited.add(start.y + "," + start.x);

    const dirs = [{x:0,y:-1},{x:1,y:0},{x:0,y:1},{x:-1,y:0}];

    while (stack.length > 0) {
        let current = stack.pop();

        if (current.x === goal.x && current.y === goal.y) {
            let path = [];
            let node = current;
            while (node) {
                path.push({x:node.x, y:node.y});
                node = cameFrom[node.y + "," + node.x];
            }
            return path.reverse();
        }

        for (let d of dirs) {
            let nx = current.x + d.x;
            let ny = current.y + d.y;
            if (nx>=0 && ny>=0 && nx<mapWidth && ny<mapHeight && grid[ny][nx]!==1) {
                let key = ny + "," + nx;
                if (!visited.has(key)) {
                    visited.add(key);
                    cameFrom[key] = current;
                    stack.push({x:nx,y:ny});
                }
            }
        }
    }
    return [];
}

// Dijkstra
function dijkstra(grid, start, goal) {
    let dist = {};
    let cameFrom = {};
    let pq = [{x:start.x, y:start.y, cost:0}];
    dist[start.y+","+start.x] = 0;

    const dirs = [{x:0,y:-1},{x:1,y:0},{x:0,y:1},{x:-1,y:0}];

    while (pq.length > 0) {
        pq.sort((a,b)=>a.cost-b.cost);
        let current = pq.shift();

        if (current.x===goal.x && current.y===goal.y) {
            let path=[];
            let node=current;
            while (node) {
                path.push({x:node.x,y:node.y});
                node=cameFrom[node.y+","+node.x];
            }
            return path.reverse();
        }

        for (let d of dirs) {
            let nx=current.x+d.x, ny=current.y+d.y;
            if (nx>=0 && ny>=0 && nx<mapWidth && ny<mapHeight && grid[ny][nx]!==1) {
                let newCost=current.cost+1;
                let key=ny+","+nx;
                if (!(key in dist) || newCost<dist[key]) {
                    dist[key]=newCost;
                    cameFrom[key]=current;
                    pq.push({x:nx,y:ny,cost:newCost});
                }
            }
        }
    }
    return [];
}

// A*
function astar(grid, start, goal) {
    function heuristic(a,b) {
        return Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
    }

    let open=[{x:start.x,y:start.y,g:0,f:heuristic(start,goal)}];
    let cameFrom={};
    let gScore={};
    gScore[start.y+","+start.x]=0;

    const dirs=[{x:0,y:-1},{x:1,y:0},{x:0,y:1},{x:-1,y:0}];

    while(open.length>0) {
        open.sort((a,b)=>a.f-b.f);
        let current=open.shift();

        if(current.x===goal.x && current.y===goal.y) {
            let path=[];
            let node=current;
            while(node) {
                path.push({x:node.x,y:node.y});
                node=cameFrom[node.y+","+node.x];
            }
            return path.reverse();
        }

        for(let d of dirs) {
            let nx=current.x+d.x, ny=current.y+d.y;
            if(nx>=0 && ny>=0 && nx<mapWidth && ny<mapHeight && grid[ny][nx]!==1) {
                let tentative_g=gScore[current.y+","+current.x]+1;
                let key=ny+","+nx;
                if(!(key in gScore) || tentative_g<gScore[key]) {
                    gScore[key]=tentative_g;
                    cameFrom[key]=current;
                    let f=tentative_g+heuristic({x:nx,y:ny},goal);
                    open.push({x:nx,y:ny,g:tentative_g,f:f});
                }
            }
        }
    }
    return [];
}

// Greedy Best-First
function greedy(grid, start, goal) {
    function heuristic(a,b) {
        return Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
    }

    let open=[{x:start.x,y:start.y}];
    let cameFrom={};
    let visited=new Set();
    visited.add(start.y+","+start.x);

    const dirs=[{x:0,y:-1},{x:1,y:0},{x:0,y:1},{x:-1,y:0}];

    while(open.length>0) {
        open.sort((a,b)=>heuristic(a,goal)-heuristic(b,goal));
        let current=open.shift();

        if(current.x===goal.x && current.y===goal.y) {
            let path=[];
            let node=current;
            while(node) {
                path.push({x:node.x,y:node.y});
                node=cameFrom[node.y+","+node.x];
            }
            return path.reverse();
        }

        for(let d of dirs) {
            let nx=current.x+d.x, ny=current.y+d.y;
            if(nx>=0 && ny>=0 && nx<mapWidth && ny<mapHeight && grid[ny][nx]!==1) {
                let key=ny+","+nx;
                if(!visited.has(key)) {
                    visited.add(key);
                    cameFrom[key]=current;
                    open.push({x:nx,y:ny});
                }
            }
        }
    }
    return [];
}

// ======================= BUTTONS =======================
const algoContainer = document.createElement("div");
algoContainer.style.position = "fixed";  // stays outside canvas
algoContainer.style.top = "50%";        // middle of screen
algoContainer.style.right = "0";        // stick to right edge
algoContainer.style.transform = "translateY(-50%)";
algoContainer.style.display = "flex";
algoContainer.style.flexDirection = "column";
algoContainer.style.gap = "12px";
algoContainer.style.padding = "15px 10px";
algoContainer.style.background = "rgba(0, 0, 0, 0.4)";
algoContainer.style.borderRadius = "12px 0 0 12px"; // rounded left edge only
algoContainer.style.boxShadow = "-4px 0 10px rgba(0,0,0,0.4)";
document.body.appendChild(algoContainer);

function makeButton(name, algoFn) {
    const btn = document.createElement("button");
    btn.innerText = "▶ " + name;
    btn.style.padding = "10px 20px";
    btn.style.borderRadius = "8px";
    btn.style.border = "none";
    btn.style.cursor = "pointer";
    btn.style.fontSize = "15px";
    btn.style.fontWeight = "bold";
    btn.style.background = "linear-gradient(135deg, #4CAF50, #2E7D32)";
    btn.style.color = "white";
    btn.style.transition = "all 0.3s ease";

    btn.onmouseover = () => {
        btn.style.background = "linear-gradient(135deg, #66BB6A, #388E3C)";
        btn.style.transform = "scale(1.05)";
    };
    btn.onmouseout = () => {
        btn.style.background = "linear-gradient(135deg, #4CAF50, #2E7D32)";
        btn.style.transform = "scale(1)";
    };

    btn.onclick = () => {
        if (!startPos || !goalPos) {
            console.warn("Start or Goal not defined");
            return;
        }
        const path = algoFn(map, startPos, goalPos);
        if (path.length > 0) {
            console.log(name + " Path Found!", path);
            drawPathOnMinimap(path);
        } else {
            console.log(name + " could not find a path.");
        }
    };

    algoContainer.appendChild(btn);
}

// Create all algorithm buttons
makeButton("BFS", bfs);
makeButton("DFS", dfs);
makeButton("Dijkstra", dijkstra);
makeButton("A*", astar);
makeButton("Greedy", greedy);

