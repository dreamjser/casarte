define([], function() {

	//序列帧动画
	function Sprite() {

	}

	Sprite.prototype = {

		start: function(config) {

			config = config || {};

			this.num = 0;

			this.ani = false;

			this.auto = null;

			this.url = config.url || [];

			this.count = this.url.length;

			this.img = config.img || null;

			this.time = config.time || 60;

			this.isOne = config.isOne || true;

			this.result = config.result || function() {};

			this.auto = setInterval(this.bind(this, this.doSprite), this.time);

		},

		doSprite: function() {

			if (this.num >= this.count) {

				if (this.isOne) {

					this.ani = false;

					this.result && this.result();

					clearInterval(this.auto);

					return;
				}

				this.num = 0;

			}

			this.ani = true;

			this.img.src = this.url[this.num];

			this.num++;
		},

		clearSprite: function() {

			this.ani = false;

			clearInterval(this.auto);
		},

		bind: function(obj, handler) {

			return function() {

				return handler.apply(obj, arguments);
			}

		}
	}

	return {

		Sprite: Sprite
	}

});