var GSLoaderMainLayer = cc.Layer.extend({
    sprite: null,
    ctor: function () {
        this._super();
		
		this.count = 0;
		this.bgY = 0;
		
		this.bgSprite = cc.Sprite.create("res/GSLoader/Background.png");
		this.bgSprite.setAnchorPoint(cc.p(0.5, 0));
		this.bgSprite.setPosition(cc.p(CANVAS_W * 0.5, CANVAS_H - 1071));
		this.bgSprite.setZOrder (0);
		this.addChild(this.bgSprite);
		
		this.lblLoading1 = cc.Sprite.create("res/GSLoader/Title.png");
        this.lblLoading1.setColor(cc.color(255, 255, 255));
        this.lblLoading1.setPosition(cc.p(CANVAS_W * 0.5, CANVAS_H * 0.85));
		this.lblLoading1.setAnchorPoint(cc.p(0.5, 0.5));
		this.lblLoading1.setBlendFunc (new cc.BlendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA));
		this.lblLoading1.setZOrder (3);
        this.addChild(this.lblLoading1);
		
		this.lblLoading2 = new cc.LabelTTF("Your phone is under attack!", "Verdana", 40);
        this.lblLoading2.setColor(cc.color(255, 255, 255));
        this.lblLoading2.setPosition(cc.p(CANVAS_W * 0.5, CANVAS_H * 0.2));
		this.lblLoading2.setAnchorPoint(cc.p(0.5, 0.5));
		this.lblLoading2.setZOrder (3);
        this.addChild(this.lblLoading2);
		
		this.lblLoading3 = new cc.LabelTTF("AVG will help you fending off the viruses.", "Verdana", 25);
        this.lblLoading3.setColor(cc.color(255, 255, 255));
        this.lblLoading3.setPosition(cc.p(CANVAS_W * 0.5, CANVAS_H * 0.2 - 40));
		this.lblLoading3.setAnchorPoint(cc.p(0.5, 0.5));
		this.lblLoading3.setZOrder (4);
        this.addChild(this.lblLoading3);
		
		this.lblLoading4 = new cc.LabelTTF("Loading...", "Verdana", 25);
        this.lblLoading4.setColor(cc.color(0, 255, 0));
        this.lblLoading4.setPosition(cc.p(CANVAS_W * 0.5, CANVAS_H * 0.2 - 75));
		this.lblLoading4.setAnchorPoint(cc.p(0.5, 0.5));
		this.lblLoading4.setZOrder (4);
        this.addChild(this.lblLoading4);
		
		this.logoSprite = cc.Sprite.create("res/GSLoader/Logo.png");
		this.logoSprite.setAnchorPoint(cc.p(0.5, 0.5));
		this.logoSprite.setPosition(cc.p(CANVAS_W * 0.5, CANVAS_H * 0.5));
		this.logoSprite.setZOrder (5);
		this.addChild(this.logoSprite);
		
		this.numberOfAsset = 0;
		this.numberOfAssetLoaded = 0;
		
		this.blinkCount = 0;
		this.touchLabelVisible = true;
		
		this.spriteArray = [];
		for (var i=0; i<g_imageList.length; i++) {
			this.loadImage (g_imageList[i]);
		}
		for (var i=0; i<g_spriteList.length; i++) {
			this.loadFile (g_spriteList);
		}
		for (var i=0; i<g_audioList.length; i++) {
			this.loadFile (g_audioList);
		}
		
		this.addTouchListener();
		this.addKeyListener();
		this.scheduleUpdate();
    },
	loadImage: function (path) {
		var instance = this;
		instance.numberOfAsset ++;
		cc.loader.loadImg(path, function(err){
			instance.numberOfAssetLoaded++;
			if (instance.numberOfAsset == instance.numberOfAssetLoaded) {
				instance.lblLoading4.setString ("Touch anywhere to start the battle...");
			}
		});
	},
	loadFile: function (res) {
		var instance = this;
		instance.numberOfAsset ++;
		cc.loader.load(res, function(err){
			instance.numberOfAssetLoaded++;
			if (instance.numberOfAsset == instance.numberOfAssetLoaded) {
				instance.lblLoading4.setString ("Touch anywhere to start the battle...");
			}
		});
	},
	
	update: function (deltaTime) {
		this.count += deltaTime;
		if (this.count >= 0.05) {
			this.count = 0;
			this.bgY += 22;
			if (this.bgY > 250) this.bgY = 0;
			this.bgSprite.setPosition(cc.p(CANVAS_W * 0.5, CANVAS_H - 1071 + this.bgY));
		}
		
		if (this.numberOfAsset == this.numberOfAssetLoaded) {
			this.blinkCount += deltaTime;
			if (this.blinkCount > 0.5) {
				this.blinkCount = 0;
				this.touchLabelVisible = !this.touchLabelVisible;
				this.lblLoading4.setVisible (this.touchLabelVisible);
			}
		}
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
	addTouchListener: function () {
		var instance = this;
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: function (touch, event) {
				return true;
			},
			onTouchMoved: function (touch, event) {         
				return true;
			},
			onTouchEnded: function (touch, event) {         
				if (instance.numberOfAsset == instance.numberOfAssetLoaded) {
					GoToGamePlay();
				}
				return true;
			}
		},this);
		
		cc.eventManager.addListener({
			event: cc.EventListener.MOUSE,
			onMouseDown: function (event) {
				
			},
			onMouseMove: function (event) {
			
			},
			onMouseUp: function (event) {         
				if (instance.numberOfAsset == instance.numberOfAssetLoaded) {
					GoToGamePlay();
				}
			},
			onMouseScroll: function(event){
				
			}
		},this);
	}
});

var GSLoader = cc.Scene.extend({
    onEnter:function () {
        this._super();
        this.addChild(new GSLoaderMainLayer());
    }
});

