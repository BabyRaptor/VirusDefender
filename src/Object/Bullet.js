var BULLET_SIZE = 50;
var BULLET_SPEED = 1;

function Bullet(layer) {
	this.x = 0;
	this.y = 0;
	this.a = 0;
	this.live = false;
	
	var coreSprite = new cc.Sprite("res/GSGamePlay/Bullet.png");
	coreSprite.setAnchorPoint(cc.p(0.5, 0.5));
	coreSprite.setPosition (cc.p(0, 0));
	coreSprite.setBlendFunc (new cc.BlendFunc(gl.SRC_ALPHA, gl.ONE));
	coreSprite.setZOrder (90);
	coreSprite.setVisible (false);
	layer.addChild(coreSprite);
	
	var colorH = 0;
	var colorS = 0;
	var colorV = 0;
	var colorRGB = null;
	


	this.Spawn = function (x, y, a) {
		this.x = x;
		this.y = y;
		this.a = a;
		this.live = true;
		
		colorH = Math.random() * 360;
		colorS = 0;
		colorV = 1;
		colorRGB = getRGBColorFromHSV (colorH, colorS, colorV);
		coreSprite.setColor (colorRGB);
		coreSprite.setVisible (true);
	}
	this.Update = function (deltaTime) {
		if (this.live == true) {
			this.x += BULLET_SPEED * deltaTime * Math.sin(this.a * DEG_TO_RAD);
			this.y += BULLET_SPEED * deltaTime * Math.cos(this.a * DEG_TO_RAD);
			
			if (this.x < BULLET_SIZE * 0.5 || this.x > CANVAS_W - BULLET_SIZE * 0.5
			||  this.y < BULLET_SIZE * 0.5 || this.y > CANVAS_H - BULLET_SIZE * 0.5) {
				this.Explode(255, 255, 255);
				myAudio.PlaySound("res/GSGamePlay/ImpactN.mp3");
			}
			
			coreSprite.setPosition (cc.p(this.x, this.y));
			coreSprite.setRotation (this.a);
		}
	}
	this.Explode = function(r, g, b) {
		this.live = false;
		coreSprite.setVisible (false);
		
		var bulletParticle = cc.ParticleSystem.create("res/GSGamePlay/BulletParticle.plist");
		bulletParticle.setPosition(cc.p(this.x, this.y));
		bulletParticle.setAutoRemoveOnFinish(true);
		bulletParticle.setZOrder (91);
		bulletParticle.setBlendAdditive (true);
		bulletParticle.setAngleEqualEmitAngle (true);
		bulletParticle.setParticleCollisionRect(cc.rect(0, 0, CANVAS_W, CANVAS_H));
		bulletParticle.setAirResistant(0.98);
		bulletParticle.setLengthDependOnSpeed (0.04);
		bulletParticle.setStartColor(cc.color(r, g, b, 255));
		bulletParticle.setEndColor(cc.color(r * 0.5, g * 0.5, b * 0.5, 0));
		layer.addChild(bulletParticle);
	}
	this.CheckCollision = function (enemy, tanker) {
		if (this.live) {
			if (Math.abs (this.x - enemy.x) < BULLET_SIZE * 0.5
			&&  Math.abs (this.y - enemy.y) < BULLET_SIZE * 0.5) {
				enemy.Hit(1);
				this.Explode(enemy.colorRGB.r, enemy.colorRGB.g, enemy.colorRGB.b);
				
				if (tanker) {
					myAudio.PlaySound("res/GSGamePlay/ImpactT.mp3");
				}
				else {
					myAudio.PlaySound("res/GSGamePlay/ImpactN.mp3");
				}
			}
		}
	}
}