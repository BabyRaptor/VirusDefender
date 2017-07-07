var ENEMY_1_SIZE = 50;
var ENEMY_1_HP = 1;
var ENEMY_1_SCORE = 1;
var ENEMY_1_DAMAGE = 3;
var ENEMY_1_SPAWN_RATE = 200;

function Enemy1(layer) {
	this.x = 0;
	this.y = 0;
	this.a = 0;
	this.w = ENEMY_1_SIZE;
	this.hp = 0;
	this.damage = 0;
	this.live = false;
	
	var colorH = 0;
	var colorS = 0;
	var colorV = 0;
	this.colorRGB = null;
	
	var coreSprite = new cc.Sprite("res/GSGamePlay/Enemy1.png");
	coreSprite.setAnchorPoint(cc.p(0.5, 0.5));
	coreSprite.setPosition (cc.p(0, 0));
	coreSprite.setBlendFunc (new cc.BlendFunc(gl.SRC_ALPHA, gl.ONE));
	coreSprite.setZOrder (90);
	coreSprite.setVisible (false);
	layer.addChild(coreSprite);

	this.Spawn = function () {
		var side = (Math.random() * 4) >> 0;
		
		if (side == 0) {
			this.x = Math.random() * CANVAS_W;
			this.y = -ENEMY_1_SIZE;
		}
		else if (side == 1) {
			this.x = Math.random() * CANVAS_W;
			this.y = CANVAS_H + ENEMY_1_SIZE;
		}
		else if (side == 2) {
			this.y = Math.random() * CANVAS_H;
			this.x = CANVAS_W + ENEMY_1_SIZE;
		}
		else if (side == 3) {
			this.y = Math.random() * CANVAS_H;
			this.x = -ENEMY_1_SIZE;
		}
		this.a = Math.random() * 360;
		this.speed = 0.1 + Math.random() * 0.1;
		this.live = true;
		this.hp = ENEMY_1_HP;
		
		colorH = Math.random() * 360;
		colorS = 1;
		colorV = 1;
		this.colorRGB = getRGBColorFromHSV (colorH, colorS, colorV);
		coreSprite.setColor (this.colorRGB);
		coreSprite.setVisible (true);
		
		layer.antiSpam.RequestTargetRemoval (this);
	}
	this.Update = function (deltaTime) {
		if (this.live == true) {
			this.x += this.speed * deltaTime * Math.sin(this.a * DEG_TO_RAD);
			this.y += this.speed * deltaTime * Math.cos(this.a * DEG_TO_RAD);
			
			coreSprite.setPosition (cc.p(this.x, this.y));
			coreSprite.setRotation (this.a);
			
			if (this.x < -ENEMY_1_SIZE * 1.5 || this.x > CANVAS_W + ENEMY_1_SIZE * 1.5
			||  this.y < -ENEMY_1_SIZE * 1.5 || this.y > CANVAS_H + ENEMY_1_SIZE * 1.5) {
				this.Spawn();
			}
		}
	}
	this.Explode = function(earnScore) {
		if (this.live == true) {
			this.live = false;
			coreSprite.setVisible (false);
			
			var bulletParticle = cc.ParticleSystem.create("res/GSGamePlay/Enemy1Particle.plist");
			bulletParticle.setPosition(cc.p(this.x, this.y));
			bulletParticle.setAutoRemoveOnFinish(true);
			bulletParticle.setZOrder (91);
			bulletParticle.setBlendAdditive (true);
			bulletParticle.setAngleEqualEmitAngle (true);
			bulletParticle.setParticleCollisionRect(cc.rect(0, 0, CANVAS_W, CANVAS_H));
			bulletParticle.setAirResistant(0.98);
			bulletParticle.setLengthDependOnSpeed (0.1);
			bulletParticle.setStartColor(this.colorRGB);
			bulletParticle.setEndColor(cc.color(this.colorRGB.r * 0.5, this.colorRGB.g * 0.5, this.colorRGB.b * 0.5, 0));
			layer.addChild(bulletParticle);
			
			var explosionParticle = cc.ParticleSystem.create("res/GSGamePlay/Explosion.plist");
			explosionParticle.setPosition(cc.p(this.x, this.y));
			explosionParticle.setAutoRemoveOnFinish(true);
			explosionParticle.setZOrder (92);
			explosionParticle.setBlendAdditive (true);
			explosionParticle.setAirResistant(0.8);
			explosionParticle.setStartColor(cc.color(255, 255, 255, 255));
			explosionParticle.setEndColor(cc.color(this.colorRGB.r, this.colorRGB.g, this.colorRGB.b, 0));
			layer.addChild(explosionParticle);
			
			if (earnScore)  layer.addScore(ENEMY_1_SCORE);
			else 			layer.loseScore(ENEMY_1_DAMAGE);
			
			layer.antiSpam.RequestTargetRemoval (this);
			
			myAudio.PlaySound("res/GSGamePlay/ExplosionN.mp3");
		}

	}
	this.Hit = function (damage) {
		if (damage == null) damage = 1;
		this.hp -= damage;
		if (this.hp <=0) {
			this.Explode(true);
		}
	}
	this.CheckCollisionWithPlayer = function(player, shield) {
		if (this.live) {
			var checkAOE = PLAYER_SAFE_ZONE;
			if (shield.online == true) {
				checkAOE = SHIELD_SAFE_ZONE;
			}
			if (Math.abs (this.x - player.x) < (ENEMY_1_SIZE + checkAOE) * 0.5
			&&  Math.abs (this.y - player.y) < (ENEMY_1_SIZE + checkAOE) * 0.5) {
				this.Explode(shield.online );
			}
		}
	}
}