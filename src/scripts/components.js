
const Game = {
    Keys: {
        left: false,
        right: false,
        up: false,
        down: false,
        A: false,
        S: false,
        D: false,
        Z: false,
        X: false,
        C: false,
        activeObject: {},
        events() {
            $('body').keydown(function(event) {
                if (event.which === 37) Game.Keys.left = true;
                if (event.which === 38) Game.Keys.up = true;
                if (event.which === 39) Game.Keys.right = true;
                if (event.which === 40) Game.Keys.down = true;
                if (event.which === 65) Game.Keys.A = true;
                if (event.which === 83) Game.Keys.S = true;
                if (event.which === 68) Game.Keys.D = true;
                if (event.which === 90) Game.Keys.Z = true;
                if (event.which === 88) Game.Keys.X = true;
                if (event.which === 67) Game.Keys.C = true;
            });
            $('body').keyup(function(event) {
                if (event.which === 37) Game.Keys.left = false;
                if (event.which === 38) Game.Keys.up = false;
                if (event.which === 39) Game.Keys.right = false;
                if (event.which === 40) Game.Keys.down = false;
                if (event.which === 65) Game.Keys.A = false;
                if (event.which === 83) Game.Keys.S = false;
                if (event.which === 68) Game.Keys.D = false;
                if (event.which === 90) Game.Keys.Z = false;
                if (event.which === 88) Game.Keys.X = false;
                if (event.which === 67) Game.Keys.C = false;
            });
        },
    },
    Player: {
        element: {},
        aura: {},
        hp: 100,
        power: 0,
        loaded: false,
        speed: 1,
        maxSpeed: 5,
        jumpPower: 10,
        friction: 0.5,
        grounded: true,
        crouched: false,
        guarded: false,
        guardedReleased: false,
        powerUping: false,
        position: {
            x: 20,
            y: 0
        },
        vectors: {
            x: 0,
            y: 0,
        },
        fx: {
            whiteAura: {
                sprites: [
                    'img/fx/aura1.png',
                    'img/fx/aura2.png',
                    'img/fx/aura3.png',
                    'img/fx/aura4.png'
                ],
                counter: 0,
                animationSpeed: 0.15,
                loop() {
                    Game.Player.aura.css('background-image', `url(${this.sprites[Math.floor(this.counter)]})`);
                    this.counter += this.animationSpeed;
                    if (this.counter >= this.sprites.length) this.counter = 0;
                },
                stop() {
                    Game.Player.aura.css('background-image', 'none');
                    this.counter = 0;
                }
            }
        },
        animations: {
            idle: {
                sprites: [
                    'img/player/stand1.png', 
                    'img/player/stand2.png', 
                    'img/player/stand3.png', 
                    'img/player/stand4.png'
                ],
                counter: 0,
                animationSpeed: 0.1,
                start() {
                    if (Game.Player.grounded && !Game.Player.crouched && !Game.Keys.right && !Game.Keys.left) {
                        Game.Player.element.css('background-image', `url(${this.sprites[Math.floor(this.counter)]})`);
                        // Zmieniamy inkrementację o prędkość animacji
                        this.counter += this.animationSpeed;
                        // Sprawdzamy, czy przekroczyliśmy ilość klatek animacji
                        if (this.counter >= this.sprites.length) this.counter = 0;
                    }
                }
            },
            crouch: {
                sprites: [
                    'img/player/crouch1.png', 
                    'img/player/crouch2.png', 
                    'img/player/crouch3.png', 
                ],
                counter: 0,
                animationSpeed: 0.3,
                start() {
                    if (Game.Player.grounded) {
                        if (!Game.Player.crouched && Game.Keys.down) {
                            Game.Player.element.css('background-image', `url(${this.sprites[Math.floor(this.counter)]})`);
                            if (this.counter < 1) {
                                this.counter += this.animationSpeed;
                            }
                            else if (this.counter >= 1) {
                                Game.Player.crouched = true;
                            }
                        }
                        
                        if (Game.Player.crouched && Game.Keys.down) {
                            this.counter = 1;
                            Game.Player.element.css('background-image', `url(${this.sprites[Math.floor(this.counter)]})`);
                        }
                        
                        else if (Game.Player.crouched) {
                            if (this.counter <= 3) {
                                Game.Player.element.css('background-image', `url(${this.sprites[Math.floor(this.counter)]})`);
                                this.counter += this.animationSpeed;
                            }
                            else {
                                this.counter = 0;
                                Game.Player.crouched = false;
                            }
                        }
                    }
                }
            },
            guard: {
                sprites: [
                    'img/player/guard1.png', 
                    'img/player/guard2.png', 
                    'img/player/guard3.png', 
                ],
                counter: 0,
                animationSpeed: 0.3,
                start() {
                    if (Game.Player.grounded) {
                        if (!Game.Player.guarded && Game.Keys.D) {
                            Game.Player.element.css('background-image', `url(${this.sprites[Math.floor(this.counter)]})`);
                            if (this.counter < 1) {
                                this.counter += this.animationSpeed;
                            }
                            else if (this.counter >= 1) {
                                Game.Player.guarded = true;
                            }
                        }
                        if (Game.Player.guarded && Game.Keys.D) {
                            this.counter = 1;
                            Game.Player.element.css('background-image', `url(${this.sprites[Math.floor(this.counter)]})`);
                            Game.Player.guardedReleased = true;
                        }
                        
                        else if (Game.Player.guardedReleased) {
                            if (this.counter <= 3) {
                                Game.Player.element.css('background-image', `url(${this.sprites[Math.floor(this.counter)]})`);
                                this.counter += this.animationSpeed;
                            }
                            else {
                                this.counter = 0;
                                Game.Player.guarded = false;
                                Game.Player.guardedReleased = false;
                            }
                        }
                    }
                }
            },
            powerUp: {
                sprites: [
                    'img/player/powerup0.png', 
                    'img/player/powerup1.png', 
                    'img/player/powerup2.png',
                    'img/player/powerup3.png',
                    'img/player/powerup4.png',
                    'img/player/powerup5.png',
                    'img/player/powerup6.png'
                ],
                counter: 0,
                animationSpeed: 0.15,
                start() {
                    if (Game.Player.grounded && !Game.Player.crouched && !Game.Player.guarded) {
                        if (!Game.Player.powerUping && Game.Keys.C) {
                            Game.Player.element.css('background-image', `url(${this.sprites[Math.floor(this.counter)]})`);
                            if (this.counter < 3) {
                                this.counter += this.animationSpeed;
                            }
                            else if (this.counter >= 3) {
                                Game.Player.powerUping = true;
                            }
                        }
                        
                        if (Game.Player.powerUping && Game.Keys.C) {
                            Game.Player.element.css('background-image', `url(${this.sprites[Math.floor(this.counter)]})`);
                            console.log(this.counter);
                            if (this.counter <= 7) {
                                this.counter += this.animationSpeed;
                            }

                            if (this.counter >= 7) {
                                this.counter = 4
                            }
                        }
                        else if (Game.Player.powerUping && !Game.Keys.C) {
                            this.counter = 0;
                            Game.Player.powerUping = false;
                        }
                    }

                    if (Game.Player.powerUping) {
                        Game.Player.fx.whiteAura.loop();
                        if (Game.Player.power < 100) {
                            Game.Player.aura.css('filter', `drop-shadow(rgb(0, 238, 255) 0px 0px 5px) blur(${50 - (Game.Player.power)}px)`)
                            Game.Player.power += 0.5;
                        }
                        else {
                            Game.Player.aura.css('filter', 'drop-shadow(rgb(0, 238, 255) 0px 0px 5px)')
                            Game.Player.element.css('filter', 'drop-shadow(rgb(0, 238, 255) 0px 0px 5px)')
                        }
                    }
                    else {
                        Game.Player.fx.whiteAura.stop();
                    }
                }
            },
            run: {
                sprites: [
                    'img/player/run1.png', 
                    'img/player/run2.png', 
                    'img/player/run3.png', 
                    'img/player/run4.png',
                    'img/player/run5.png', 
                    'img/player/run6.png', 
                    'img/player/run7.png', 
                    'img/player/run8.png'
                ],
                counter: 0,
                animationSpeed: 0.25,
                start() {
                    if (Game.Player.grounded && !Game.Player.crouched && Game.Keys.right && !Game.Keys.C) {
                        //Game.Player.element.css('transform', 'scaleX(1)')
                        Game.Player.element.css('background-image', `url(${this.sprites[Math.floor(this.counter)]})`);
                        this.counter += this.animationSpeed;
                        // Sprawdzamy, czy przekroczyliśmy ilość klatek animacji
                        if (this.counter >= this.sprites.length) this.counter = 0;
                    }
                    else if (Game.Player.grounded && !Game.Player.crouched && Game.Keys.left && !Game.Keys.C) {
                        //Game.Player.element.css('transform', 'scaleX(-1)')
                        Game.Player.element.css('background-image', `url(${this.sprites[Math.floor(this.counter)]})`);
                        this.counter += this.animationSpeed;
                        // Sprawdzamy, czy przekroczyliśmy ilość klatek animacji
                        if (this.counter >= this.sprites.length) this.counter = 0;
                    }
                }
            },
            jump: {
                sprites: [
                    'img/player/jump1.png', 
                    'img/player/jump2.png', 
                    'img/player/jump3.png', 
                    'img/player/jump4.png',
                ],
                counter: 0,
                animationSpeed: 0.2,
                start() {
                    if (!Game.Player.grounded && Game.Player.vectors.y > 0) {
                        Game.Player.powerUping = false;
                        Game.Player.element.css('background-image', `url(${this.sprites[Math.floor(this.counter)]})`);

                        if (this.counter < 2) {
                            this.counter += this.animationSpeed;
                        }
                        if (this.counter >= 2) {
                            this.counter = 0;
                        }
                    }
                    else if (!Game.Player.grounded && Game.Player.vectors.y >= -7 && Game.Player.vectors.y <= 5) {
                        Game.Player.powerUping = false;
                        Game.Player.element.css('background-image', `url(${this.sprites[Math.floor(2)]})`);

                    }
                    else if (!Game.Player.grounded && Game.Player.vectors.y < 0) {
                        Game.Player.powerUping = false;
                        Game.Player.element.css('background-image', `url(${this.sprites[Math.floor(3)]})`);
                    }
                }
            },

            animate() {
                this.idle.start();
                this.run.start();
                this.crouch.start();
                this.guard.start();
                this.powerUp.start();
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
            this.aura = $('#aura');
            this.element.css('left', `${this.position.x}px`);
            this.element.css('bottom', `${this.position.y}px`);
            this.loaded = true;
        },
        update() {
            this.element.css('left', `${this.position.x}px`);
            this.element.css('bottom', `${this.position.y}px`);

            if (!Game.Player.crouched && !Game.Player.guarded && !Game.Keys.down && !Game.Player.powerUping) {
                if (Game.Keys.activeObject == 'player' && Game.Keys.left && (this.vectors.x > -this.maxSpeed)) {
                    Game.Player.element.css('transform', 'scaleX(-1)')
                    this.vectors.x -= this.speed;
                }
                else if (Game.Keys.activeObject == 'player' && Game.Keys.right && (this.vectors.x < this.maxSpeed)) {
                    Game.Player.element.css('transform', 'scaleX(1)')
                    this.vectors.x += this.speed;
                }
                if (Game.Keys.activeObject == 'player' && Game.Keys.up && Game.Player.grounded) {
                    Game.Player.grounded = false
                    this.vectors.y += this.jumpPower;
                }
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
        ui: {
            element: {},
            hp: {
                element: {},
                value: 100
            },
            power: {
                element: {},
                value: 0
            },
            update() {
                this.hp.element.css('width', `${Game.Player.hp}%`)
                this.power.element.css('width', `${Game.Player.power}%`)
            },
            load() {
                this.element = $('#ui');
                this.hp.element = $('#ui #hp');
                this.power.element = $('#ui #power');
                this.update();
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
            Game.Window.ui.load();
            Game.loop();
        }
    },
    loop() {
        console.log('frames');
        Game.Player.update();
        Game.Window.ui.update();
        Game.Physics.Gravity.calculate();
        requestAnimationFrame(Game.loop.bind(this));
    }
};