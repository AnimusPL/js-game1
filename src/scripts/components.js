
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
                loop() {
                    $('#aura').addClass('animation-aura-white');
                },
                stop() {
                    $('#aura').removeClass('animation-aura-white');
                }
            }
        },
        animations: {
            idle: {
                counter: 0,
                animationSpeed: 0.1,
                start() {
                    if (Game.Player.grounded && !Game.Player.crouched && !Game.Player.guarded && !Game.Keys.right && !Game.Keys.left) {
                        Game.Player.element.css('animation', '0.8s linear infinite animation-player-idle')
                    }
                }
            },
            crouch: {
                start() {
                    if (Game.Player.grounded && !Game.Player.guarded && !Game.Keys.D) {
                        if (!Game.Player.crouched && Game.Keys.down) {
                            Game.Player.element.css('animation', '0.2s linear animation-player-crouch-down');
                            if (Game.Player.element.css('background-image').includes('img/player/crouch2.png')) {
                                Helpers.stopAnimationOnLastFrame(Game.Player.element);
                                Game.Player.crouched = true;
                                Game.Player.guarded = false;
                            }
                        }
                        else if (Game.Player.crouched && !Game.Player.guarded && !Game.Keys.down && !Game.Keys.D) {
                            Game.Player.element.css('animation', '0.2s linear animation-player-crouch-up');
                            if (Game.Player.element.css('background-image').includes('img/player/crouch3.png?2')) {
                                Game.Player.crouched = false;
                                Game.Player.guarded = false;
                            }
                        }
                    }
                }
            },
            guard: {
                start() {
                    if (!Game.Player.guarded && Game.Keys.D) {
                        Game.Player.element.css('animation', '0.1s linear animation-player-guard-down');
                        if (Game.Player.element.css('background-image').includes('img/player/guard2.png')) {
                            Game.Player.guarded = true;
                            Game.Player.crouched = false;
                            Helpers.stopAnimationOnLastFrame(Game.Player.element);
                        }
                    }
                    else if (Game.Player.guarded && !Game.Keys.D) {
                        Game.Player.element.css('animation', '0.1s linear infinite animation-player-guard-up');
                        if (Game.Player.element.css('background-image').includes('img/player/guard3.png?2')) {
                            Game.Player.guarded = false;
                            Game.Player.crouched = false;
                            Helpers.stopAnimationOnLastFrame(Game.Player.element);
                        }
                    }
                }
            },
            powerUp: {
                start() {
                    if (Game.Player.grounded && !Game.Player.crouched && !Game.Player.guarded) {
                        if (!Game.Player.powerUping && Game.Keys.C) {
                            Game.Player.element.css('animation', '0.2s linear animation-player-powerup-down');

                            if (Game.Player.element.css('background-image').includes('img/player/powerup3.png')) {
                                Game.Player.powerUping = true;
                            }
                        }
                        else if (Game.Player.powerUping && Game.Keys.C) {
                            Game.Player.element.css('animation', '0.4s linear infinite animation-player-powerup-active');

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
                            Game.Player.powerUping = false;
                            Game.Player.fx.whiteAura.stop();
                        }
                    }
                }
            },
            run: {
                start() {
                    if (Game.Player.grounded && !Game.Player.crouched && !Game.Player.guarded && Game.Keys.right && !Game.Keys.C) {
                        Game.Player.element.css('animation', '0.6s linear infinite animation-player-run');
                    }
                    else if (Game.Player.grounded && !Game.Player.crouched && !Game.Player.guarded && Game.Keys.left && !Game.Keys.C) {
                        Game.Player.element.css('animation', '0.6s linear infinite animation-player-run');
                    }
                }
            },
            jump: {
                start() {
                    if (!Game.Player.grounded && Game.Player.vectors.y > 0) {
                        Game.Player.element.css('animation', '0.6s linear infinite animation-player-jump-up');
                    }
                    else if (!Game.Player.grounded && Game.Player.vectors.y >= -7 && Game.Player.vectors.y <= 5) {
                        Game.Player.element.css('animation', '0.6s linear infinite animation-player-jump-active');
                    }
                    else if (!Game.Player.grounded && Game.Player.vectors.y < 0) {
                        
                        Game.Player.element.css('animation', '0.6s linear infinite animation-player-jump-down');
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

            if (!Game.Player.crouched && !Game.Keys.down && !Game.Player.powerUping && ((Game.Player.grounded && !Game.Player.guarded) || !Game.Player.grounded)) {
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

const Helpers = {
    stopAnimationOnLastFrame(element) {
        element.css('animation-fill-mode', 'forwards');
    },
    startAnimationOnLastFrame(element) {
        element.css('animation-fill-mode', 'none');
    }
}