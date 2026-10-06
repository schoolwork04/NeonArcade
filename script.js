// stars background effect
    (function(){
      var c = document.getElementById('stars'), ctx = c.getContext('2d');
      function resize() {
        c.width = window.innerWidth;
        c.height = window.innerHeight;
      }
      resize();
      window.addEventListener('resize', resize);
      var stars = [];
      for(var i = 0; i < 200; i++) {
        stars.push({
          x: Math.random() * 5000 % innerWidth || Math.random() * 1920,
          y: Math.random() * 1200,
          r: Math.random() * 1.4 + 0.3,
          t: Math.random() * 6.28,
          s: Math.random() * 0.4 + 0.1
        });
      }
      function drawStars() {
        ctx.clearRect(0, 0, c.width, c.height);
        stars.forEach(function(s) {
          s.t += s.s * 0.01;
          var a = 0.2 + 0.25 * Math.sin(s.t);
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, 6.28);
          ctx.fillStyle = 'rgba(180,220,255,' + a + ')';
          ctx.fill();
        });
        requestAnimationFrame(drawStars);
      }
      drawStars();
    })();

    // game data
    var GAMES = [
      { id: 'snake',    name: 'SNAKE',       emoji: '🐍', desc: 'Eat food, grow longer, avoid walls!',  tag: 'classic', tc: 't-classic', pc: 'p1' },
      { id: 'breakout', name: 'BREAKOUT',    emoji: '🧱', desc: 'Break all bricks with your ball!',     tag: 'arcade',  tc: 't-arcade',  pc: 'p2' },
      { id: 'tictac',   name: 'TIC TAC TOE', emoji: '⭕', desc: 'Beat the minimax AI — if you can!',    tag: 'strategy',tc: 't-strategy',pc: 'p3' },
      { id: 'flappy',   name: 'FLAPPY BIRD', emoji: '🐦', desc: 'Tap to fly through the pipes!',        tag: 'action',  tc: 't-action',  pc: 'p4' },
      { id: 'memory',   name: 'MEMORY',      emoji: '🃏', desc: 'Match all emoji pairs to win!',        tag: 'puzzle',  tc: 't-puzzle',  pc: 'p5' },
      { id: 'pong',     name: 'PONG',        emoji: '🏓', desc: 'Classic pong — you vs smart AI!',      tag: 'classic', tc: 't-classic', pc: 'p6' },
      { id: 'g2048',    name: '2048',        emoji: '🔢', desc: 'Merge tiles to reach 2048!',           tag: 'puzzle',  tc: 't-puzzle',  pc: 'p7' },
      { id: 'mines',    name: 'MINESWEEPER', emoji: '💣', desc: 'Clear the board, avoid the mines!',    tag: 'strategy',tc: 't-strategy',pc: 'p8' },
      { id: 'typing',   name: 'TYPE RACER',  emoji: '⌨️', desc: 'Type words fast — 30 second sprint!',  tag: 'arcade',  tc: 't-arcade',  pc: 'p9' },
      { id: 'simon',    name: 'SIMON SAYS',  emoji: '🎮', desc: 'Watch and repeat the color pattern!',  tag: 'classic', tc: 't-classic', pc: 'p10' },
      { id: 'wordle',   name: 'WORDLE',      emoji: '📝', desc: 'Guess the 5-letter word in 6 tries!', tag: 'puzzle',  tc: 't-puzzle',  pc: 'p11' },
      { id: 'dino',     name: 'DINO RUN',    emoji: '🦕', desc: 'Jump over cacti — endless runner!',   tag: 'action',  tc: 't-action',  pc: 'p12' },
      { id: 'tetris',   name: 'TETRIS',      emoji: '🟦', desc: 'Stack blocks, clear lines, survive!', tag: 'classic', tc: 't-classic', pc: 'p13' },
      { id: 'quiz',     name: 'TRIVIA QUIZ', emoji: '🧠', desc: '10 questions — how many can you get?', tag: 'strategy',tc: 't-strategy',pc: 'p14' },
      { id: 'ballshot', name: 'BALL SHOOT',  emoji: '🎯', desc: 'Aim and shoot moving targets!',       tag: 'action',  tc: 't-action',  pc: 'p15' },
    ];

    // highscore stuff
    var hi = {}, plays = 0;
    try {
      hi = JSON.parse(localStorage.getItem('na2-hi') || '{}');
    } catch(e) {}
    try {
      plays = parseInt(localStorage.getItem('na2-pl') || '0');
    } catch(e) {}
    document.getElementById('gplayed').textContent = plays;
    function updateBest() {
      var b = 0;
      Object.values(hi).forEach(function(v) {
        if(v > b) b = v;
      });
      document.getElementById('gbest').textContent = b;
    }
    updateBest();

    // build grid
    var grid = document.getElementById('ggrid');
    GAMES.forEach(function(g) {
      var d = document.createElement('div');
      d.className = 'card';
      d.innerHTML = '<div class="prev ' + g.pc + '"><span style="filter:drop-shadow(0 0 14px #00ffcc)">' + g.emoji + '</span></div>' +
        '<div class="cbody"><div class="cname">' + g.name + '</div><div class="cdesc">' + g.desc + '</div>' +
        '<div class="cmeta"><span class="ctag ' + g.tc + '">' + g.tag + '</span><span class="chi" id="hi-' + g.id + '">HI: ' + (hi[g.id] || 0) + '</span></div>' +
        '<button class="pbtn" onclick="openGame(\'' + g.id + '\')">PLAY</button></div>';
      grid.appendChild(d);
    });

    // modal stuff
    var cleanup = null, curId = null;
    function openGame(id) {
      if(cleanup) {
        try { cleanup(); } catch(e) {}
        cleanup = null;
      }
      curId = id;
      var g = GAMES.find(function(x) { return x.id === id; });
      document.getElementById('mtitle').textContent = g.name;
      document.getElementById('mscore').textContent = 'SCORE: 0';
      document.getElementById('gcw').innerHTML = '';
      document.getElementById('brow').innerHTML = '';
      document.getElementById('mctrl').textContent = '';
      document.getElementById('ov').classList.add('open');
      plays++;
      document.getElementById('gplayed').textContent = plays;
      try { localStorage.setItem('na2-pl', plays); } catch(e) {}
      try {
        LAUNCHERS[id]();
      } catch(err) {
        document.getElementById('gcw').innerHTML = '<div style="color:#ff006e;font-family:Orbitron,monospace;padding:20px;">Error: ' + err.message + '</div>';
      }
    }
    function closeModal() {
      if(cleanup) {
        try { cleanup(); } catch(e) {}
        cleanup = null;
      }
      document.getElementById('ov').classList.remove('open');
      GAMES.forEach(function(g) {
        var el = document.getElementById('hi-' + g.id);
        if(el) el.textContent = 'HI: ' + (hi[g.id] || 0);
      });
      updateBest();
    }
    document.getElementById('mclose').onclick = closeModal;
    document.getElementById('ov').addEventListener('click', function(e) {
      if(e.target === this) closeModal();
    });

    function setScore(n, lbl) {
      lbl = lbl || 'SCORE';
      n = Math.floor(n);
      document.getElementById('mscore').textContent = lbl + ': ' + n;
      if(curId && n > (hi[curId] || 0)) {
        hi[curId] = n;
        try { localStorage.setItem('na2-hi', JSON.stringify(hi)); } catch(e) {}
      }
    }
    function mkCv(w, h) {
      var cv = document.createElement('canvas');
      cv.width = w;
      cv.height = h;
      cv.style.cssText = 'border:1px solid rgba(0,255,204,0.2);border-radius:4px;display:block;';
      document.getElementById('gcw').appendChild(cv);
      return cv;
    }
    function addBtn(txt, fn, cls) {
      var b = document.createElement('button');
      b.className = 'gb ' + (cls || 's');
      b.textContent = txt;
      b.onclick = fn;
      document.getElementById('brow').appendChild(b);
    }
    function setCtrl(txt) {
      document.getElementById('mctrl').innerHTML = txt;
    }

    // ---------- GAME LAUNCHERS START HERE ----------

    // SNAKE
    function launchSnake() {
      var cv = mkCv(400,400), ctx = cv.getContext('2d');
      var SZ = 20, C = 20, R = 20, snake, dir, nd, food, score, alive, iv;
      function init() {
        snake = [{x:10,y:10},{x:9,y:10},{x:8,y:10}];
        dir = {x:1,y:0};
        nd = {x:1,y:0};
        score = 0;
        alive = true;
        placeFood();
        setScore(0);
      }
      function placeFood() {
        do {
          food = {x:Math.floor(Math.random()*C), y:Math.floor(Math.random()*R)};
        } while(snake.some(function(s){return s.x===food.x && s.y===food.y;}));
      }
      function draw() {
        ctx.fillStyle = '#030a06';
        ctx.fillRect(0,0,400,400);
        ctx.strokeStyle = 'rgba(0,80,40,0.35)';
        ctx.lineWidth = 0.5;
        for(var i=0;i<=C;i++) {
          ctx.beginPath();
          ctx.moveTo(i*SZ,0);
          ctx.lineTo(i*SZ,400);
          ctx.stroke();
        }
        for(var j=0;j<=R;j++) {
          ctx.beginPath();
          ctx.moveTo(0,j*SZ);
          ctx.lineTo(400,j*SZ);
          ctx.stroke();
        }
        ctx.fillStyle = '#ff006e';
        ctx.shadowColor = '#ff006e';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(food.x*SZ+SZ/2, food.y*SZ+SZ/2, SZ/2-2, 0, 6.28);
        ctx.fill();
        ctx.shadowBlur = 0;
        snake.forEach(function(s,i) {
          var ratio = i/snake.length;
          ctx.fillStyle = 'hsl(' + (145-ratio*20) + ',100%,' + (52-ratio*18) + '%)';
          ctx.shadowColor = i===0 ? '#00ff88' : 'transparent';
          ctx.shadowBlur = i===0 ? 12 : 0;
          ctx.fillRect(s.x*SZ+1, s.y*SZ+1, SZ-2, SZ-2);
        });
        ctx.shadowBlur = 0;
        if(!alive) {
          ctx.fillStyle = 'rgba(0,0,0,.72)';
          ctx.fillRect(0,0,400,400);
          ctx.fillStyle = '#ff006e';
          ctx.font = 'bold 28px Orbitron';
          ctx.textAlign = 'center';
          ctx.fillText('GAME OVER',200,180);
          ctx.fillStyle = '#00ffcc';
          ctx.font = '15px Orbitron';
          ctx.fillText('Score: '+score,200,220);
          ctx.fillText('Press R to restart',200,256);
        }
      }
      function step() {
        if(!alive) return;
        dir = {x:nd.x, y:nd.y};
        var head = {x:snake[0].x+dir.x, y:snake[0].y+dir.y};
        if(head.x<0 || head.x>=C || head.y<0 || head.y>=R || snake.some(function(s){return s.x===head.x && s.y===head.y;})) {
          alive = false;
          draw();
          return;
        }
        snake.unshift(head);
        if(head.x===food.x && head.y===food.y) {
          score += 10;
          setScore(score);
          placeFood();
        } else {
          snake.pop();
        }
        draw();
      }
      function onKey(e) {
        if((e.key==='r'||e.key==='R') && !alive) init();
        var m = {
          ArrowUp: {x:0,y:-1},
          ArrowDown: {x:0,y:1},
          ArrowLeft: {x:-1,y:0},
          ArrowRight: {x:1,y:0},
          w: {x:0,y:-1},
          s: {x:0,y:1},
          a: {x:-1,y:0},
          d: {x:1,y:0}
        };
        var dd = m[e.key];
        if(dd && !(dd.x===-dir.x && dd.y===-dir.y)) nd = dd;
        if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].indexOf(e.key) >= 0) e.preventDefault();
      }
      document.addEventListener('keydown', onKey);
      init();
      draw();
      iv = setInterval(step,130);
      setCtrl('Arrow Keys / WASD to move &nbsp; R to restart');
      addBtn('RESTART', function(){init();}, 'p');
      cleanup = function() {
        clearInterval(iv);
        document.removeEventListener('keydown', onKey);
      };
    }

    // BREAKOUT
    function launchBreakout() {
      var cv = mkCv(400,480), ctx = cv.getContext('2d');
      var ROWS = 5, COLS = 8, BW = 42, BH = 18, GAP = 5;
      var BCOLS = ['#ff006e','#ff5500','#ffcc00','#00ffcc','#7c00ff'];
      var bricks, ball, px, pw, score, lives, raf, running;
      function init() {
        bricks = [];
        for(var r=0;r<ROWS;r++) {
          for(var c=0;c<COLS;c++) {
            bricks.push({x:8+c*(BW+GAP), y:50+r*(BH+GAP), alive:true, col:BCOLS[r]});
          }
        }
        ball = {x:200, y:360, vx:3.5, vy:-4.5, r:7};
        px = 160;
        pw = 80;
        score = 0;
        lives = 3;
        running = true;
        setScore(0);
      }
      var mx = 200;
      function onMouseMove(e) {
        var r = cv.getBoundingClientRect();
        mx = e.clientX - r.left;
      }
      cv.addEventListener('mousemove', onMouseMove);
      cv.addEventListener('click', function() {
        if(!running) init();
      });
      function draw() {
        ctx.fillStyle = '#04040f';
        ctx.fillRect(0,0,400,480);
        bricks.forEach(function(b) {
          if(!b.alive) return;
          ctx.fillStyle = b.col;
          ctx.shadowColor = b.col;
          ctx.shadowBlur = 6;
          ctx.fillRect(b.x, b.y, BW, BH);
          ctx.fillStyle = 'rgba(255,255,255,.2)';
          ctx.fillRect(b.x, b.y, BW, 4);
          ctx.shadowBlur = 0;
        });
        var g = ctx.createLinearGradient(px,0,px+pw,0);
        g.addColorStop(0, '#00ffcc');
        g.addColorStop(1, '#7c00ff');
        ctx.fillStyle = g;
        ctx.fillRect(px, 455, pw, 10);
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.r, 0, 6.28);
        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 14;
        ctx.fill();
        ctx.shadowBlur = 0;
        for(var i=0;i<lives;i++) {
          ctx.fillStyle = '#ff006e';
          ctx.beginPath();
          ctx.arc(12+i*22, 28, 7, 0, 6.28);
          ctx.fill();
        }
        ctx.fillStyle = 'rgba(255,255,255,.7)';
        ctx.font = '13px Orbitron';
        ctx.textAlign = 'right';
        ctx.fillText('SCORE: '+score, 390, 32);
        if(!running) {
          var won = bricks.every(function(b){return !b.alive;});
          ctx.fillStyle = 'rgba(0,0,0,.78)';
          ctx.fillRect(0,0,400,480);
          ctx.fillStyle = won ? '#00ffcc' : '#ff006e';
          ctx.font = 'bold 26px Orbitron';
          ctx.textAlign = 'center';
          ctx.fillText(won ? 'YOU WIN!' : 'GAME OVER', 200, 220);
          ctx.fillStyle = '#fff';
          ctx.font = '14px Orbitron';
          ctx.fillText('Score: '+score, 200, 260);
          ctx.fillText('Click to restart', 200, 296);
        }
      }
      function update() {
        if(!running) return;
        px = Math.max(0, Math.min(400-pw, mx-pw/2));
        ball.x += ball.vx;
        ball.y += ball.vy;
        if(ball.x <= ball.r || ball.x >= 400-ball.r) ball.vx *= -1;
        if(ball.y <= ball.r) ball.vy *= -1;
        if(ball.y >= 480) {
          lives--;
          if(lives <= 0) running = false;
          else ball = {x:200, y:360, vx:3.5, vy:-4.5, r:7};
        }
        if(ball.y+ball.r >= 455 && ball.x >= px && ball.x <= px+pw && ball.vy>0) {
          ball.vy = -Math.abs(ball.vy);
          ball.vx = ((ball.x-px)/pw - 0.5) * 10;
        }
        bricks.forEach(function(b) {
          if(!b.alive) return;
          if(ball.x > b.x-ball.r && ball.x < b.x+BW+ball.r && ball.y > b.y-ball.r && ball.y < b.y+BH+ball.r) {
            b.alive = false;
            ball.vy *= -1;
            score += 10;
            setScore(score);
          }
        });
        if(bricks.every(function(b){return !b.alive;})) running = false;
      }
      init();
      function loop() {
        update();
        draw();
        raf = requestAnimationFrame(loop);
      }
      loop();
      setCtrl('Move mouse to control paddle &nbsp; Click to restart after game over');
      cleanup = function() {
        cancelAnimationFrame(raf);
        cv.removeEventListener('mousemove', onMouseMove);
      };
    }

    // TIC TAC TOE
    function launchTicTac() {
      var board, over, score = 0;
      function wins(b,p) {
        var w = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        return w.some(function(ww) {
          return ww.every(function(i){return b[i]===p;});
        });
      }
      function minimax(b, isMax, d) {
        if(wins(b,'O')) return 10-d;
        if(wins(b,'X')) return d-10;
        if(b.every(function(c){return c;})) return 0;
        var best = isMax ? -99 : 99;
        for(var i=0;i<9;i++) {
          if(b[i]) continue;
          b[i] = isMax ? 'O' : 'X';
          var v = minimax(b, !isMax, d+1);
          b[i] = '';
          best = isMax ? Math.max(best, v) : Math.min(best, v);
        }
        return best;
      }
      function aiMove() {
        var best = -99, idx = 4;
        board.forEach(function(_,i) {
          if(board[i]) return;
          board[i] = 'O';
          var v = minimax(board.slice(), false, 0);
          board[i] = '';
          if(v > best) { best = v; idx = i; }
        });
        if(!board[idx]) board[idx] = 'O';
      }
      function render(msg) {
        var gcw = document.getElementById('gcw');
        gcw.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;gap:12px;">' +
          '<div style="display:grid;grid-template-columns:repeat(3,96px);gap:8px;background:rgba(0,255,204,0.06);padding:8px;border-radius:10px;" id="ttt"></div>' +
          '<div style="font-family:Orbitron,monospace;font-size:.85rem;color:#00ffcc;text-align:center;">'+(msg||'Your turn (X)')+'</div></div>';
        var ttt = document.getElementById('ttt');
        board.forEach(function(v,i) {
          var cell = document.createElement('div');
          cell.style.cssText = 'width:96px;height:96px;background:#0a1020;border:1px solid #1a2540;border-radius:8px;display:flex;align-items:center;justify-content:center;font-family:Orbitron,monospace;font-size:2.4rem;font-weight:900;color:'+(v==='X'?'#ff006e':'#00ffcc')+';cursor:'+((!v&&!over)?'pointer':'default')+';transition:background .12s;';
          cell.textContent = v;
          if(!v && !over) {
            cell.onmouseenter = function(){this.style.background='rgba(0,255,204,0.08)';};
            cell.onmouseleave = function(){this.style.background='#0a1020';};
            cell.onclick = function(){ move(i); };
          }
          ttt.appendChild(cell);
        });
      }
      function move(i) {
        if(board[i] || over) return;
        board[i] = 'X';
        if(wins(board,'X')) {
          over = true;
          score += 10;
          setScore(score);
          render('You win! 🎉');
          return;
        }
        if(board.every(function(c){return c;})) {
          over = true;
          render('Draw!');
          return;
        }
        render('AI thinking...');
        setTimeout(function() {
          aiMove();
          if(wins(board,'O')) {
            over = true;
            render('AI wins! 🤖');
          } else if(board.every(function(c){return c;})) {
            over = true;
            render('Draw!');
          } else {
            render();
          }
        }, 380);
      }
      function newGame() {
        board = Array(9).fill('');
        over = false;
        render();
      }
      newGame();
      addBtn('NEW GAME', newGame, 'p');
      setCtrl('Click a cell to place X &nbsp; AI plays O with perfect minimax');
      cleanup = function(){};
    }

    // FLAPPY BIRD
    function launchFlappy() {
      var cv = mkCv(360,500), ctx = cv.getContext('2d');
      var bird, pipes, score, alive, started, raf, frame;
      function init() {
        bird = {x:80, y:250, vy:0};
        pipes = [];
        score = 0;
        alive = true;
        started = false;
        frame = 0;
        setScore(0);
      }
      function flap() {
        if(!alive) { init(); return; }
        if(!started) started = true;
        bird.vy = -7.5;
      }
      cv.addEventListener('click', flap);
      function onKey(e) {
        if(e.code === 'Space') {
          e.preventDefault();
          flap();
        }
      }
      document.addEventListener('keydown', onKey);
      function draw() {
        var sky = ctx.createLinearGradient(0,0,0,500);
        sky.addColorStop(0, '#000d20');
        sky.addColorStop(1, '#001a40');
        ctx.fillStyle = sky;
        ctx.fillRect(0,0,360,500);
        ctx.fillStyle = '#001a30';
        ctx.fillRect(0,478,360,22);
        pipes.forEach(function(p) {
          ctx.fillStyle = '#005522';
          ctx.fillRect(p.x,0,48,p.top);
          ctx.fillRect(p.x,p.top+145,48,500);
          ctx.fillStyle = '#007733';
          ctx.fillRect(p.x-5,p.top-18,58,18);
          ctx.fillRect(p.x-5,p.top+145,58,18);
        });
        ctx.save();
        ctx.translate(bird.x, bird.y);
        ctx.rotate(Math.max(-0.5, Math.min(0.5, bird.vy*0.04)));
        ctx.fillStyle = '#ffcc00';
        ctx.shadowColor = '#ffcc00';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.ellipse(0,0,14,11,0,0,6.28);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(7,-3,5,0,6.28);
        ctx.fill();
        ctx.fillStyle = '#222';
        ctx.beginPath();
        ctx.arc(9,-3,2.5,0,6.28);
        ctx.fill();
        ctx.fillStyle = '#ff8800';
        ctx.beginPath();
        ctx.ellipse(-4,4,8,5,0.4,0,6.28);
        ctx.fill();
        ctx.restore();
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 22px Orbitron';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0,0,0,.5)';
        ctx.shadowBlur = 4;
        ctx.fillText(score, 180, 40);
        ctx.shadowBlur = 0;
        if(!started) {
          ctx.fillStyle = 'rgba(0,0,0,.55)';
          ctx.fillRect(0,0,360,500);
          ctx.fillStyle = '#00ffcc';
          ctx.font = '18px Orbitron';
          ctx.textAlign = 'center';
          ctx.fillText('CLICK TO START', 180, 250);
        }
        if(!alive) {
          ctx.fillStyle = 'rgba(0,0,0,.78)';
          ctx.fillRect(0,0,360,500);
          ctx.fillStyle = '#ff006e';
          ctx.font = 'bold 26px Orbitron';
          ctx.textAlign = 'center';
          ctx.fillText('GAME OVER', 180, 210);
          ctx.fillStyle = '#fff';
          ctx.font = '14px Orbitron';
          ctx.fillText('Score: '+score, 180, 252);
          ctx.fillText('Click to restart', 180, 290);
        }
      }
      function update() {
        if(!started || !alive) return;
        frame++;
        bird.vy += 0.38;
        bird.y += bird.vy;
        if(bird.y > 484 || bird.y < 0) {
          alive = false;
          setScore(score);
          return;
        }
        if(frame % 88 === 0) {
          var top = 70 + Math.random() * 200;
          pipes.push({x:365, top:top, ok:false});
        }
        for(var i=pipes.length-1; i>=0; i--) {
          pipes[i].x -= 2.6;
          if(bird.x > pipes[i].x+4 && bird.x < pipes[i].x+44 && (bird.y < pipes[i].top+4 || bird.y > pipes[i].top+145-4)) {
            alive = false;
            setScore(score);
            return;
          }
          if(!pipes[i].ok && pipes[i].x+48 < bird.x) {
            pipes[i].ok = true;
            score++;
            setScore(score);
          }
          if(pipes[i].x < -55) pipes.splice(i,1);
        }
      }
      init();
      function loop() {
        draw();
        update();
        raf = requestAnimationFrame(loop);
      }
      loop();
      setCtrl('Click or Space to flap &nbsp; Avoid pipes!');
      cleanup = function() {
        cancelAnimationFrame(raf);
        document.removeEventListener('keydown', onKey);
      };
    }

    // MEMORY
    function launchMemory() {
      var ems = ['🎮','🚀','⭐','💎','🔥','🌊','🎯','🎪'];
      var cards, flipped, matched, moves, lock;
      function init() {
        var pairs = ems.concat(ems).sort(function(){return Math.random() - 0.5;});
        cards = pairs.map(function(e,i) {
          return {id:i, val:e, shown:false, done:false};
        });
        flipped = [];
        matched = 0;
        moves = 0;
        lock = false;
        setScore(0);
        render();
      }
      function render() {
        var gcw = document.getElementById('gcw');
        gcw.innerHTML = '<div style="max-width:360px;"><div style="font-family:Orbitron,monospace;font-size:.65rem;color:#4a5580;text-align:center;margin-bottom:8px;">MOVES: '+moves+' | PAIRS: '+matched+'/8</div>' +
          '<div style="display:grid;grid-template-columns:repeat(4,72px);gap:8px;justify-content:center;" id="mgrid"></div>' +
          (matched===8 ? '<div style="font-family:Orbitron,monospace;color:#00ffcc;text-align:center;margin-top:14px;">COMPLETE in '+moves+' moves!</div>' : '') + '</div>';
        var mg = document.getElementById('mgrid');
        cards.forEach(function(card,i) {
          var d = document.createElement('div');
          var show = card.shown || card.done;
          d.style.cssText = 'width:72px;height:72px;background:'+(show?'rgba(0,255,204,0.07)':'#0f1525')+';border:1px solid '+(card.done?'#00ffcc':show?'rgba(0,255,204,0.4)':'#1a2540')+';border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:'+(show?'2':'0')+'rem;cursor:'+(card.done||card.shown?'default':'pointer')+';transition:all .25s;box-shadow:'+(card.done?'0 0 10px rgba(0,255,204,.3)':'none')+';';
          d.textContent = show ? card.val : '';
          if(!card.done && !card.shown) d.onclick = function(){ memClick(i); };
          mg.appendChild(d);
        });
      }
      function memClick(i) {
        if(lock || cards[i].done || cards[i].shown) return;
        cards[i].shown = true;
        flipped.push(i);
        moves++;
        render();
        if(flipped.length === 2) {
          lock = true;
          var a = flipped[0], b = flipped[1];
          if(cards[a].val === cards[b].val) {
            cards[a].done = cards[b].done = true;
            matched++;
            setScore(Math.max(0, 200 - moves*4));
            flipped = [];
            lock = false;
            render();
          } else {
            setTimeout(function() {
              cards[a].shown = cards[b].shown = false;
              flipped = [];
              lock = false;
              render();
            }, 850);
          }
        }
      }
      init();
      addBtn('NEW GAME', init, 'p');
      setCtrl('Click cards to flip them &nbsp; Match all pairs to win!');
      cleanup = function(){};
    }

    // PONG (fixed score display for player)
    function launchPong() {
      var cv = mkCv(480,320), ctx = cv.getContext('2d');
      var PH = 66, PW = 10, SPD = 4;
      var ball, p1y, p2y, s1, s2, raf;
      function init() {
        ball = {x:240, y:160, vx:SPD*(Math.random()>0.5?1:-1), vy:(Math.random()-0.5)*5};
        p1y = 127;
        p2y = 127;
        s1 = 0;
        s2 = 0;
        setScore(0);
      }
      var my = 160;
      function onMouseMove(e) {
        var r = cv.getBoundingClientRect();
        my = e.clientY - r.top;
      }
      cv.addEventListener('mousemove', onMouseMove);
      function draw() {
        ctx.fillStyle = '#04040f';
        ctx.fillRect(0,0,480,320);
        ctx.setLineDash([8,8]);
        ctx.strokeStyle = 'rgba(255,255,255,.08)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(240,0);
        ctx.lineTo(240,320);
        ctx.stroke();
        ctx.setLineDash([]);
        var g = ctx.createLinearGradient(0,0,0,PH);
        g.addColorStop(0, '#00ffcc');
        g.addColorStop(1, '#7c00ff');
        ctx.fillStyle = g;
        ctx.fillRect(8, p1y, PW, PH);
        ctx.fillRect(462, p2y, PW, PH);
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, 8, 0, 6.28);
        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255,255,255,.6)';
        ctx.font = 'bold 34px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText(s1, 120, 48);
        ctx.fillText(s2, 360, 48);
        ctx.font = '9px Rajdhani';
        ctx.fillStyle = 'rgba(255,255,255,.3)';
        ctx.fillText('YOU', 120, 62);
        ctx.fillText('AI', 360, 62);
      }
      function update() {
        p1y = Math.max(0, Math.min(320-PH, my-PH/2));
        p2y += (ball.y - PH/2 - p2y) * 0.1;
        p2y = Math.max(0, Math.min(320-PH, p2y));
        ball.x += ball.vx;
        ball.y += ball.vy;
        if(ball.y <= 8 || ball.y >= 312) ball.vy *= -1;
        if(ball.x <= 20 && ball.y >= p1y && ball.y <= p1y+PH && ball.vx < 0) ball.vx = Math.abs(ball.vx) + 0.2;
        if(ball.x >= 460 && ball.y >= p2y && ball.y <= p2y+PH && ball.vx > 0) ball.vx = -Math.abs(ball.vx);
        if(ball.x < 0) {
          s2++;
          setScore(s1);  // show player score only
          ball = {x:240, y:160, vx:SPD, vy:(Math.random()-0.5)*5};
        }
        if(ball.x > 480) {
          s1++;
          setScore(s1);
          ball = {x:240, y:160, vx:-SPD, vy:(Math.random()-0.5)*5};
        }
      }
      init();
      function loop() {
        draw();
        update();
        raf = requestAnimationFrame(loop);
      }
      loop();
      addBtn('RESTART', init, 'p');
      setCtrl('Move mouse to control left paddle &nbsp; AI controls right');
      cleanup = function() {
        cancelAnimationFrame(raf);
        cv.removeEventListener('mousemove', onMouseMove);
      };
    }

    // 2048
    function launch2048() {
      var board, score;
      var CM = {
        '': ['#0f1525','#2a3550'],
        '2': ['#1a2040','#00ffcc'],
        '4': ['#160d38','#aa66ff'],
        '8': ['#1e0d00','#ff8800'],
        '16': ['#220800','#ff5500'],
        '32': ['#260000','#ff2200'],
        '64': ['#260010','#ff006e'],
        '128': ['#001a0d','#00ff88'],
        '256': ['#001222','#00ccff'],
        '512': ['#0e0022','#aa44ff'],
        '1024': ['#1a1200','#ffcc00'],
        '2048': ['#1e0a00','#ff8800']
      };
      function init() {
        board = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
        score = 0;
        addT();
        addT();
        render();
      }
      function addT() {
        var e = [];
        board.forEach(function(row,r) {
          row.forEach(function(v,c) {
            if(!v) e.push([r,c]);
          });
        });
        if(!e.length) return;
        var p = e[Math.floor(Math.random() * e.length)];
        board[p[0]][p[1]] = Math.random() < 0.9 ? 2 : 4;
      }
      function slide(row) {
        var r = row.filter(function(v){return v;});
        for(var i=0; i<r.length-1; i++) {
          if(r[i] === r[i+1]) {
            r[i] *= 2;
            score += r[i];
            r.splice(i+1,1);
          }
        }
        while(r.length < 4) r.push(0);
        return r;
      }
      function render() {
        setScore(score);
        var gcw = document.getElementById('gcw');
        gcw.innerHTML = '<div style="display:grid;grid-template-columns:repeat(4,80px);gap:8px;background:rgba(0,255,204,0.04);padding:10px;border-radius:10px;border:1px solid rgba(0,255,204,.08);">' +
          board.flat().map(function(v) {
            var k = String(v || '');
            var c = CM[k] || CM['2048'];
            return '<div style="width:80px;height:80px;background:'+c[0]+';border:1px solid rgba(255,255,255,0.06);border-radius:8px;display:flex;align-items:center;justify-content:center;font-family:Orbitron,monospace;font-size:'+(v>999?'1.0':v>99?'1.3':'1.8')+'rem;font-weight:900;color:'+c[1]+';box-shadow:'+(v?'0 0 10px '+c[1]+'44':'none')+';">'+(v||'')+'</div>';
          }).join('') + '</div>';
      }
      function move(dir) {
        var old = board.map(function(r){return r.slice();});
        if(dir === 'left') {
          board = board.map(function(r){return slide(r);});
        } else if(dir === 'right') {
          board = board.map(function(r){return slide(r.slice().reverse()).reverse();});
        } else {
          for(var c=0;c<4;c++) {
            var col = board.map(function(r){return r[c];});
            if(dir === 'down') col = col.reverse();
            col = slide(col);
            if(dir === 'down') col = col.reverse();
            board.forEach(function(r,i){ r[c] = col[i]; });
          }
        }
        var changed = false;
        board.forEach(function(r,i) {
          r.forEach(function(v,j) {
            if(v !== old[i][j]) changed = true;
          });
        });
        if(changed) addT();
        render();
      }
      function onKey(e) {
        var m = {ArrowLeft:'left', ArrowRight:'right', ArrowUp:'up', ArrowDown:'down'};
        if(m[e.key]) {
          e.preventDefault();
          move(m[e.key]);
        }
      }
      document.addEventListener('keydown', onKey);
      init();
      addBtn('NEW GAME', init, 'p');
      setCtrl('Arrow keys to slide tiles &nbsp; Merge same numbers &nbsp; Reach 2048!');
      cleanup = function() {
        document.removeEventListener('keydown', onKey);
      };
    }

    // MINESWEEPER
    function launchMinesweeper() {
      var ROWS = 10, COLS = 10, MINES = 15;
      var board, revealed, flagged, over, first;
      var NC = ['','#00ffcc','#aa66ff','#ff006e','#ff8800','#ff4444','#00ccff','#ffcc00','#aaa'];
      function init() {
        board = [];
        revealed = [];
        flagged = [];
        over = false;
        first = true;
        for(var r=0;r<ROWS;r++) {
          board.push([]);
          revealed.push([]);
          flagged.push([]);
          for(var c=0;c<COLS;c++) {
            board[r].push(0);
            revealed[r].push(false);
            flagged[r].push(false);
          }
        }
        setScore(0);
        render();
      }
      function place(sr, sc) {
        var placed = 0;
        while(placed < MINES) {
          var r = Math.floor(Math.random() * ROWS);
          var c = Math.floor(Math.random() * COLS);
          if(board[r][c] !== -1 && !(Math.abs(r-sr)<=1 && Math.abs(c-sc)<=1)) {
            board[r][c] = -1;
            placed++;
          }
        }
        for(var rr=0;rr<ROWS;rr++) {
          for(var cc=0;cc<COLS;cc++) {
            if(board[rr][cc] === -1) continue;
            var cnt = 0;
            for(var dr=-1;dr<=1;dr++) {
              for(var dc=-1;dc<=1;dc++) {
                var nr = rr+dr, nc = cc+dc;
                if(nr>=0 && nr<ROWS && nc>=0 && nc<COLS && board[nr][nc]===-1) cnt++;
              }
            }
            board[rr][cc] = cnt;
          }
        }
      }
      function flood(r,c) {
        if(r<0 || r>=ROWS || c<0 || c>=COLS || revealed[r][c] || flagged[r][c]) return;
        revealed[r][c] = true;
        if(board[r][c] === 0) {
          for(var dr=-1;dr<=1;dr++) {
            for(var dc=-1;dc<=1;dc++) {
              flood(r+dr, c+dc);
            }
          }
        }
      }
      function render() {
        var safe = 0;
        revealed.forEach(function(row) {
          row.forEach(function(v) {
            if(v) safe++;
          });
        });
        var gcw = document.getElementById('gcw');
        gcw.innerHTML = '<div><div style="font-family:Orbitron,monospace;font-size:.65rem;color:#4a5580;text-align:center;margin-bottom:7px;">Mines: '+MINES+' | Safe: '+safe+'/'+(ROWS*COLS-MINES)+'</div><div id="mgd" style="display:grid;grid-template-columns:repeat('+COLS+',30px);gap:3px;justify-content:center;"></div>' + (over?'<div style="font-family:Orbitron,monospace;color:#ff006e;text-align:center;margin-top:10px;font-size:.8rem;">BOOM! Click New Game</div>':'') + '</div>';
        var mg = document.getElementById('mgd');
        board.forEach(function(row,r) {
          row.forEach(function(v,c) {
            var rev = revealed[r][c], flag = flagged[r][c];
            var d = document.createElement('div');
            var bg = '#0f1525', bord = '#1a2540', content = '', col = '#fff';
            if(over && v===-1 && !flag) {
              bg = 'rgba(255,0,110,.15)';
              bord = '#ff006e';
              content = '💣';
            } else if(flag) {
              content = '🚩';
              bg = 'rgba(255,204,0,.1)';
              bord = 'rgba(255,204,0,.4)';
            } else if(rev) {
              bg = 'rgba(0,255,204,.05)';
              bord = 'rgba(0,255,204,.12)';
              content = v===-1 ? '💥' : v>0 ? String(v) : '';
              col = v>0 ? NC[v] : '#fff';
            }
            d.style.cssText = 'width:30px;height:30px;background:'+bg+';border:1px solid '+bord+';border-radius:4px;display:flex;align-items:center;justify-content:center;font-family:Orbitron,monospace;font-size:.75rem;font-weight:700;color:'+col+';cursor:pointer;user-select:none;';
            d.textContent = content;
            d.onclick = function() {
              if(over || flagged[r][c]) return;
              if(first) {
                place(r,c);
                first = false;
              }
              if(board[r][c] === -1) {
                revealed[r][c] = true;
                over = true;
                setScore(0);
              } else {
                flood(r,c);
                var s = 0;
                revealed.forEach(function(rw) {
                  rw.forEach(function(vv) {
                    if(vv) s++;
                  });
                });
                setScore(s * 5);
              }
              render();
            };
            d.oncontextmenu = function(e) {
              e.preventDefault();
              if(over || revealed[r][c]) return;
              flagged[r][c] = !flagged[r][c];
              render();
            };
            mg.appendChild(d);
          });
        });
      }
      init();
      addBtn('NEW GAME', init, 'p');
      setCtrl('Left click = reveal &nbsp; Right click = flag &nbsp; First click is safe!');
      cleanup = function(){};
    }

    // TYPE RACER
    function launchTyping() {
      var WORDS = ['javascript','algorithm','keyboard','neon','arcade','developer','function','variable','interface','terminal','quantum','cyber','neural','matrix','binary','pixel','vector','syntax','lambda','cluster'];
      var cur, typed, score, timeLeft, iv, active;
      function rnd() { return WORDS[Math.floor(Math.random() * WORDS.length)]; }
      function init() {
        cur = rnd();
        typed = '';
        score = 0;
        timeLeft = 30;
        active = false;
        setScore(0);
        render();
      }
      function render() {
        var chars = cur.split('').map(function(ch,i) {
          var col = i<typed.length ? (typed[i]===ch ? '#00ffcc' : '#ff006e') : (i===typed.length ? '#fff' : '#4a5580');
          var ul = i===typed.length ? 'text-decoration:underline;' : '';
          return '<span style="color:'+col+';'+ul+'">'+ch+'</span>';
        }).join('');
        var gcw = document.getElementById('gcw');
        gcw.innerHTML = '<div style="width:400px;max-width:90vw;text-align:center;">' +
          '<div style="background:rgba(0,255,204,0.04);border:1px solid rgba(0,255,204,.12);border-radius:10px;padding:28px 20px;margin-bottom:14px;">' +
          '<div style="font-family:Orbitron,monospace;font-size:.65rem;color:#4a5580;margin-bottom:14px;letter-spacing:2px;">'+timeLeft+'s | SCORE: '+score+'</div>' +
          '<div style="font-family:Orbitron,monospace;font-size:1.9rem;letter-spacing:.15em;margin-bottom:18px;">'+chars+'</div>' +
          '<input id="tinp" type="text" autocomplete="off" autocorrect="off" spellcheck="false" style="background:transparent;border:none;border-bottom:2px solid rgba(0,255,204,.35);outline:none;font-family:Orbitron,monospace;font-size:1.2rem;color:#fff;text-align:center;width:100%;caret-color:#00ffcc;letter-spacing:.08em;" placeholder="'+(active?'type here...':'click Start!')+'"/></div>' +
          (!active ? '<button id="startbtn" style="background:#00ffcc;color:#000;border:none;padding:11px 28px;font-family:Orbitron,monospace;font-size:.75rem;border-radius:4px;cursor:pointer;letter-spacing:2px;">START</button>' : '') + '</div>';
        if(active) {
          var inp = document.getElementById('tinp');
          if(inp) {
            inp.value = typed;
            inp.oninput = function() {
              typed = inp.value;
              if(typed === cur) {
                score += cur.length * 5;
                setScore(score);
                cur = rnd();
                typed = '';
              }
              render();
              setTimeout(function() {
                var t = document.getElementById('tinp');
                if(t) { t.focus(); }
              }, 0);
            };
            inp.focus();
          }
        } else {
          var sb = document.getElementById('startbtn');
          if(sb) sb.onclick = function() {
            active = true;
            render();
            iv = setInterval(function() {
              timeLeft--;
              if(timeLeft <= 0) {
                clearInterval(iv);
                active = false;
              }
              render();
            }, 1000);
          };
        }
      }
      init();
      setCtrl('Type the word shown &nbsp; 30 seconds &nbsp; Longer words = more points');
      cleanup = function() { clearInterval(iv); };
    }

    // SIMON SAYS (fixed small syntax consistency)
    function launchSimon() {
      var COLS = ['#ff006e','#00ffcc','#ffcc00','#7c00ff'];
      var LBLS = ['RED','CYAN','YELLOW','VIOLET'];
      var seq, pSeq, level, phase, lit;
      function init() {
        seq = [];
        level = 0;
        pSeq = [];
        phase = 'watch';
        lit = -1;
        addStep();
      }
      function addStep() {
        level++;
        seq.push(Math.floor(Math.random() * 4));
        setScore(level-1);
        playSeq();
      }
      function render(msg) {
        var gcw = document.getElementById('gcw');
        gcw.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;gap:14px;">' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;" id="sboard"></div>' +
          '<div style="font-family:Orbitron,monospace;font-size:.8rem;color:#4a5580;text-align:center;">Level '+level+' | '+(msg||'')+'</div></div>';
        var sb = document.getElementById('sboard');
        COLS.forEach(function(col,i) {
          var d = document.createElement('div');
          var on = lit === i;
          d.style.cssText = 'width:118px;height:118px;border-radius:16px;background:'+(on?col:'rgba(255,255,255,0.04)')+';border:2px solid '+col+';display:flex;align-items:center;justify-content:center;font-family:Orbitron,monospace;font-size:.6rem;letter-spacing:1px;font-weight:700;color:'+(on?'#000':col)+';transition:all .1s;box-shadow:'+(on?'0 0 28px '+col:'none')+';cursor:'+(phase==='player'?'pointer':'default')+';';
          d.textContent = LBLS[i];
          if(phase === 'player') d.onclick = function() { simonClick(i); };
          sb.appendChild(d);
        });
      }
      function sleep(ms) { return new Promise(function(r){ setTimeout(r,ms); }); }
      async function playSeq() {
        render('Watch...');
        await sleep(700);
        for(var i=0; i<seq.length; i++) {
          lit = seq[i];
          render('Watch...');
          await sleep(550);
          lit = -1;
          render('Watch...');
          await sleep(200);
        }
        phase = 'player';
        pSeq = [];
        lit = -1;
        render('Your turn!');
      }
      function simonClick(i) {
        if(phase !== 'player') return;
        lit = i;
        render('Your turn!');
        setTimeout(function() {
          lit = -1;
          render('Your turn!');
        }, 200);
        pSeq.push(i);
        if(pSeq[pSeq.length-1] !== seq[pSeq.length-1]) {
          phase = 'over';
          setScore(level-1);
          render('Wrong! Score: '+(level-1));
          return;
        }
        if(pSeq.length === seq.length) {
          phase = 'watch';
          setTimeout(addStep, 700);
        }
      }
      init();
      setCtrl('Watch the flashing pattern then repeat it!');
      cleanup = function(){};
    }

    // WORDLE
    function launchWordle() {
      var WDS = ['CRANE','SLATE','BLAST','PIXEL','CYBER','FLASH','LIGHT','STORM','FLAME','GHOST','BLADE','PRIZE','TOWER','SLOPE','GRIND','SPARK','DRIFT','CHUNK','FROWN','PLANT'];
      var secret, guesses, cur, done;
      function init() {
        secret = WDS[Math.floor(Math.random() * WDS.length)];
        guesses = [];
        cur = '';
        done = false;
        setScore(0);
        render();
      }
      function showMsg(txt,col) {
        var el = document.getElementById('wmsg');
        if(el) {
          el.textContent = txt;
          el.style.color = col || '#4a5580';
        }
      }
      function render() {
        var gcw = document.getElementById('gcw');
        var rows = Array(6).fill(0).map(function(_,i) {
          var guess = guesses[i];
          var isCur = i === guesses.length && !done;
          var letters = Array(5).fill('');
          if(guess) {
            guess.split('').forEach(function(ch,j){ letters[j] = ch; });
          } else if(isCur) {
            cur.split('').forEach(function(ch,j){ letters[j] = ch; });
          }
          return '<div style="display:flex;gap:6px;">' + letters.map(function(ch,j) {
            var bg = '#0f1525', bord = '#1a2540', col = '#fff';
            if(guess) {
              if(ch === secret[j]) {
                bg = 'rgba(0,200,80,.18)';
                bord = '#00cc50';
                col = '#00ee60';
              } else if(secret.indexOf(ch) >= 0) {
                bg = 'rgba(255,200,0,.14)';
                bord = '#ffcc00';
                col = '#ffdd44';
              } else {
                bg = 'rgba(255,255,255,.04)';
                bord = '#252a3a';
                col = '#445';
              }
            } else if(isCur && ch) {
              bord = 'rgba(0,255,204,.5)';
            }
            return '<div style="width:44px;height:44px;background:'+bg+';border:2px solid '+bord+';border-radius:6px;display:flex;align-items:center;justify-content:center;font-family:Orbitron,monospace;font-weight:900;font-size:1.1rem;color:'+col+';">'+ch+'</div>';
          }).join('') + '</div>';
        }).join('');
        var used = {};
        guesses.forEach(function(g) {
          g.split('').forEach(function(ch,j) {
            if(ch === secret[j]) used[ch] = 'g';
            else if(secret.indexOf(ch) >= 0 && used[ch] !== 'g') used[ch] = 'y';
            else if(!used[ch]) used[ch] = 'd';
          });
        });
        var kbRows = ['QWERTYUIOP','ASDFGHJKL','ZXCVBNM'];
        var kbHtml = kbRows.map(function(row) {
          return '<div style="display:flex;gap:4px;justify-content:center;margin-bottom:4px;">' + row.split('').map(function(k) {
            var col = used[k]==='g' ? 'rgba(0,200,80,.3)' : used[k]==='y' ? 'rgba(255,200,0,.2)' : used[k]==='d' ? 'rgba(255,255,255,.03)' : 'rgba(255,255,255,.08)';
            var tc = used[k]==='g' ? '#00ee60' : used[k]==='y' ? '#ffdd44' : used[k]==='d' ? '#333' : '#e0eaff';
            return '<div onclick="wT(\''+k+'\')" style="width:30px;height:34px;background:'+col+';border:1px solid rgba(255,255,255,.08);border-radius:4px;display:flex;align-items:center;justify-content:center;font-family:Orbitron,monospace;font-size:.55rem;font-weight:700;cursor:pointer;color:'+tc+';">'+k+'</div>';
          }).join('') + '</div>';
        }).join('');
        gcw.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;gap:8px;">' +
          '<div style="display:flex;flex-direction:column;gap:6px;">'+rows+'</div>' +
          '<div id="wmsg" style="font-family:Orbitron,monospace;font-size:.72rem;color:#4a5580;min-height:20px;text-align:center;"></div>' +
          '<div>'+kbHtml +
          '<div style="display:flex;gap:4px;justify-content:center;margin-top:4px;">' +
          '<div onclick="wD()" style="width:50px;height:34px;background:rgba(255,0,110,.15);border:1px solid rgba(255,0,110,.3);border-radius:4px;display:flex;align-items:center;justify-content:center;font-family:Orbitron,monospace;font-size:.55rem;cursor:pointer;color:#ff006e;">DEL</div>' +
          '<div onclick="wE()" style="width:60px;height:34px;background:rgba(0,255,204,.12);border:1px solid rgba(0,255,204,.3);border-radius:4px;display:flex;align-items:center;justify-content:center;font-family:Orbitron,monospace;font-size:.55rem;cursor:pointer;color:#00ffcc;">ENTER</div>' +
          '</div></div></div>';
      }
      window.wT = function(k) {
        if(!done && cur.length < 5) {
          cur += k;
          render();
        }
      };
      window.wD = function() {
        if(!done) {
          cur = cur.slice(0, -1);
          render();
        }
      };
      window.wE = function() {
        if(done) return;
        if(cur.length < 5) {
          showMsg('Too short!','#ff006e');
          return;
        }
        guesses.push(cur);
        cur = '';
        if(guesses[guesses.length-1] === secret) {
          done = true;
          setScore((7 - guesses.length) * 100);
          render();
          showMsg('Brilliant! '+secret, '#00ffcc');
        } else if(guesses.length === 6) {
          done = true;
          render();
          showMsg('Answer: '+secret, '#ff006e');
        } else {
          render();
        }
      };
      function onKey(e) {
        if(e.ctrlKey || e.altKey || e.metaKey) return;
        if(e.key === 'Backspace') window.wD();
        else if(e.key === 'Enter') window.wE();
        else if(e.key.length === 1 && /[a-zA-Z]/.test(e.key)) window.wT(e.key.toUpperCase());
      }
      document.addEventListener('keydown', onKey);
      init();
      addBtn('NEW GAME', init, 'p');
      setCtrl('Green = right spot | Yellow = wrong spot | Click letters or use keyboard');
      cleanup = function() {
        document.removeEventListener('keydown', onKey);
        delete window.wT;
        delete window.wD;
        delete window.wE;
      };
    }

    // DINO RUN
    function launchDino() {
      var cv = mkCv(460,230), ctx = cv.getContext('2d');
      var dino, cacti, score, alive, raf, frame, spd;
      function init() {
        dino = {x:65, y:172, vy:0, ground:true, w:26, h:36};
        cacti = [];
        score = 0;
        alive = true;
        frame = 0;
        spd = 3;
        setScore(0);
      }
      function jump() {
        if(dino.ground && alive) {
          dino.vy = -12;
          dino.ground = false;
        }
      }
      cv.addEventListener('click', function() {
        if(!alive) init();
        else jump();
      });
      function onKey(e) {
        if(e.code === 'Space') {
          e.preventDefault();
          if(!alive) init();
          else jump();
        }
      }
      document.addEventListener('keydown', onKey);
      function draw() {
        ctx.fillStyle = '#000e1e';
        ctx.fillRect(0,0,460,230);
        ctx.strokeStyle = 'rgba(0,255,204,.25)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0,210);
        ctx.lineTo(460,210);
        ctx.stroke();
        ctx.fillStyle = '#00ffcc';
        ctx.shadowColor = '#00ffcc';
        ctx.shadowBlur = 8;
        ctx.fillRect(dino.x, dino.y, dino.w, dino.h);
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#000';
        ctx.fillRect(dino.x+16, dino.y+5, 6, 6);
        ctx.fillStyle = '#fff';
        ctx.fillRect(dino.x+18, dino.y+7, 3, 3);
        var leg = dino.ground ? (Math.floor(frame/5)%2===0 ? 4 : 0) : 0;
        ctx.fillStyle = '#00cc88';
        ctx.fillRect(dino.x+4, dino.y+dino.h, 7, 8+leg);
        ctx.fillRect(dino.x+14, dino.y+dino.h, 7, 8+(8-leg));
        cacti.forEach(function(ca) {
          ctx.fillStyle = '#ff006e';
          ctx.shadowColor = '#ff006e';
          ctx.shadowBlur = 6;
          ctx.fillRect(ca.x, ca.y, 18, ca.h);
          ctx.fillRect(ca.x-6, ca.y+14, 6, ca.h-14);
          ctx.fillRect(ca.x+18, ca.y+14, 6, ca.h-14);
          ctx.shadowBlur = 0;
        });
        ctx.fillStyle = 'rgba(255,255,255,.7)';
        ctx.font = '13px Orbitron';
        ctx.textAlign = 'right';
        ctx.fillText(Math.floor(score), 450, 25);
        if(!alive) {
          ctx.fillStyle = 'rgba(0,0,0,.75)';
          ctx.fillRect(0,0,460,230);
          ctx.fillStyle = '#ff006e';
          ctx.font = 'bold 24px Orbitron';
          ctx.textAlign = 'center';
          ctx.fillText('GAME OVER', 230, 100);
          ctx.fillStyle = '#fff';
          ctx.font = '13px Orbitron';
          ctx.fillText('Score: '+Math.floor(score), 230, 132);
          ctx.fillText('Click or Space to restart', 230, 162);
        }
      }
      function update() {
        if(!alive) return;
        frame++;
        score += 0.12;
        spd = 3 + score/180;
        setScore(Math.floor(score));
        dino.y += dino.vy;
        dino.vy += 0.65;
        if(dino.y >= 172) {
          dino.y = 172;
          dino.vy = 0;
          dino.ground = true;
        }
        var intv = Math.max(48, 82 - Math.floor(score/40));
        if(frame % intv === 0) {
          cacti.push({x:465, y:168, h:42});
        }
        for(var i=cacti.length-1; i>=0; i--) {
          cacti[i].x -= spd;
          if(dino.x+dino.w-6 > cacti[i].x+4 && dino.x+6 < cacti[i].x+18 && dino.y+dino.h-4 > cacti[i].y) {
            alive = false;
            setScore(Math.floor(score));
          }
          if(cacti[i].x < -30) cacti.splice(i,1);
        }
      }
      init();
      function loop() {
        draw();
        update();
        raf = requestAnimationFrame(loop);
      }
      loop();
      setCtrl('Click or Space to jump &nbsp; Avoid the cacti &nbsp; Speed increases over time!');
      cleanup = function() {
        cancelAnimationFrame(raf);
        document.removeEventListener('keydown', onKey);
      };
    }

    // TETRIS
    function launchTetris() {
      var cv = mkCv(240,480), ctx = cv.getContext('2d');
      var W = 10, H = 20, SZ = 24;
      var SHP = [
        {s:[[1,1,1,1]], c:'#00ffcc'},
        {s:[[1,1],[1,1]], c:'#ffcc00'},
        {s:[[0,1,0],[1,1,1]], c:'#7c00ff'},
        {s:[[1,0,0],[1,1,1]], c:'#ff8800'},
        {s:[[0,0,1],[1,1,1]], c:'#0088ff'},
        {s:[[1,1,0],[0,1,1]], c:'#ff006e'},
        {s:[[0,1,1],[1,1,0]], c:'#00ff88'}
      ];
      var grid, piece, score, lines, level, alive, raf, lastT;
      function init() {
        grid = [];
        for(var i=0;i<H;i++) grid.push(Array(W).fill(0));
        score = 0;
        lines = 0;
        level = 1;
        alive = true;
        setScore(0);
        lastT = 0;
        spawn();
      }
      function rndP() {
        var p = SHP[Math.floor(Math.random() * SHP.length)];
        return {
          s: p.s.map(function(r){ return r.slice(); }),
          c: p.c,
          x: 3,
          y: 0
        };
      }
      function spawn() {
        piece = rndP();
        if(!valid(piece, 0, 0)) alive = false;
      }
      function valid(p, ox, oy) {
        return p.s.every(function(row, dr) {
          return row.every(function(v, dc) {
            if(!v) return true;
            var nx = p.x + dc + ox;
            var ny = p.y + dr + oy;
            return nx >= 0 && nx < W && ny < H && !grid[ny][nx];
          });
        });
      }
      function lock() {
        piece.s.forEach(function(row, dr) {
          row.forEach(function(v, dc) {
            if(v) grid[piece.y+dr][piece.x+dc] = piece.c;
          });
        });
        var cl = 0;
        for(var r=H-1; r>=0; r--) {
          if(grid[r].every(function(c){ return c; })) {
            grid.splice(r,1);
            grid.unshift(Array(W).fill(0));
            cl++;
            r++;
          }
        }
        if(cl) {
          lines += cl;
          score += cl * 100 * level;
          level = Math.floor(lines/10) + 1;
          setScore(score);
        }
        spawn();
      }
      function rot(s) {
        var r = [];
        for(var i=0;i<s[0].length;i++) {
          r.push([]);
          for(var j=s.length-1;j>=0;j--) r[i].push(s[j][i]);
        }
        return r;
      }
      function draw() {
        ctx.fillStyle = '#04040f';
        ctx.fillRect(0,0,240,480);
        ctx.strokeStyle = 'rgba(255,255,255,.03)';
        ctx.lineWidth = 1;
        for(var i=0;i<=W;i++) {
          ctx.beginPath();
          ctx.moveTo(i*SZ,0);
          ctx.lineTo(i*SZ, H*SZ);
          ctx.stroke();
        }
        for(var j=0;j<=H;j++) {
          ctx.beginPath();
          ctx.moveTo(0,j*SZ);
          ctx.lineTo(W*SZ, j*SZ);
          ctx.stroke();
        }
        grid.forEach(function(row,r) {
          row.forEach(function(v,c) {
            if(!v) return;
            ctx.fillStyle = v;
            ctx.shadowColor = v;
            ctx.shadowBlur = 4;
            ctx.fillRect(c*SZ+1, r*SZ+1, SZ-2, SZ-2);
            ctx.fillStyle = 'rgba(255,255,255,.2)';
            ctx.fillRect(c*SZ+1, r*SZ+1, SZ-2, 4);
            ctx.shadowBlur = 0;
          });
        });
        if(!alive) {
          ctx.fillStyle = 'rgba(0,0,0,.82)';
          ctx.fillRect(0,0,240,480);
          ctx.fillStyle = '#ff006e';
          ctx.font = 'bold 18px Orbitron';
          ctx.textAlign = 'center';
          ctx.fillText('GAME OVER',120,226);
          ctx.fillStyle = '#fff';
          ctx.font = '12px Orbitron';
          ctx.fillText('Score: '+score,120,258);
          ctx.fillText('Press R',120,288);
          return;
        }
        var gy = piece.y;
        while(valid(piece, 0, gy-piece.y+1)) gy++;
        piece.s.forEach(function(row,dr) {
          row.forEach(function(v,dc) {
            if(!v) return;
            ctx.fillStyle = 'rgba(255,255,255,.08)';
            ctx.fillRect((piece.x+dc)*SZ+1, (gy+dr)*SZ+1, SZ-2, SZ-2);
          });
        });
        piece.s.forEach(function(row,dr) {
          row.forEach(function(v,dc) {
            if(!v) return;
            ctx.fillStyle = piece.c;
            ctx.shadowColor = piece.c;
            ctx.shadowBlur = 5;
            ctx.fillRect((piece.x+dc)*SZ+1, (piece.y+dr)*SZ+1, SZ-2, SZ-2);
            ctx.shadowBlur = 0;
          });
        });
      }
      function onKey(e) {
        if(!alive) {
          if(e.key === 'r' || e.key === 'R') init();
          return;
        }
        if(e.key === 'ArrowLeft' && valid(piece, -1, 0)) piece.x--;
        else if(e.key === 'ArrowRight' && valid(piece, 1, 0)) piece.x++;
        else if(e.key === 'ArrowDown' && valid(piece, 0, 1)) piece.y++;
        else if(e.key === 'ArrowUp') {
          var nr = rot(piece.s);
          if(valid({s:nr, c:piece.c, x:piece.x, y:piece.y}, 0, 0)) piece.s = nr;
        }
        else if(e.key === ' ') {
          var d = 0;
          while(valid(piece, 0, d+1)) d++;
          piece.y += d;
          lock();
        }
        if(['ArrowLeft','ArrowRight','ArrowDown','ArrowUp',' '].indexOf(e.key) >= 0) e.preventDefault();
      }
      document.addEventListener('keydown', onKey);
      init();
      function loop(ts) {
        var spd = Math.max(80, 500 - level*40);
        if(ts - lastT > spd) {
          lastT = ts;
          if(valid(piece, 0, 1)) piece.y++;
          else lock();
        }
        draw();
        raf = requestAnimationFrame(loop);
      }
      raf = requestAnimationFrame(loop);
      addBtn('RESTART', function(){ init(); }, 'p');
      setCtrl('Arrows = move/rotate | Space = hard drop | R = restart');
      cleanup = function() {
        cancelAnimationFrame(raf);
        document.removeEventListener('keydown', onKey);
      };
    }

    // TRIVIA QUIZ
    function launchQuiz() {
      var QS = [
        {q:'What does CPU stand for?', a:0, o:['Central Processing Unit','Computer Power Unit','Central Power Usage','Core Processing Unit']},
        {q:'Who created Python programming language?', a:0, o:['Guido van Rossum','Linus Torvalds','Dennis Ritchie','James Gosling']},
        {q:'Binary representation of the number 10?', a:0, o:['1010','1100','1001','0110']},
        {q:'Which is NOT a JavaScript framework?', a:0, o:['Django','React','Vue','Angular']},
        {q:'HTML stands for?', a:0, o:['HyperText Markup Language','High Tech Modern Language','HyperTransfer Markup Language','Hyper Text Media Language']},
        {q:'Who co-founded Apple Computer?', a:0, o:['Steve Jobs','Bill Gates','Elon Musk','Mark Zuckerberg']},
        {q:'ARPANET (Internet ancestor) launched in?', a:0, o:['1969','1975','1983','1991']},
        {q:'RAM stands for?', a:0, o:['Random Access Memory','Read And Memory','Rapid Access Module','Real Array Memory']},
        {q:'Which language runs natively in browsers?', a:0, o:['JavaScript','Python','Java','C++']},
        {q:'Largest planet in the solar system?', a:0, o:['Jupiter','Saturn','Neptune','Uranus']},
      ];
      var shuffled = QS.map(function(q) {
        var opts = q.o.slice();
        var correct = opts[0];
        opts.sort(function(){ return Math.random() - 0.5; });
        return {q:q.q, correct:correct, opts:opts};
      });
      var idx, score, chosen;
      function init() {
        idx = 0;
        score = 0;
        chosen = null;
        setScore(0);
        render();
      }
      function render() {
        if(idx >= shuffled.length) {
          document.getElementById('gcw').innerHTML = '<div style="text-align:center;font-family:Orbitron,monospace;padding:24px;">' +
            '<div style="font-size:3.5rem;margin-bottom:16px;">' + (score>=8?'🏆':score>=5?'🥈':'🥉') + '</div>' +
            '<div style="font-size:1.3rem;color:#00ffcc;margin-bottom:8px;">' + score + '/10 Correct</div>' +
            '<div style="color:#4a5580;font-size:.75rem;">Score: ' + score*100 + '</div></div>';
          setScore(score*100);
          return;
        }
        var q = shuffled[idx];
        document.getElementById('gcw').innerHTML = '<div style="width:460px;max-width:92vw;">' +
          '<div style="font-size:.6rem;font-family:Orbitron,monospace;color:#4a5580;letter-spacing:2px;margin-bottom:10px;">QUESTION '+(idx+1)+'/10</div>' +
          '<div style="background:rgba(0,255,204,.04);border:1px solid rgba(0,255,204,.12);border-radius:10px;padding:18px;margin-bottom:14px;font-size:1rem;line-height:1.5;color:#e0eaff;">'+q.q+'</div>' +
          '<div id="qopts" style="display:flex;flex-direction:column;gap:9px;"></div>' +
          '<div id="qnext" style="text-align:center;margin-top:14px;"></div></div>';
        var qopts = document.getElementById('qopts');
        q.opts.forEach(function(opt,i) {
          var d = document.createElement('div');
          var isCorrect = opt === q.correct;
          var isChosen = opt === chosen;
          var bg = 'rgba(255,255,255,.03)', bord = '#1a2540', col = '#e0eaff';
          if(chosen !== null) {
            if(isCorrect) {
              bg = 'rgba(0,200,80,.12)';
              bord = '#00cc50';
              col = '#00ee60';
            } else if(isChosen) {
              bg = 'rgba(255,0,110,.12)';
              bord = '#ff006e';
              col = '#ff4488';
            }
          }
          d.style.cssText = 'padding:13px 16px;background:'+bg+';border:1px solid '+bord+';border-radius:8px;cursor:'+(chosen===null?'pointer':'default')+';color:'+col+';font-size:.92rem;display:flex;gap:10px;align-items:center;transition:all .15s;';
          d.innerHTML = '<span style="font-family:Orbitron,monospace;font-size:.65rem;color:#4a5580;">'+String.fromCharCode(65+i)+'</span>'+opt;
          if(chosen === null) {
            d.onclick = function() {
              chosen = opt;
              if(isCorrect) {
                score++;
                setScore(score*100);
              }
              render();
            };
          }
          qopts.appendChild(d);
        });
        if(chosen !== null) {
          var nb = document.createElement('button');
          nb.style.cssText = 'background:#00ffcc;color:#000;border:none;padding:10px 26px;font-family:Orbitron,monospace;font-size:.72rem;border-radius:4px;cursor:pointer;letter-spacing:2px;';
          nb.textContent = idx < shuffled.length-1 ? 'NEXT' : 'FINISH';
          nb.onclick = function() {
            idx++;
            chosen = null;
            render();
          };
          document.getElementById('qnext').appendChild(nb);
        }
      }
      init();
      setCtrl('Select the correct answer &nbsp; 10 questions total');
      cleanup = function(){};
    }

    // BALL SHOOT
    function launchBallShoot() {
      var cv = mkCv(400,460), ctx = cv.getContext('2d');
      var TCOLS = ['#ff006e','#00ffcc','#ffcc00','#7c00ff','#ff8800'];
      var targets, ball, angle, shots, score, raf;
      function init() {
        targets = [];
        score = 0;
        shots = 7;
        ball = null;
        angle = Math.PI/2;
        setScore(0);
        for(var i=0;i<14;i++) {
          targets.push({
            x: 40+Math.random()*320,
            y: 40+Math.random()*200,
            r: 16,
            vx: (Math.random()-0.5)*2.2,
            vy: (Math.random()-0.5)*1.6,
            col: TCOLS[Math.floor(Math.random()*TCOLS.length)]
          });
        }
      }
      var mx = 200, my = 430;
      function onMouseMove(e) {
        var r = cv.getBoundingClientRect();
        mx = e.clientX - r.left;
        my = e.clientY - r.top;
        var dx = mx - 200, dy = 430 - my;
        angle = Math.max(0.15, Math.min(Math.PI-0.15, Math.atan2(dy, dx)));
      }
      function shoot() {
        if(shots <= 0 || ball) return;
        ball = {x:200, y:420, vx:Math.cos(Math.PI-angle)*9.5, vy:-Math.sin(angle)*9.5, r:9};
        shots--;
      }
      cv.addEventListener('mousemove', onMouseMove);
      cv.addEventListener('click', function() {
        if((shots===0 && !ball) || targets.length===0) init();
        else shoot();
      });
      function draw() {
        ctx.fillStyle = '#04040f';
        ctx.fillRect(0,0,400,460);
        ctx.strokeStyle = 'rgba(0,255,204,.18)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5,7]);
        ctx.beginPath();
        ctx.moveTo(200,430);
        ctx.lineTo(200 + Math.cos(Math.PI-angle)*170, 430 - Math.sin(angle)*170);
        ctx.stroke();
        ctx.setLineDash([]);
        targets.forEach(function(t) {
          ctx.beginPath();
          ctx.arc(t.x, t.y, t.r, 0, 6.28);
          ctx.fillStyle = t.col;
          ctx.shadowColor = t.col;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.strokeStyle = 'rgba(255,255,255,.3)';
          ctx.lineWidth = 2;
          ctx.stroke();
        });
        if(ball) {
          ctx.beginPath();
          ctx.arc(ball.x, ball.y, ball.r, 0, 6.28);
          ctx.fillStyle = '#fff';
          ctx.shadowColor = '#fff';
          ctx.shadowBlur = 18;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
        ctx.save();
        ctx.translate(200,432);
        ctx.rotate(-angle + Math.PI/2);
        ctx.fillStyle = '#00ffcc';
        ctx.shadowColor = '#00ffcc';
        ctx.shadowBlur = 8;
        ctx.fillRect(-7, -32, 14, 32);
        ctx.shadowBlur = 0;
        ctx.restore();
        ctx.beginPath();
        ctx.arc(200,432,14,0,6.28);
        ctx.fillStyle = '#00aa99';
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.7)';
        ctx.font = '13px Orbitron';
        ctx.textAlign = 'left';
        ctx.fillText('SHOTS: '+shots, 10, 28);
        ctx.textAlign = 'right';
        ctx.fillText('SCORE: '+score, 390, 28);
        var over = (shots===0 && !ball && targets.length>0);
        var win = targets.length===0;
        if(over || win) {
          ctx.fillStyle = 'rgba(0,0,0,.78)';
          ctx.fillRect(0,0,400,460);
          ctx.fillStyle = win ? '#00ffcc' : '#ffcc00';
          ctx.font = 'bold 24px Orbitron';
          ctx.textAlign = 'center';
          ctx.fillText(win ? 'ALL CLEAR!' : 'OUT OF SHOTS', 200, 210);
          ctx.fillStyle = '#fff';
          ctx.font = '14px Orbitron';
          ctx.fillText('Score: '+score, 200, 250);
          ctx.fillText('Click to play again', 200, 288);
        }
      }
      function update() {
        targets.forEach(function(t) {
          t.x += t.vx;
          t.y += t.vy;
          if(t.x < t.r || t.x > 400-t.r) t.vx *= -1;
          if(t.y < t.r || t.y > 260-t.r) t.vy *= -1;
        });
        if(!ball) return;
        ball.x += ball.vx;
        ball.y += ball.vy;
        if(ball.x < ball.r || ball.x > 400-ball.r) ball.vx *= -1;
        if(ball.y < 0 || ball.y > 470) ball = null;
        if(!ball) return;
        for(var i=targets.length-1; i>=0; i--) {
          var t = targets[i];
          var dx = ball.x - t.x, dy = ball.y - t.y;
          if(Math.sqrt(dx*dx + dy*dy) < t.r + ball.r) {
            targets.splice(i,1);
            score += 15;
            setScore(score);
          }
        }
      }
      init();
      function loop() {
        draw();
        update();
        raf = requestAnimationFrame(loop);
      }
      loop();
      setCtrl('Move mouse to aim &nbsp; Click to fire &nbsp; 7 shots per round');
      cleanup = function() { cancelAnimationFrame(raf); };
    }

    // launcher mapping
    var LAUNCHERS = {
      snake: launchSnake,
      breakout: launchBreakout,
      tictac: launchTicTac,
      flappy: launchFlappy,
      memory: launchMemory,
      pong: launchPong,
      g2048: launch2048,
      mines: launchMinesweeper,
      typing: launchTyping,
      simon: launchSimon,
      wordle: launchWordle,
      dino: launchDino,
      tetris: launchTetris,
      quiz: launchQuiz,
      ballshot: launchBallShoot
    };
// =======================
// EXTRA GAMES
// =======================

GAMES.push(
  {
    id: "basketrandom",
    name: "BASKET RANDOM",
    emoji: "🏀",
    desc: "Physics basketball chaos!",
    tag: "sports",
    tc: "t-action",
    pc: "p16"
  },
  {
    id: "slope",
    name: "SLOPE",
    emoji: "🟢",
    desc: "Race down endless neon slopes!",
    tag: "action",
    tc: "t-action",
    pc: "p17"
  },
  {
    id: "stickhook",
    name: "STICKMAN HOOK",
    emoji: "🪝",
    desc: "Swing through obstacles with hooks!",
    tag: "action",
    tc: "t-action",
    pc: "p18"
  },
  {
    id: "slither",
    name: "SLITHER.IO",
    emoji: "🐍",
    desc: "Eat pellets and grow bigger!",
    tag: "arcade",
    tc: "t-arcade",
    pc: "p19"
  },
  {
    id: "cookieclicker",
    name: "COOKIE CLICKER",
    emoji: "🍪",
    desc: "Click cookies and buy upgrades!",
    tag: "classic",
    tc: "t-classic",
    pc: "p20"
  }
);

// =======================
// BASKET RANDOM
// =======================

function launchBasketRandom() {
  document.getElementById("gcw").innerHTML =
    '<div style="padding:40px;font-family:Orbitron;text-align:center;font-size:2rem;">🏀 Basket Random Added</div>';

  setScore(0);
  cleanup = function(){};
}

// =======================
// SLOPE
// =======================

function launchSlope() {
  document.getElementById("gcw").innerHTML =
    '<div style="padding:40px;font-family:Orbitron;text-align:center;font-size:2rem;">🟢 Slope Added</div>';

  setScore(0);
  cleanup = function(){};
}

// =======================
// STICKMAN HOOK
// =======================

function launchStickHook() {
  document.getElementById("gcw").innerHTML =
    '<div style="padding:40px;font-family:Orbitron;text-align:center;font-size:2rem;">🪝 Stickman Hook Added</div>';

  setScore(0);
  cleanup = function(){};
}

// =======================
// SLITHER.IO
// =======================

function launchSlither() {
  document.getElementById("gcw").innerHTML =
    '<div style="padding:40px;font-family:Orbitron;text-align:center;font-size:2rem;">🐍 Slither.io Added</div>';

  setScore(0);
  cleanup = function(){};
}

// =======================
// COOKIE CLICKER
// =======================

function launchCookieClicker() {

  let cookies = 0;

  function render() {

    document.getElementById("gcw").innerHTML =
      '<div style="text-align:center;">' +
      '<div id="cookieBtn" style="font-size:7rem;cursor:pointer;">🍪</div>' +
      '<div style="font-family:Orbitron;font-size:1.2rem;">Cookies: ' +
      cookies +
      "</div>" +
      "</div>";

    document.getElementById("cookieBtn").onclick = function() {
      cookies++;
      setScore(cookies);
      render();
    };
  }

  render();

  cleanup = function(){};
}

// =======================
// ADD TO LAUNCHERS
// =======================

LAUNCHERS.basketrandom = launchBasketRandom;
LAUNCHERS.slope = launchSlope;
LAUNCHERS.stickhook = launchStickHook;
LAUNCHERS.slither = launchSlither;
LAUNCHERS.cookieclicker = launchCookieClicker;
