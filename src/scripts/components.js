
const Game = {
    Keys: {
        left: false,
        right: false,
        up: false,
        down: false,
        activeObject: {},
        events() {
            $('body').keydown(function(event) {
                if (event.which === 37) {
                    Game.Keys.left = true;
                }
                if (event.which === 38) {
                    Game.Keys.up = true;
                }
                if (event.which === 39) {
                    Game.Keys.right = true;
                }
                if (event.which === 40) {
                    Game.Keys.down = true;
                }
            });
            $('body').keyup(function(event) {
                if (event.which === 37) { //
                    Game.Keys.left = false;
                }
                if (event.which === 38) { //
                    Game.Keys.up = false;
                }
                if (event.which === 39) { //
                    Game.Keys.right = false;
                }
                if (event.which === 40) { //
                    Game.Keys.down = false;
                }
            });
        },
    },
    Player: {
        element: {},
        loaded: false,
        speed: 1,
        maxSpeed: 5,
        jumpPower: 10,
        friction: 0.5,
        grounded: true,
        position: {
            x: 20,
            y: 0
        },
        vectors: {
            x: 0,
            y: 0,
        },
        animations: {
            idle: {
                sprites: [
                    '/img/player/stand1.png', 
                    '/img/player/stand2.png', 
                    '/img/player/stand3.png', 
                    '/img/player/stand4.png'
                ],
                counter: 0,
                animationSpeed: 0.1,
                start() {
                    if (Game.Player.grounded && !Game.Keys.right && !Game.Keys.left) {
                        Game.Player.element.css('background-image', `url(${this.sprites[Math.floor(this.counter)]})`);
                        // Zmieniamy inkrementację o prędkość animacji
                        this.counter += this.animationSpeed;
                        // Sprawdzamy, czy przekroczyliśmy ilość klatek animacji
                        if (this.counter >= this.sprites.length) this.counter = 0;
                    }
                }
            },
            run: {
                sprites: [
                    '/img/player/run1.png', 
                    '/img/player/run2.png', 
                    '/img/player/run3.png', 
                    '/img/player/run4.png',
                    '/img/player/run5.png', 
                    '/img/player/run6.png', 
                    '/img/player/run7.png', 
                    '/img/player/run8.png'
                ],
                counter: 0,
                animationSpeed: 0.2,
                start() {
                    if (Game.Player.grounded && Game.Keys.right) {
                        Game.Player.element.css('transform', 'scaleX(1)')
                        Game.Player.element.css('background-image', `url(${this.sprites[Math.floor(this.counter)]})`);
                        this.counter += this.animationSpeed;
                        // Sprawdzamy, czy przekroczyliśmy ilość klatek animacji
                        if (this.counter >= this.sprites.length) this.counter = 0;
                    }
                    else if (Game.Player.grounded && Game.Keys.left) {
                        Game.Player.element.css('transform', 'scaleX(-1)')
                        Game.Player.element.css('background-image', `url(${this.sprites[Math.floor(this.counter)]})`);
                        this.counter += this.animationSpeed;
                        // Sprawdzamy, czy przekroczyliśmy ilość klatek animacji
                        if (this.counter >= this.sprites.length) this.counter = 0;
                    }
                }
            },
            jump: {
                sprites: [
                    '/img/player/jump1.png', 
                    '/img/player/jump2.png', 
                    '/img/player/jump3.png', 
                    '/img/player/jump4.png',
                ],
                counter: 0,
                animationSpeed: 0.2,
                start() {


                    if (!Game.Player.grounded && Game.Player.vectors.y > 0) {
                        Game.Player.element.css('background-image', `url(${this.sprites[Math.floor(this.counter)]})`);

                        if (this.counter < 2) {
                            this.counter += this.animationSpeed;
                        }
                        if (this.counter >= 2) {
                            this.counter = 0;
                        }
                    }
                    else if (!Game.Player.grounded && Game.Player.vectors.y >= -7 && Game.Player.vectors.y <= 5) {
                        Game.Player.element.css('background-image', `url(${this.sprites[Math.floor(2)]})`);

                    }
                    else if (!Game.Player.grounded && Game.Player.vectors.y < 0) {
                        Game.Player.element.css('background-image', `url(${this.sprites[Math.floor(3)]})`);

                    }
                }
            },

            animate() {
                this.idle.start();
                this.run.start();
                this.jump.start();
            },
            //załaduj obrazy przed startem animacji
            preload() {
                this.idle.sprites.forEach(url => {
                    const img = new Image();
                    img.src = url;
                });
                this.run.sprites.forEach(url => {
                    const img = new Image();
                    img.src = url;
                });
                this.jump.sprites.forEach(url => {
                    const img = new Image();
                    img.src = url;
                });
            }
        },
        
        
        init() {
            Game.Keys.activeObject = 'player';
            this.element = $('#player');
            this.element.css('left', `${this.position.x}px`);
            this.element.css('bottom', `${this.position.y}px`);
            this.loaded = true;
        },
        update() {
            this.element.css('left', `${this.position.x}px`);
            this.element.css('bottom', `${this.position.y}px`);

            if (Game.Keys.activeObject == 'player' && Game.Keys.left && (this.vectors.x > -this.maxSpeed)) {
                this.vectors.x -= this.speed;
            }
            else if (Game.Keys.activeObject == 'player' && Game.Keys.right && (this.vectors.x < this.maxSpeed)) {
                this.vectors.x += this.speed;
            }
            if (Game.Keys.activeObject == 'player' && Game.Keys.up && Game.Player.grounded) {
                Game.Player.grounded = false
                this.vectors.y += this.jumpPower;
            }

            /* uwzględnij tarcie zmniejszające wektor ruchu*/
            if (this.vectors.x > 0) {
                this.vectors.x -= this.friction;
            }
            else if (this.vectors.x < 0) {
                this.vectors.x += this.friction;
            }

            this.move();
            this.animations.animate();
        },
        move() {
            this.position.x += this.vectors.x;
            this.position.y += this.vectors.y;
        }
    },
    Navigation: {
        events() {
            $('body').on('click', 'nav #nav-zoom-out', function(e) {
                Game.Window.scale.subtract(0.2);
            });
            $('body').on('click', 'nav #nav-zoom-in', function(e) {
                Game.Window.scale.add(0.2);
            });
        }
    },
    Physics: {
        Gravity: {
            value: 0.5,
            calculate() {
                if (Game.Player.loaded && (Game.Player.position.y > 0)) {
                    Game.Player.vectors.y -= this.value; 
                }
                else {
                    Game.Player.position.y = 0;
                    Game.Player.grounded = true;
                }
            }
        }
    },
    Window: {
        width: 640,
        height: 480,
        element: {},
        scale: {
            value: 1.5,
            add(num) {
                this.value += num;
                this.updateScale();
            },
            subtract(num) {
                this.value -= num;
                this.updateScale();
            },
            setScale(num) {
                this.value = num;
                this.updateScale();
            },
            updateScale() {
                Game.Window.element.css('scale', this.value.toString());
                console.log(this.value);
            }
        },
        init() {
            Game.Player.animations.preload();
            Game.Keys.events();
            this.element = $('#game-window');
            this.element.css('width', `${this.width}px`)
            this.element.css('height', `${this.height}px`)
            this.scale.setScale(this.scale.value);
            Game.Player.init();
            Game.loop();
        }
    },
    loop() {
        console.log('frames');
        Game.Player.update();
        Game.Physics.Gravity.calculate();
        requestAnimationFrame(Game.loop.bind(this));
    }
};