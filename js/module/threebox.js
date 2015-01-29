define(['zepto', 'tweenMax'], function($, Tmax) {

	function change3D(page1, page2, callback) {

		var flag = true;

		page1.parent().hide();

		var container = $('<div class="box3d-container">'),
			boxHtml = '<div></div><div></div><div></div>',
			box,
			css = {
				position: "absolute",
				left: 0,
				top: 0,
				width: "100%",
				height: "100%"
			};

		$('body').append(container);

		container.append(boxHtml);

		box = container.children();

		box.each(function(index) {

			var boxP = $('<div>'),
				boxC,
				boxW,
				toRotationY,
				p1 = page1.find('img').clone(),
				p2 = page2.find('img').clone();

			$(this).append(boxP);

			boxP.css(css);

			boxP.append('<div>');

			boxW = boxP.children();

			boxW.css(css);

			boxW.append('<div></div><div></div>');

			boxC = boxW.children();

			boxC.css(css);
			boxC.css({
				overflow: 'hidden'
			});

			boxC.eq(0).append(p1);
			boxC.eq(1).append(p2);

			p1.css({
				position: 'absolute',
				bottom: -(2 - index) * 100 + "%"
			});

			p2.css({
				position: 'absolute',
				bottom: -(2 - index) * 100 + "%"
			});

			TweenMax.set(boxC.eq(1), {
				rotationX: 0,
				rotationY: 0,
				x: 0,
				y: 0
			});

			var width = container.width();

			TweenMax.set(boxP, {
				perspective: 2000
			});
			TweenMax.set(boxW, {
				transformStyle: "preserve-3d",
				z: -width / 2,
				rotationX: 0,
				rotationY: 0
			});

			TweenMax.set(boxC.eq(0), {
				z: width / 2
			});

			if (index % 2 == 0) {

				toRotationY = -90;
				TweenMax.set(boxC.eq(1), {
					rotationX: 0,
					rotationY: 90,
					x: width / 2,
					y: 0,
					z: 0
				});

			} else {

				toRotationY = 90;
				TweenMax.set(boxC.eq(1), {
					rotationX: 0,
					rotationY: -90,
					x: -width / 2,
					y: 0,
					z: 0
				});

			}

			TweenMax.to(boxW, 1, {
				rotationX: 0,
				rotationY: toRotationY,
				delay: 0.6,
				ease: Cubic.easeInOut,
				onComplete: function() {

					container.remove();

					page2.parent().show();

					if (flag) {
						flag = false;
						callback && callback();
					}

				}
			});
		});


	}

	function box3D(page1, page2, lang, callback) {

		var p1 = page1,
			p2 = page2,
			c1 = p1.clone(),
			c2 = p2.clone(),
			parent = p1.parent(),
			container,
			box, c, toRotationY,
			css = {
				position: "absolute",
				left: 0,
				top: 0,
				width: "100%",
				height: "100%",
				'z-index': 100
			};

		parent.children().hide();

		container = document.createElement('div');

		parent.prepend($(container));

		$(container).css(css);

		box = $('<div>');

		box.css(css);

		box.append('<div></div><div></div>');

		c = box.children();

		c.css(css);

		$(container).append(box);

		c.eq(0).append(c1);

		c.eq(1).append(c2);

		c2.show();

		page1.hide();

		TweenMax.set(c.eq(1), {
			rotationX: 0,
			rotationY: 0,
			x: 0,
			y: 0
		});

		var width = parent.width();

		TweenMax.set(container, {
			perspective: 2000
		});
		TweenMax.set(box, {
			transformStyle: "preserve-3d",
			z: -width / 2,
			rotationX: 0,
			rotationY: 0
		});

		TweenMax.set(c.eq(0), {
			z: width / 2
		});

		if (lang === 'left') {

			toRotationY = -90;
			TweenMax.set(c.eq(1), {
				rotationX: 0,
				rotationY: 90,
				x: width / 2,
				y: 0,
				z: 0
			});

		} else if (lang === 'right') {

			toRotationY = 90;
			TweenMax.set(c.eq(1), {
				rotationX: 0,
				rotationY: -90,
				x: -width / 2,
				y: 0,
				z: 0
			});

		}

		TweenMax.to(box, 1, {
			rotationX: 0,
			rotationY: toRotationY,
			delay: 0.1,
			ease: Cubic.easeInOut,
			onComplete: function() {
				$(container).remove();

				page2.show()
				callback && callback();
			}
		});
	}

	return {

		box3D: box3D,

		change3D: change3D
	}
})