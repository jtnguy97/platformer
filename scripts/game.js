var config = {
    type: Phaser.AUTO,
    width: 800, height: 600,
     physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 650 },
            debug: false
        }
    },
    scene:{
        preload: preload,
        create: create,
        update: update
    }
};

var platforms;
var coins;
var dollars;
var hazards;
var cursors;
var moving_platforms;
var jumpSound;
var explosionSound;
var coinSound;
var money = 0;
var highScore = 0;
var highScoreText;
var moneyText;
var total = 0;
var exits;

var game = new Phaser.Game(config);

function preload(){
    //preloading everything in game
    this.load.image('background', 'assets/background.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('tile', 'assets/tile1.png');
    this.load.image('log', 'assets/tile2.png');
    this.load.image('coin', 'assets/coin.png');
    this.load.image('dollar', 'assets/money.png');
    this.load.image('hazard', 'assets/hazard.png');
    this.load.image('exit', 'assets/exit.png');
    this.load.audio('jump', ['assets/jump.mp3', 'assets/jump.ogg']);
    this.load.audio('coin', ['assets/coin.mp3', 'assets/coin.ogg']);
    this.load.audio('explosion', ['assets/explosion.mp3', 'assets/explosion.ogg']);
    this.load.audio('victory', ['assets/victory.mp3', 'assets/victory.ogg']);
    //preload animation
    this.load.spritesheet('pochita', 
        'assets/pochita.png',
        { frameWidth: 32, frameHeight: 28 }
    );
}

function create(){
    //create all sounds 
    this.explosionSound = this.sound.add('explosion');
    this.coinSound = this.sound.add('coin');
    this.jumpSound = this.sound.add('jump');
    this.victorySound = this.sound.add('victory');
    //a canvas
    this.add.image(400, 300, 'background');

    //creating game objects ground/tile
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(55, 500, 'tile');
    platforms.create(70, 450, 'tile');
    platforms.create(110, 450, 'log');
    platforms.create(150, 495, 'log');
    platforms.create(200, 495, 'log');
    platforms.create(290, 450, 'log');
    platforms.create(500, 450, 'log');
    platforms.create(400, 500, 'tile');
    platforms.create(700, 500, 'tile');
    platforms.create(200, 300, 'tile');
    platforms.create(540, 200, 'tile');
    platforms.create(100, 200, 'tile');
    platforms.create(500, 100, 'tile');
    platforms.create(600, 400, 'tile');
    platforms.create(650, 470, 'log');
    platforms.create(140, 350, 'log');
    platforms.create(120, 350, 'log');
    platforms.create(140, 370, 'log');
    platforms.create(70, 400, 'log');
    platforms.create(140, 270, 'log');
    platforms.create(500, 330, 'log');
    platforms.create(400, 456, 'log');
    platforms.create(230, 230, 'log');
    platforms.create(70, 400, 'log');
    platforms.create(70, 520, 'log');
    platforms.create(400, 253, 'tile');
    platforms.create(478, 290, 'tile');
    platforms.create(500, 100, 'tile');
    platforms.create(50, 100, 'log');
    platforms.create(70, 50, 'log');
    platforms.create(80, 79, 'tile');
    platforms.create(740, 200, 'tile');
    platforms.create(307, 375, 'log');
    platforms.create(400, 400, 'tile');
    platforms.create(250, 300, 'log');
    platforms.create(275, 300, 'log');
    platforms.create(40, 170, 'tile');
    platforms.create(200, 200, 'log');
    platforms.create(500, 500, 'log');
    platforms.create(600, 177, 'tile');
    platforms.create(700, 256, 'log');
    platforms.create(570, 289, 'tile');
    platforms.create(780, 500, 'log');
    platforms.create(750, 49, 'tile');
    platforms.create(468, 260, 'log');
    platforms.create(520, 80, 'log');
    platforms.create(720, 100, 'log');
    platforms.create(620, 160, 'log');
    platforms.create(780, 160, 'log');
    platforms.create(200, 157, 'log');
    platforms.create(250, 83, 'log');
    platforms.create(350, 280, 'tile');
    platforms.create(750, 460, 'log');
    platforms.create(730, 390, 'log');
    platforms.create(690, 330, 'log');
    platforms.create(300, 130, 'tile');
    platforms.create(400, 70, 'tile');
    platforms.create(680, 120, 'log');
    platforms.create(600, 50, 'log');

    player = this.physics.add.sprite(100, 450, 'pochita');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    //camera to follow player
    this.cameras.main.setBounds(0, 0, 800, 600).startFollow(player).setZoom(1.8);

    //coins + money score 
    //if explode subtract score
    exits = this.physics.add.group({
        key: 'exit',
        repeat: 0,
        setXY: { x: 600, y: 0, stepX:70 }
    });
        exits.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
    });

    coins = this.physics.add.group({
        key: 'coin',
        repeat: 25,
        setXY: { x: 10, y: 175, stepX: 38 }
    });
        coins.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.3));
    });

    dollars = this.physics.add.group({
        key: 'dollar',
        repeat: 20,
        setXY: { x: 40, y: 100, stepX: 49 }
    });
        dollars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.3));
    });

    hazards = this.physics.add.group({
        key: 'hazard',
        repeat: 8,
        setXY: { x: 50, y: 150, stepX: 88 }
    });
        hazards.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.3));
    });

    moneyText = this.add.text(400, 300, `$${money}`, {fontSize: '18px', fill: '#000'});
    highScoreText = this.add.text(400, 300, `H.S.$${highScore}`, {fontSize: '18px', fill: '#000'});

    //physics between objects and platforms
    this.physics.add.collider(coins, platforms);
    this.physics.add.collider(dollars, platforms);
    this.physics.add.collider(hazards, platforms);
    this.physics.add.collider(exits, platforms);

    this.physics.add.overlap(player, coins, collectCoin, null, this);
    this.physics.add.overlap(player, dollars, collectDollar, null, this);
    this.physics.add.overlap(player, hazards, collideHazard, null, this);
    this.physics.add.overlap(player, exits, collideExit, null, this);

    //creating animations
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('pochita', {start: 0, end: 1}),
        frameRate: 8,
        repeat: -1               });
    this.anims.create({
        key: 'turn',
        frames: this.anims.generateFrameNumbers('pochita', {start: 2, end: 3}),
        frameRate: 5,
        repeat: -1               });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('pochita', {start: 4, end: 5}),
        frameRate: 8,
        repeat: -1               });
   
        cursors = this.input.keyboard.createCursorKeys();  
        this.physics.add.collider(player, platforms);
        
}

//coin disappear and add to score
function collectCoin (player, coin){
    this.coinSound.play();
    coin.disableBody(true, true);
    money += 2;
    moneyText.setText('$' + money);
}
//dollar disappear and add to score
function collectDollar (player, dollar){
    this.coinSound.play();
    dollar.disableBody(true, true);
    money += 4;
    moneyText.setText('$' + money);
}
//hazard disappear and subtract to score
function collideHazard (player, hazard){
    this.explosionSound.play();
    hazard.disableBody(true, true);
    money -= 5;
    moneyText.setText('$' + money);
    //if run out of money, restart game.
    if(money<0){
        this.scene.stop();
        this.scene.restart();
        money = 0;

    }
}
//if collide with exit then win
function collideExit (player, exit){
    this.victorySound.play();
    exit.disableBody(true, true);
    this.scene.stop();
    this.scene.restart();
    money = 0;
}

//update animation with controls
function update(){
    if (cursors.left.isDown){
        player.setVelocityX(-160);
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown){
        player.setVelocityX(160);
        player.anims.play('right', true);
    }
    else{
        player.setVelocityX(0);
    }

    if (cursors.up.isDown && player.body.touching.down){
        player.setVelocityY(-330);
        player.anims.play('turn', true);
        this.jumpSound.play();
    }

    
    highScoreText.text = "top score $" + localStorage.getItem("highScore");
    if(money > localStorage.getItem("highScore")){
        localStorage.setItem("highScore", money);
    }
    //updated score following player
    moneyText.x= player.body.position.x+2;
    moneyText.y= player.body.position.y-10;

    highScoreText.x= player.body.position.x-50;
    highScoreText.y= player.body.position.y-30;



}