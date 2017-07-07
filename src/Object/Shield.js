var SHIELD_ONLINE_TIME = 3000;
var SHIELD_RECHARGE_TIME = 3000;
var SHIELD_SAFE_ZONE = 100;

function Shield(layer, x, y) {
	this.x = x;
	this.y = y;
	this.enable = false;
	this.online = false;
	
	this.coreSprite = new cc.Sprite("res/GSGamePlay/Shield_Circle.png");
	this.coreSprite.setPosition(cc.p(x, y));
	this.coreSprite.setZOrder(100);
	this.coreSprite.setVisible(false);
	this.coreSprite.setBlendFunc (new cc.BlendFunc(gl.SRC_ALPHA, gl.ONE));
	layer.addChild(this.coreSprite);
	
	this.waveSprite = new cc.Sprite("res/GSGamePlay/Shield_Wave.png");
	this.waveSprite.setPosition(cc.p(x, y));
	this.waveSprite.setZOrder(100);
	this.waveSprite.setVisible(false);
	this.waveSprite.setBlendFunc (new cc.BlendFunc(gl.SRC_ALPHA, gl.ONE));
	layer.addChild(this.waveSprite);


	var count = 2000;
	var animation = 0;

	this.Update = function (deltaTime) {
		if (this.enable) {
			count += deltaTime;
			if (this.online) {
				animation += deltaTime;
				
				var opacity = 0
				if (animation < SHIELD_ONLINE_TIME * 0.5)
					opacity = animation;
				else
					opacity = (SHIELD_ONLINE_TIME - animation);
				if (opacity < 0) opacity = 0;
				if (opacity > 255) opacity = 255;
				this.coreSprite.setOpacity (opacity);


				var opacity2 = (SHIELD_ONLINE_TIME - count) / SHIELD_ONLINE_TIME;
				var scale = count * 2.5 / SHIELD_ONLINE_TIME;
				this.waveSprite.setScale (scale);
				this.waveSprite.setOpacity (opacity * opacity2);
				
				if (count >= SHIELD_ONLINE_TIME) {
					count = 0;
					this.GoOffline();
				}
			}
			else {
				if (count >= SHIELD_RECHARGE_TIME) {
					count = 0;
					this.GoOnline();
				}
			}
		}
	},
	this.Enable = function(en) {
		this.enable = en;
		this.canShowSkill1 = en;
	},
	this.GoOnline = function() {
		animation = 0;
		this.online = true;
		this.coreSprite.setVisible(true);
		this.coreSprite.setOpacity(0);
		this.waveSprite.setVisible(true);
		this.waveSprite.setOpacity(0);
		this.waveSprite.setScale (0.0001);
	},
	this.GoOffline = function() {
		animation = 0;
		this.online = false;
		this.coreSprite.setVisible(false);
		this.waveSprite.setVisible(false);
	}
}