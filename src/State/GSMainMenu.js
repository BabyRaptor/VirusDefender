var GSMainMenuMainLayer = cc.Layer.extend({
    sprite: null,
    ctor: function () {
		var instance = this;
        this._super();
		
		this.bgSprite = cc.Sprite.create("res/GSMainMenu/Background.jpg");
		this.bgSprite.setAnchorPoint(cc.p(0.5, 0));
		this.bgSprite.setPosition(cc.p(CANVAS_W * 0.5, 0));
		this.addChild(this.bgSprite);
		
		this.playButton = new Button ("res/GSMainMenu/PlayButton.plist", "PlayButtonN.png", "PlayButtonD.png", function () {GoToGamePlay();});
		this.playButton.setPosition(cc.p(CANVAS_W * 0.5, CANVAS_H * 0.1));
		this.playButton.setAnchorPoint(cc.p(0.5, 0.5));
		this.playButton.addToLayer (this);
		
		this.musicOn = new Button ("res/GSMainMenu/MusicOn.plist", "MusicOnN.png", "MusicOnD.png", function() {instance.toggleMusic();});
		this.musicOn.setPosition(cc.p(CANVAS_W * 0.9, CANVAS_H * 0.1));
		this.musicOn.setAnchorPoint(cc.p(0.5, 0.5));
		this.musicOn.addToLayer (this);
		
		this.musicOff = new Button ("res/GSMainMenu/MusicOff.plist", "MusicOffN.png", "MusicOffD.png", function() {instance.toggleMusic();});
		this.musicOff.setPosition(cc.p(CANVAS_W * 0.9, CANVAS_H * 0.1));
		this.musicOff.setAnchorPoint(cc.p(0.5, 0.5));
		this.musicOff.addToLayer (this);
		this.musicOff.Hide();
		
		this.soundOn = new Button ("res/GSMainMenu/SoundOn.plist", "SoundOnN.png", "SoundOnD.png", function() {instance.toggleSound();});
		this.soundOn.setPosition(cc.p(CANVAS_W * 0.1, CANVAS_H * 0.1));
		this.soundOn.setAnchorPoint(cc.p(0.5, 0.5));
		this.soundOn.addToLayer (this);
		
		this.soundOff = new Button ("res/GSMainMenu/SoundOff.plist", "SoundOffN.png", "SoundOffD.png", function() {instance.toggleSound();});
		this.soundOff.setPosition(cc.p(CANVAS_W * 0.1, CANVAS_H * 0.1));
		this.soundOff.setAnchorPoint(cc.p(0.5, 0.5));
		this.soundOff.addToLayer (this);
		this.soundOff.Hide();
		
		this.scheduleUpdate();
    },
	toggleMusic: function () {
		if (g_settingEnableMusic == true) {
			g_settingEnableMusic = false;
			this.musicOn.Hide();
			this.musicOff.Show();
		}
		else {
			g_settingEnableMusic = true;
			this.musicOn.Show();
			this.musicOff.Hide();
		}
	},
	toggleSound: function () {
		if (g_settingEnableSound == true) {
			g_settingEnableSound = false;
			this.soundOn.Hide();
			this.soundOff.Show();
		}
		else {
			g_settingEnableSound = true;
			this.soundOn.Show();
			this.soundOff.Hide();
		}
	},
	update: function (deltaTime) {
		
	}
});

var GSMainMenu = cc.Scene.extend({
    onEnter:function () {
        this._super();
        this.addChild(new GSMainMenuMainLayer());
    }
});

