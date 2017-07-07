var SCREEN_SHAKE_LEVEL = 4;
var FLASH_SPEED = 0.6;
var GAME_FONT = "courier new";
var SKILL_1_POSITION_OFFSET_X = -49;
var SKILL_1_POSITION_OFFSET_Y = -53;
var SKILL_2_POSITION_OFFSET_X = 93;
var SKILL_2_POSITION_OFFSET_Y = 95;
var SKILL_3_POSITION_OFFSET_X = -156;
var SKILL_3_POSITION_OFFSET_Y = 151;

var TEXT_1_POSITION_OFFSET_X = 0;
var TEXT_1_POSITION_OFFSET_Y = 90;
var TEXT_2_POSITION_OFFSET_X = -200;
var TEXT_2_POSITION_OFFSET_Y = -85;
var TEXT_3_POSITION_OFFSET_X = 0;
var TEXT_3_POSITION_OFFSET_Y = 60;
var TEXT_4_POSITION_OFFSET_X = 0;
var TEXT_4_POSITION_OFFSET_Y = -80;

var EXP_LEVELS = [45, 250, 850, 1600];
var EXP_ENEMY_UNLOCK = [15, 150];
var GOLD_SCALES = [0.7, 1.0, 1.4, 2];

var GSGamePlayMainLayer = cc.Layer.extend({
    sprite: null,
    ctor: function () {
        this._super();
		
		this.score = 0;
		this.enemyUnlocked = 1;
		
		this.bgSprite1 = cc.Sprite.create("res/GSGamePlay/Background1.png");
		this.bgSprite1.setAnchorPoint(cc.p(0.5, 0.5));
		this.bgSprite1.setPosition(cc.p(CANVAS_W * 0.5, CANVAS_H * 0.5));
		this.bgSprite1.setZOrder (0);
		this.addChild(this.bgSprite1);
		
		
		this.fire2 = cc.Sprite.create("res/GSGamePlay/Fire2.png");
		this.fire2.setAnchorPoint(cc.p(0.5, 0.5));
		this.fire2.setPosition(cc.p(CANVAS_W * 0.5, CANVAS_H * 0.5));
		this.fire2.setZOrder (1);
		this.fire2.setVisible(false);
		this.addChild(this.fire2);
		
		this.fire3 = cc.Sprite.create("res/GSGamePlay/Fire3.png");
		this.fire3.setAnchorPoint(cc.p(0.5, 0.5));
		this.fire3.setPosition(cc.p(CANVAS_W * 0.5, CANVAS_H * 0.5));
		this.fire3.setZOrder (1);
		this.fire3.setVisible(false);
		this.addChild(this.fire3);
		
		this.fire4 = cc.Sprite.create("res/GSGamePlay/Fire4.png");
		this.fire4.setAnchorPoint(cc.p(0.5, 0.5));
		this.fire4.setPosition(cc.p(CANVAS_W * 0.5, CANVAS_H * 0.5));
		this.fire4.setZOrder (1);
		this.fire4.setVisible(false);
		this.addChild(this.fire4);
		
		
		this.goldFlash = cc.Sprite.create("res/GSGamePlay/GoldFlash.png");
		this.goldFlash.setAnchorPoint(cc.p(0.5, 0.5));
		this.goldFlash.setPosition(cc.p(CANVAS_W * 0.5, CANVAS_H * 0.5));
		this.goldFlash.setZOrder (3);
		this.goldFlash.setScale(0.2);
		this.addChild(this.goldFlash);
		
		this.redFlash = cc.Sprite.create("res/GSGamePlay/GoldFlash.png");
		this.redFlash.setAnchorPoint(cc.p(0.5, 0.5));
		this.redFlash.setPosition(cc.p(CANVAS_W * 0.5, CANVAS_H * 0.5));
		this.redFlash.setZOrder (4);
		this.redFlash.setScale(0.2);
		this.redFlash.setColor (cc.color(255, 0, 0));
		this.redFlash.setOpacity (0);
		this.addChild(this.redFlash);
		
		this.bgFlash = cc.Sprite.create("res/GSGamePlay/Flash.png");
		this.bgFlash.setAnchorPoint(cc.p(0.5, 0.5));
		this.bgFlash.setPosition(cc.p(-300, CANVAS_H * 0.5));
		this.bgFlash.setBlendFunc (new cc.BlendFunc(gl.SRC_ALPHA, gl.ONE));
		this.bgFlash.setZOrder (9);
		this.addChild(this.bgFlash);
		
		this.bgSprite2 = cc.Sprite.create("res/GSGamePlay/Background2.png");
		this.bgSprite2.setAnchorPoint(cc.p(0.5, 0.5));
		this.bgSprite2.setPosition(cc.p(CANVAS_W * 0.5, CANVAS_H * 0.5));
		this.bgSprite2.setZOrder (10);
		this.addChild(this.bgSprite2);
		
		
		this.blockSprite2 = cc.Sprite.create("res/GSGamePlay/Blocker2.png");
		this.blockSprite2.setAnchorPoint(cc.p(0.5, 0.5));
		this.blockSprite2.setPosition(cc.p(CANVAS_W * 0.5, CANVAS_H * 0.5));
		this.blockSprite2.setZOrder (11);
		this.blockSprite2.setBlendFunc (new cc.BlendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA));
		this.addChild(this.blockSprite2);
		
		this.blockSprite3 = cc.Sprite.create("res/GSGamePlay/Blocker3.png");
		this.blockSprite3.setAnchorPoint(cc.p(0.5, 0.5));
		this.blockSprite3.setPosition(cc.p(CANVAS_W * 0.5, CANVAS_H * 0.5));
		this.blockSprite3.setZOrder (11);
		this.blockSprite3.setBlendFunc (new cc.BlendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA));
		this.addChild(this.blockSprite3);
		
		this.blockSprite4 = cc.Sprite.create("res/GSGamePlay/Blocker4.png");
		this.blockSprite4.setAnchorPoint(cc.p(0.5, 0.5));
		this.blockSprite4.setPosition(cc.p(CANVAS_W * 0.5, CANVAS_H * 0.5));
		this.blockSprite4.setZOrder (11);
		this.blockSprite4.setBlendFunc (new cc.BlendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA));
		this.addChild(this.blockSprite4);
		
		this.vignetteLeft = cc.Sprite.create("res/GSGamePlay/Vignette.png");
		this.vignetteLeft.setAnchorPoint(cc.p(0, 0.5));
		this.vignetteLeft.setPosition(cc.p(0, CANVAS_H * 0.5));
		this.vignetteLeft.setZOrder (9999);
		this.addChild(this.vignetteLeft);
		
		this.vignetteRight = cc.Sprite.create("res/GSGamePlay/Vignette.png");
		this.vignetteRight.setAnchorPoint(cc.p(1, 0.5));
		this.vignetteRight.setPosition(cc.p(CANVAS_W, CANVAS_H * 0.5));
		this.vignetteRight.setFlippedX (true);
		this.vignetteRight.setZOrder (9999);
		this.addChild(this.vignetteRight);
		
		
		this.playAgainAlpha = 0;
		this.lblPlayAgain = new cc.LabelTTF("Touch anywhere to play again...", "Verdana", 25);
        this.lblPlayAgain.setColor(cc.color(170, 210, 255));
        this.lblPlayAgain.setPosition(cc.p(CANVAS_W * 0.5, CANVAS_H * 0.2 - 75));
		this.lblPlayAgain.setAnchorPoint(cc.p(0.5, 0.5));
		this.lblPlayAgain.setZOrder (500);
		this.lblPlayAgain.setOpacity(0);
        this.addChild(this.lblPlayAgain);
		


		this.player = new Player(CANVAS_W * 0.5, CANVAS_H * 0.5, this);
		this.bulletPool = new Array();
		for (var i=0; i<50; i++) {
			this.bulletPool[i] = new Bullet(this);
		}
		this.enemyPool1 = new Array();
		for (var i=0; i<30; i++) {
			this.enemyPool1[i] = new Enemy1(this);
		}
		this.enemyPool2 = new Array();
		for (var i=0; i<10; i++) {
			this.enemyPool2[i] = new Enemy2(this);
		}
		this.enemyPool3 = new Array();
		for (var i=0; i<10; i++) {
			this.enemyPool3[i] = new Enemy3(this);
		}

		// Dao Ngoc Canh
		this.shield = new Shield(this, CANVAS_W * 0.5, CANVAS_H * 0.5);
		this.antiSpam = new AntiSpam(this);
		this.priorityUpdate = new PriorityUpdate(this);

		this.endGame = false;
		this.endGameAlpha = 0;

		this.endscreenBG = cc.Sprite.create("res/GSGamePlay/EndScreenBG.png");
        this.endscreenBG.setPosition(cc.p(CANVAS_W * 0.5, CANVAS_H * 0.75));
		this.endscreenBG.setAnchorPoint(cc.p(0.5, 0.5));
		this.endscreenBG.setZOrder (199);
		this.endscreenBG.setOpacity (0);
        this.addChild(this.endscreenBG);
		
		this.endScreen = cc.Sprite.create("res/GSGamePlay/Endscreen.png");
        this.endScreen.setPosition(cc.p(CANVAS_W * 0.5, CANVAS_H * 0.75));
		this.endScreen.setAnchorPoint(cc.p(0.5, 0.5));
		this.endScreen.setZOrder (200);
		this.endScreen.setBlendFunc (new cc.BlendFunc(gl.SRC_ALPHA, gl.ONE));
		this.endScreen.setOpacity (0);
        this.addChild(this.endScreen);
        // ==============
		
		this.spawnCount1 = -1000;
		this.spawnCount2 = 0;
		this.spawnCount3 = 0;
		
		this.screenOffsetX = 0;
		this.screenOffsetY = 0;
		this.screenShakeCount = 0;
		this.screenShakeLevel = 0;
		
		this.flashX1 = 0;
		
		this.goldScale = 0.2;
		this.goldVibrate = 0;
		this.goldCycle = 0;
		this.goldFlashRedTilt = 0;
		
		
		this.upgradeSpark1 = new Sparkler (1, CANVAS_W * 0.5 + SKILL_1_POSITION_OFFSET_X, CANVAS_H * 0.5 + SKILL_1_POSITION_OFFSET_Y, this);
		this.upgradeSpark2 = new Sparkler (2, CANVAS_W * 0.5 + SKILL_2_POSITION_OFFSET_X, CANVAS_H * 0.5 + SKILL_2_POSITION_OFFSET_Y, this);
		this.upgradeSpark3 = new Sparkler (3, CANVAS_W * 0.5 + SKILL_3_POSITION_OFFSET_X, CANVAS_H * 0.5 + SKILL_3_POSITION_OFFSET_Y, this);
		
		this.addTouchListener();
		this.addKeyListener();
		this.scheduleUpdate();
		
		
		cc.audioEngine.playMusic("res/GSGamePlay/Music.mp3", true);
    },
	update: function (deltaTime) {
		deltaTime = deltaTime * 1000;
		
		this.flashX1 += FLASH_SPEED * deltaTime;
		if (this.flashX1 >= CANVAS_W + 300) {
			this.flashX1 = -300;
		}
		this.bgFlash.setPosition(cc.p(this.flashX1, CANVAS_H * 0.5));
		

		
		var beatSpeed = 1500;
		var targetGoldScale = 0;
		var currentGoldScale = this.goldFlash.getScale();
		var maxScaleDelta = 10;
		
		var goldScaleCycle = 0;
		/*
		this.goldCycle += deltaTime;
		if (this.goldCycle > beatSpeed) {
			this.goldCycle = 0;
		}
		if (this.goldCycle < beatSpeed/2) {
			goldScaleCycle = this.goldCycle / beatSpeed;
		}
		else {
			goldScaleCycle = (beatSpeed - this.goldCycle) / beatSpeed;
		}
		*/
		
		var goldScaleVibrate = 0;
		if (this.goldVibrate > 0) {
			this.goldVibrate -= deltaTime;
		}
		if (this.goldVibrate > 200) {
			goldScaleVibrate = (this.goldVibrate - 300) / 2400;
		}
		else {
			goldScaleVibrate = this.goldVibrate / 5600;
		}
		
		var scoreGoldScale = 0;
		for(var i = 0; i < EXP_LEVELS.length; i++){
			if(this.score <= EXP_LEVELS[i]){
				var lastExp = i == 0 ? 0 : EXP_LEVELS[i - 1];
				var percentage = (this.score - lastExp)/(EXP_LEVELS[i] - lastExp);
				var lastScale = i == 0 ? this.goldScale : GOLD_SCALES[i - 1];
				scoreGoldScale = lastScale + (GOLD_SCALES[i] - lastScale) * percentage;
				
				break;
			}
		}
		targetGoldScale = scoreGoldScale + goldScaleCycle + goldScaleVibrate;
		
		var distance = Math.abs(targetGoldScale - currentGoldScale);
		var currentMove = maxScaleDelta * deltaTime/1000 * distance;
		
		if(distance <= currentMove){
			currentGoldScale = targetGoldScale;
		}
		else{
			if(targetGoldScale > currentGoldScale){
				currentGoldScale += currentMove;
			}
			else{
				currentGoldScale -= currentMove;
			}
		}
		this.goldFlash.setScale(currentGoldScale);
		this.redFlash.setScale(currentGoldScale);
		
		
		if (this.goldFlashRedTilt > 0) {
			this.goldFlashRedTilt -= deltaTime;
			
			var alpha = 0;
			if (this.goldFlashRedTilt > 1300) {
				alpha = (1500 - this.goldFlashRedTilt) * 255 / 200;
				if (alpha > 255) alpha = 255;
			}
			else {
				alpha = this.goldFlashRedTilt * 0.2;
				if (alpha > 255) alpha = 255;
			}
			this.redFlash.setOpacity (alpha);
		}
		else {
			this.redFlash.setOpacity (0);
		}
		
		
		this.player.Update (deltaTime);
		for (var i=0; i<this.bulletPool.length; i++) {
			this.bulletPool[i].Update (deltaTime);
			for (var j=0; j<this.enemyPool1.length; j++) {
				if (this.enemyPool1[j].live == true) {
					this.bulletPool[i].CheckCollision(this.enemyPool1[j]);
				}
			}
			for (var j=0; j<this.enemyPool2.length; j++) {
				if (this.enemyPool2[j].live == true) {
					this.bulletPool[i].CheckCollision(this.enemyPool2[j]);
				}
			}
			for (var j=0; j<this.enemyPool3.length; j++) {
				if (this.enemyPool3[j].live == true) {
					this.bulletPool[i].CheckCollision(this.enemyPool3[j], true);
				}
			}
		}
		
		
		if (!this.endGame) {
			this.spawnCount1 += deltaTime;
			if (this.spawnCount1 >= ENEMY_1_SPAWN_RATE) {
				this.spawnCount1 = 0;
				var tempEnemy = this.getAnEnemy1();
				if (tempEnemy) {
					tempEnemy.Spawn();
				}
			}
			
			if (this.enemyUnlocked >= 2) {
				this.spawnCount2 += deltaTime;
				if (this.spawnCount2 >= ENEMY_2_SPAWN_RATE) {
					this.spawnCount2 = 0;
					var tempEnemy = this.getAnEnemy2();
					if (tempEnemy) {
						tempEnemy.Spawn();
					}
				}
			}
			
			if (this.enemyUnlocked >= 3) {
				this.spawnCount3 += deltaTime;
				if (this.spawnCount3 >= ENEMY_3_SPAWN_RATE) {
					this.spawnCount3 = 0;
					var tempEnemy = this.getAnEnemy3();
					if (tempEnemy) {
						tempEnemy.Spawn();
					}
				}
			}			
		}
		
		
		for (var i=0; i<this.enemyPool1.length; i++) {
			this.enemyPool1[i].CheckCollisionWithPlayer (this.player, this.shield);
			this.enemyPool1[i].Update (deltaTime);
		}
		for (var i=0; i<this.enemyPool2.length; i++) {
			this.enemyPool2[i].CheckCollisionWithPlayer (this.player, this.shield);
			this.enemyPool2[i].Update (deltaTime);
		}
		for (var i=0; i<this.enemyPool3.length; i++) {
			this.enemyPool3[i].CheckCollisionWithPlayer (this.player, this.shield);
			this.enemyPool3[i].Update (deltaTime);
		}

		// Dao Ngoc Canh
		if (!this.endGame || this.shield.online) {
			this.shield.Update(deltaTime);			
		}
		// Hoang Tuan Minh, already add shield check to "CheckCollisionWithPlayer", we just need to check once.
		
		

		this.antiSpam.Update(deltaTime);

		this.priorityUpdate.Update(deltaTime);

		// end game - ggwp
		if (this.score >= EXP_LEVELS[3]) {
			for (var i = 0; i < this.enemyPool1.length; i++) {
				this.enemyPool1[i].Explode();
			}

			for (var i = 0; i < this.enemyPool2.length; i++) {
				this.enemyPool2[i].Explode();
			}

			for (var i = 0; i < this.enemyPool3.length; i++) {
				this.enemyPool3[i].Explode();
			}

			this.endGame = true;

			this.player.SetShooting(false);

			this.upgradeSpark1.Stop();
			this.upgradeSpark2.Stop();
			this.upgradeSpark3.Stop();
			
			cc.director.getScheduler().setTimeScale(0.3);
		}
		
		// ==============
		
		if (!this.endGame) {
			this.upgradeSpark1.Update(deltaTime);
			this.upgradeSpark2.Update(deltaTime);
			this.upgradeSpark3.Update(deltaTime);
		}
		else {
			this.endGameAlpha += deltaTime * 0.3;
			if (this.endGameAlpha > 255) {
				this.endGameAlpha = 255;
			}
			this.endscreenBG.setOpacity(this.endGameAlpha);
			this.endscreenBG.setPositionY(CANVAS_H * 0.75 + this.endGameAlpha * 0.2);
			this.endScreen.setOpacity(this.endGameAlpha);
			this.endScreen.setPositionY(CANVAS_H * 0.75 + this.endGameAlpha * 0.2);
			
			if (this.endGameAlpha == 255) {
				this.playAgainAlpha += deltaTime * 0.3;
				if (this.playAgainAlpha > 255) {
					this.playAgainAlpha = 255;
				}
				this.lblPlayAgain.setOpacity(this.playAgainAlpha);
			}
		}
		
		if (this.screenShakeCount > 0) {
			this.screenOffsetX = Math.random() * SCREEN_SHAKE_LEVEL - SCREEN_SHAKE_LEVEL * 2;
			this.screenOffsetY = Math.random() * SCREEN_SHAKE_LEVEL - SCREEN_SHAKE_LEVEL * 2;
			this.screenShakeCount -= deltaTime;
			if (this.screenShakeCount <= 0) {
				this.screenOffsetX = 0;
				this.screenOffsetY = 0;
			}
			this.setPosition(cc.p(this.screenOffsetX, this.screenOffsetY));
		}
		
		
		
		myAudio.Update(deltaTime);
	},
	addTouchListener: function () {
		var instance = this;
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: function (touch, event) {
				if (!instance.endGame) {
					instance.player.SetPointAt(touch.getLocation().x, touch.getLocation().y);
					instance.player.SetShooting(true);					
				}
				//else {
				//	cc.director.end();
				//}
				return true;
			},
			onTouchMoved: function (touch, event) {       
				if (!instance.endGame) {
					instance.player.SetPointAt(touch.getLocation().x, touch.getLocation().y);					
				}  
				return true;
			},
			onTouchEnded: function (touch, event) {
				if (!instance.endGame) {
					instance.player.SetShooting(false);					
				}
				else {
					if (instance.playAgainAlpha > 128) {
						cc.director.getScheduler().setTimeScale(1);
						ResetGame();
					}
				}
				//manhnd: to test this.
				//instance.playUnlockParticle (SKILL_2_POSITION_OFFSET_X, SKILL_2_POSITION_OFFSET_Y);
				//instance.antiSpam.Enable(true);
				//instance.playUnlockParticle (SKILL_1_POSITION_OFFSET_X, SKILL_1_POSITION_OFFSET_Y);
				//instance.priorityUpdate.Enable(true);
				return true;
			}
		},this);
	},
	addKeyListener: function() {
		cc.eventManager.addListener({
			event: cc.EventListener.KEYBOARD,
			onKeyPressed:  function(keyCode, event) {
	        },
	        onKeyReleased: function(keyCode, event) {
		        if (keyCode == cc.KEY.back) {
			        cc.director.end();
			    }
			    return true;
	        }
		}, this);
	},
	getABullet: function() {
		for (var i=0; i<this.bulletPool.length; i++) {
			if (this.bulletPool[i].live == false) {
				return this.bulletPool[i];
			}
		}
	},
	getAnEnemy1: function() {
		for (var i=0; i<this.enemyPool1.length; i++) {
			if (this.enemyPool1[i].live == false) {
				return this.enemyPool1[i];
			}
		}
	},
	getAnEnemy2: function() {
		for (var i=0; i<this.enemyPool2.length; i++) {
			if (this.enemyPool2[i].live == false) {
				return this.enemyPool2[i];
			}
		}
	},
	getAnEnemy3: function() {
		for (var i=0; i<this.enemyPool3.length; i++) {
			if (this.enemyPool3[i].live == false) {
				return this.enemyPool3[i];
			}
		}
	},
	addScore: function(s) {
		if (this.score > EXP_ENEMY_UNLOCK[1]) {
			if (this.enemyUnlocked < 3) this.enemyUnlocked = 3;
		}
		else if (this.score > EXP_ENEMY_UNLOCK[0]) {
			if (this.enemyUnlocked < 2) this.enemyUnlocked = 2;
		}
		
		if (this.score < EXP_LEVELS[0] && this.score + s >= EXP_LEVELS[0]) {
			this.player.LevelUp(2);
			this.playUnlockParticle (2);
		}
		else if (this.score < EXP_LEVELS[1] && this.score + s >= EXP_LEVELS[1]) {
			this.player.LevelUp(3);
			this.playUnlockParticle (3);
		}
		else if (this.score < EXP_LEVELS[2] && this.score + s >= EXP_LEVELS[2]) {
			this.player.LevelUp(4);
		}
		this.score += s;
		this.goldVibrate = 1000;
	},
	loseScore: function(s) {
		this.score -= s;
		if (this.score < -60) this.score = -60;
		this.goldFlashRedTilt = 1500;
		this.shakeScreen (200);
	},
	shakeScreen: function(time) {
		//this.screenShakeCount = time;
	},
	playUnlockParticle: function (area) {
		var x = 0;
		var y = 0;
		if (area == 1) {
			x = 0;
			y = 0;
		}
		else if (area == 2) {
			x = SKILL_1_POSITION_OFFSET_X;
			y = SKILL_1_POSITION_OFFSET_Y;
			this.fire2.setVisible(true);
			this.upgradeSpark1.Start();
		}
		else if (area == 3) {
			x = SKILL_2_POSITION_OFFSET_X;
			y = SKILL_2_POSITION_OFFSET_Y;
			this.fire3.setVisible(true);
			this.upgradeSpark2.Start();
		}
		else if (area == 4) {
			x = SKILL_3_POSITION_OFFSET_X;
			y = SKILL_3_POSITION_OFFSET_Y;
			this.fire4.setVisible(true);
			this.upgradeSpark3.Start();
		}
		
		/*
		var unlockParticle = cc.ParticleSystem.create("res/GSGamePlay/Unlock.plist");
		unlockParticle.setPosition(cc.p(CANVAS_W * 0.5 + x, CANVAS_H * 0.5 + y));
		unlockParticle.setAutoRemoveOnFinish(true);
		unlockParticle.setZOrder (50);
		unlockParticle.setBlendAdditive (true);
		unlockParticle.setAirResistant(0.9);
		this.addChild(unlockParticle);
		*/
		
		myAudio.PlaySound("res/GSGamePlay/Upgrade.mp3");
	}

});

var GSGamePlay = cc.Scene.extend({
    onEnter:function () {
        this._super();
        this.addChild(new GSGamePlayMainLayer());
    }
});













var RAD_TO_DEG = 57.29577951308231;
var DEG_TO_RAD = 0.0174532925199433;
function CalculateAngleBetweenTwoPoint (x1, y1, x2, y2) {
	var angle = 0;
	if (y2 == y1) {
		if (x2 > x1)
			angle = 90;
		else if (x2 < x1)
			angle = -90;
	}
	else {
		angle = Math.atan((x2 - x1) / (y2 - y1)) * RAD_TO_DEG;
		if (y2 < y1) {
			angle += 180;
		}
		if (angle < 0) angle += 360;
	}
	
	return angle;
}

function getRGBColorFromHSV(h, s, v) {
	var i;
	var f, p, q, t;
	var r, g, b;
	if (s == 0) {
		r = v;
		b = v;
		g = v;
	}
	else {
		h = h / 60;
		i = Math.floor(h);
		f = h - i;
		p = v * ( 1 - s );
		q = v * ( 1 - s * f );
		t = v * ( 1 - s * ( 1 - f ) );
		
		switch( i ) {
			case 0:
				r = v;
				g = t;
				b = p;
				break;
			case 1:
				r = q;
				g = v;
				b = p;
				break;
			case 2:
				r = p;
				g = v;
				b = t;
				break;
			case 3:
				r = p;
				g = q;
				b = v;
				break;
			case 4:
				r = t;
				g = p;
				b = v;
				break;
			default:
				r = v;
				g = p;
				b = q;
				break;
		}
	}
	return cc.color(r * 255, g * 255, b * 255);
}