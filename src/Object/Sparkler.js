var ORBIT_R = 25;
var ROTATE_SPEED = 0.2;

function Sparkler(type, x, y, layer) {
	this.x = x;
	this.y = y;
	this.a = 0;
	
	var started = false;
	var spark1 = null;
	var spark2 = null;
	this.Start = function() {
		started = true;
		
		spark1 = cc.ParticleSystem.create("res/GSGamePlay/Spark.plist");
		spark1.setPosition(cc.p(this.x, this.y));
		spark1.setZOrder (95);
		spark1.setBlendAdditive (true);
		layer.addChild(spark1);
		
		spark2 = cc.ParticleSystem.create("res/GSGamePlay/Spark.plist");
		spark2.setPosition(cc.p(this.x, this.y));
		spark2.setZOrder (95);
		spark2.setBlendAdditive (true);
		layer.addChild(spark2);
		
		if (type == 1) {
			spark1.setStartColor(cc.color(20, 128, 20, 255));
			spark1.setEndColor(cc.color(0, 64, 0, 0));
			spark2.setStartColor(cc.color(20, 128, 20, 255));
			spark2.setEndColor(cc.color(0, 64, 0, 0));
		}
		else if (type == 2) {
			spark1.setStartColor(cc.color(20, 80, 128, 255));
			spark1.setEndColor(cc.color(0, 40, 64, 0));
			spark2.setStartColor(cc.color(20, 80, 128, 255));
			spark2.setEndColor(cc.color(0, 40, 64, 0));
		}
		else if (type == 3) {
			spark1.setStartColor(cc.color(128, 20, 20, 255));
			spark1.setEndColor(cc.color(64, 0, 0, 0));
			spark2.setStartColor(cc.color(128, 20, 20, 255));
			spark2.setEndColor(cc.color(64, 0, 0, 0));
		}
	}
	
	this.Stop = function() {
		if (spark1)	spark1.stopSystem();
		if (spark2) spark2.stopSystem();
	}

	this.Update = function (deltaTime) {
		if (started) {
			this.a += deltaTime * ROTATE_SPEED;
			if (this.a > 360) this.a -= 360;
			
			var x = this.x + Math.sin(this.a * DEG_TO_RAD) * ORBIT_R;
			var y = this.y + Math.cos(this.a * DEG_TO_RAD) * ORBIT_R;
			spark1.setPosition(cc.p(x, y));
			
			x = this.x + Math.sin((this.a + 180) * DEG_TO_RAD) * ORBIT_R;
			y = this.y + Math.cos((this.a + 180) * DEG_TO_RAD) * ORBIT_R;
			spark2.setPosition(cc.p(x, y));
		}
	}
}