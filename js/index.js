require.config({
	baseUrl : 'js',
	paths : {
		"zepto"    : 'lib/zepto',
		"tweenMax" : 'lib/TweenMax',
		"load"	   : 'module/load',
		"anipic"   : 'module/anipic',
		"sprite"   : 'module/sprite',
		"box3d"    : 'module/threebox',
	},

	shim : {

		'zepto' : {

			exports : 'Zepto'
		},

		'tweenMax' : {

			exports : 'TweenMax'
		}
	}
	
});
require(['zepto','tweenMax' ,'box3d','load','anipic','sprite'], function($,tweenMax, three, imgLoad, anipic, sprite) {

	var sex = 0, //0-男，1-女
		sexFlag = true,
		pageNum = 0,
		prePageNum = 0,
		loading = $('#loading'),
		WORD_ANI_TIME = 400,
		WAIT_TIME = 300,
		screenHeight = window.screen.height>window.screen.width ? window.screen.height : window.screen.width,
		windowHeight = $(window).height()>$(window).width() ? $(window).height() : $(window).width();
		page1Img = $('#page_img1'),
		page2Img = $('#page_img2'),
		page9Img = $('#page_img9'),
		p1Content = $('#page1_content'),
		page1Btn = $('#page1_btn'),
		page2Btn = $('#page2_btn'),
		p2Content = $('#page2_content'),
		p2TopContent = $('#page2_content_top'),
		p2BottomContent = $('#page2_content_bottom'),
		picArr = anipic.picArr,
		Sprite = sprite.Sprite,
		wxDefault = '忙的要命？测测每天有多少时间用来爱！',
		loadFlag = [[true],[true],[true],[false,false],[false],[false,false],[false],[false,false],[false,false]];
		END_COPY = [
 					  ['copy-man0','copy-man1','copy-man2'],
 					  ['copy-woman0','copy-woman1','copy-woman2']
				   ],
		TIMES = ["","06:15:00","09:00:00","10:00:00","12:00:00","13:30:00","21:30:00","22:30:00"];

	var sp = new Sprite();

	var loadFlag = 1, loadAuto = setInterval(loadingEffect, 1000);

	wxShare({

		title : wxDefault,

		desc : wxDefault
	});

	preLoadHome();

	function loadingEffect(){

		var span = $('#loading').find('span');

		span.eq(loadFlag).css({opacity : 1});
		span.eq(0).css({opacity : 1});

		loadFlag++;

		if(loadFlag > 4){
			loadFlag = 1;
			span.css({opacity : 0});
			span.eq(0).css({opacity : 1});
		}
	}

	//预加载
	function preLoadHome(){

		var maleArr0 = picArr[0][0],
			femaleArr0 = picArr[0][1],
			maleArr1 = picArr[1][0],
			femaleArr1 = picArr[1][1],
			maleArr2 = picArr[2][0],
			homeImgArr = maleArr0.concat(femaleArr0),
			page2ImgArr = maleArr1.concat(femaleArr1),
			imgArr = homeImgArr.concat(page2ImgArr);

		imgArr.push('images/icon.png');
		imgArr.push('images/end.png');
		imgArr.push('images/font.png');

		//iPhone 4 page1适配
		if(isIphone4()){

			$('#page_img1>img').attr('src','images/page1_small.png');
			$('.page1-bg>img').attr('src','images/page2_small.png');

		}

		//可视区域高度小于1000px
		if(windowHeight > 1000){

			$('.page').each(function(index){

				if(index>0 && index < 5){

					$(this).find('.page-words').addClass('page-words2');
				}

			});
		}

		//魅族mx2
		if(!isIphone4() && windowHeight < 850){

			$('.p3-class').css({ top : "345px"});
			$('.p3-words').css({ top : "460px"});
			$('.p3-submit').css({ top : "550px"});
			$('.p2-content').find('img').css({ bottom : -150});
			$('.page-count').css({bottom : 120});
			$('.page-content-bottom').css({ "-webkit-transform" : 'scale(0.85)',"-webkit-transform-origin" : 'bottom'})
		}

		var load = new imgLoad.load({

			imageList : imgArr,

			success : function(){

				$('#p1').show();

				loading.hide();

				clearInterval(loadFlag);

				doDelay(100,init);

				new imgLoad.load({

					imageList : maleArr2

				}).init();
			}
		});

		load.init();
	}
	
	function isIphone4(){

		if(screenHeight === 480){
			return true;
		}else{
			return false;
		}
	}

	function init(){

		initPage1();

		doCount();

		doDelay(1900,seletSex);

		// goProduct($('#p1'));

		// goActivity($('#p1'));
		
	}

	//初始化游戏
	function initGame(){

		if(sex === 0){
			_smq.push(['custom','卡萨帝MLA移动-时间游戏页面','再算一次_男']);
		}else{
			_smq.push(['custom','卡萨帝MLA移动-时间游戏页面','再算一次_女']);
		}

		$('.page').hide();

		$('.page').eq(0).show();

		$('.page-num').html('01');
	}

	//活动页面再玩一次
	function playActAgain(){

		initGame();

		three.box3D($('#p3'), $('#p1'),'right',initPage1);
	}

	//产品页面再玩一次
	function playProAgain(){

		initGame();

		three.box3D($('#p2'), $('#p1'),'right',initPage1);
	}

	//跳转到产品页
	function goProduct(node){

		if(sex === 0){
			_smq.push(['custom','卡萨帝MLA移动-时间游戏页面','跳转-产品页_男']);
		}else{
			_smq.push(['custom','卡萨帝MLA移动-时间游戏页面','跳转-产品页_女']);
		}

		three.box3D(node, $('#p2'),'right',aniProduct);

		initProduct();
	}

	//初始化产品页
	function initProduct(){

		$('.p2-title').css({'-webkit-transform' : "translate3d(-40px,0,0)", 'opacity' : 0});
		$('.p2-logo').css({'-webkit-transform' : "translate3d(40px,0,0)", 'opacity' : 0});
		
	}

	//线下活动页面动画
	function aniProduct(){

		var length = $('.p2-content>div').length;

		$('.end-box').css({opacity : 0});

		$('.p2-title').animate({translate3d : '0,0,0', opacity : 1}, WORD_ANI_TIME, 'ease-out');
		$('.p2-logo').animate({translate3d : '0,0,0', opacity : 1}, WORD_ANI_TIME, 'ease-out');

		$('#p2_play_again').tap(function(){

			$(this).unbind('tap');

			playProAgain();
		});

		$('#p2_go_activity').tap(function(){

			$(this).unbind('tap');

			goActivity($('#p2'));
		});

		$('.p2-content>div').swipeLeft(moveProductLeft);
		$('.p2-content>div').swipeRight(moveProductRight);

		function moveProductLeft(){

			var index = $(this).index(),
				winW = $(window).width(),
				next,nextNode;


			next = index>=length-1 ? 0 : index+1;

			nextNode = $('.p2-content>div').eq(next);

			nextNode.css({ 'display' : 'block', '-webkit-transform' : 'translate3d(640px,0px,0px)'});


			$(this).animate({ translate3d : (-winW)+'px,0,0'}, WORD_ANI_TIME, 'ease-out');

			nextNode.animate({ translate3d : '0px,0,0'}, WORD_ANI_TIME, 'ease-out');
		}

		function moveProductRight(){

			var index = $(this).index(),
				winW = $(window).width(),
				next,nextNode;

			next = index<=0 ? length-1 : index-1;

			nextNode = $('.p2-content>div').eq(next);


			nextNode.css({ 'display' : 'block', '-webkit-transform' : 'translate3d(-640px,0px,0px)'});


			$(this).animate({ translate3d : (winW)+'px,0,0'}, WORD_ANI_TIME, 'ease-out');

			nextNode.animate({ translate3d : '0px,0,0'}, WORD_ANI_TIME, 'ease-out');
		}

		function addMonster(index){

			switch(index){

				case 0 :
					_smq.push(['custom','卡萨帝MLA移动-时间游戏页面','朗度冰箱']);
					break;
				case 1 :
					_smq.push(['custom','卡萨帝MLA移动-时间游戏页面','云裳洗衣机']);
					break;
				case 2 :
					_smq.push(['custom','卡萨帝MLA移动-时间游戏页面','博芬酒柜']);
					break;
				case 3 :
					_smq.push(['custom','卡萨帝MLA移动-时间游戏页面','冰吧']);
					break;
			}
		}
	}

	//跳转到线下活动页面
	function goActivity(node){

		if(sex === 0){
			_smq.push(['custom','卡萨帝MLA移动-时间游戏页面','线下活动_男']);
		}else{
			_smq.push(['custom','卡萨帝MLA移动-时间游戏页面','线下活动_女']);
		}

		three.box3D(node, $('#p3'),'left',aniActivity);

		initActivity();
	}

	//初始化线下活动页面
	function initActivity(){

		$('.p3-title').css({'-webkit-transform' : "translate3d(-40px,0,0)", 'opacity' : 0});
		$('.p3-logo').css({'-webkit-transform' : "translate3d(40px,0,0)", 'opacity' : 0});
		$('.p3-time').css({'-webkit-transform' : "translate3d(40px,0,0)", 'opacity' : 0});
		$('.p3-class').css({'-webkit-transform' : "translate3d(0,40px,0)", 'opacity' : 0});
		$('.p3-words').css({'-webkit-transform' : "translate3d(0,40px,0)", 'opacity' : 0});
		$('.p3-submit').css({'-webkit-transform' : "translate3d(0,40px,0)", 'opacity' : 0});
	}

	//线下活动页面动画
	function aniActivity(){

		var t = 100;

		$('.end-box').css({opacity : 0});

		$('#p3 .p-icon').each(function(){

			var self = this;

			doDelay(t,function(){

				$(self).animate({translate3d : '0,0,0', opacity : 1}, WORD_ANI_TIME, 'ease-out');
			});

			t += 200;
		});

		doDelay(1500,function(){


			$('#p3_play_again').tap(function(){

				$(this).unbind('tap');

				playActAgain();
			});

			$('#p3_submit').tap(submitInfo);

			$('.p3-time').tap(function(){

				$(this).unbind('tap');

				goProduct($('#p3'));
			});
		});
	}

	//提交报名信息
	function submitInfo(){

		var name = $('#name').val(),
			mobile = $('#mobile').val();

		

		if(!name){

			showTips("请输入姓名！");
			return;
		}

		if(!mobile){

			showTips("请输入手机号！");
			return;

		}else if(mobile.length !== 11){

			showTips("手机号输入有误！");
			return;
		}

		$(this).unbind('tap');

		_smq.push(['custom','卡萨帝MLA移动-时间游戏页面','立即提交']);

		$.ajax({

			url : "interface.php?act=doSaveInfo",

			type : "post",

			data : { userName : name, mobile : mobile},

			success : function(d){

				var data = $.parseJSON(d);

				if(data.status === 1){

					showTips('报名成功！');

					 $('#name').val('');

					 $('#mobile').val('');
				}else if(data.status === 2){

					showTips('您已经报名，请不要重复提交！');

				}else{

					showTips('报名失败！');
					
				}

				$('#p3_submit').tap(submitInfo);
			}
		})

	}

	//选择性别
	function seletSex(){

		p1Content.swipeLeft(function(){
			_smq.push(['custom','卡萨帝MLA移动-时间游戏页面','滑动-选择性别']);
			changeSexAni('left');
		});
		p1Content.swipeRight(function(){
			_smq.push(['custom','卡萨帝MLA移动-时间游戏页面','滑动-选择性别']);
			changeSexAni('right');
		});
	}

	function copyArr(array){

		var arr = [];

		for(var i = 0; i<array.length; i++){

			var a = array[i];

			arr.push(a)
		}

		return arr;
	}

	//改变性别
	function changeSexAni(lang){

		var maleArr0 = picArr[0][0],
			femaleArr0 = picArr[0][1],
			bg1,bg2,arr,arr1,arr2;

		arr1 = copyArr(maleArr0);
		arr2 = copyArr(femaleArr0);


		if(isIphone4()){
			bg1 = 'images/page2_small.png';
			bg2 = 'images/page1_small.png';
		}else{
			bg1 = 'images/page1_w.png';
			bg2 = 'images/page1_m.png'
		}

		if(sp.ani){
			return;
		}

		if(sex === 0){

			if(lang == 'right'){
				arr1 = arr2.reverse();
			}
			
			sp.start({

				img : $('#head')[0],

				url : arr1,

				time : 60,

				result : function(){

					$('#page_img1').css({opacity : 1});

					$('#page_img1>img').attr('src',bg1);

					$('.page1-bg>img').attr('src', bg2);
				}
			});

			sex = 1;
		}else{

			if(lang == 'right'){
				arr2 = arr1.reverse();
			}

			sp.start({

				img : $('#head')[0],

				url : arr2,

				time : 60,

				result : function(){

					$('#page_img1').css({opacity : 1});

					$('#page_img1>img').attr('src',bg2);

					$('.page1-bg>img').attr('src', bg1);
				}
			});

			sex = 0;
		}

		$('#page_img1').animate({'opacity':0},660,'ease-out');
	}

	//设置每页的动画

	function setPageAni(handler){

		
		var img = $('.page').eq(pageNum).find('.page-img>img'),
			arr =  picArr[pageNum].length>1 ? picArr[pageNum][sex] : picArr[pageNum][0],
			handler = handler || function(){};

		sp.start({

			img : img[0],

			url : arr,

			time : 140,

			result : handler
		});
	}

	//初始化首页
	function initPage1(){

		var div = p1Content.find('div'),
			head = $('.page1-head'),
			t = 200, delay = 200;

		if(sexFlag){

			sexFlag = false;

			head.css({'-webkit-transform' : "translate3d(0,30px,0)", opacity : 0});

			head.animate({translate3d : '0,0,0', opacity : 1}, WORD_ANI_TIME, 'ease-out',function(){

				changeSexAni('left');
				doDelay(800, function(){

					changeSexAni('left');
				});

			});

			delay = 1600;

		}else{

			head.animate({translate3d : '0,0,0', opacity : 1}, WORD_ANI_TIME, 'ease-out');

			
		}

		doDelay(delay, function(){

			div.css({'-webkit-transform' : "translate3d(0,40px,0)", opacity : 0});

			div.each(function(index){

				var self = this;

				doDelay(t, function(){

					$(self).animate({translate3d : '0,0,0', opacity : 1}, WORD_ANI_TIME, 'ease-out');
					
				});

				t += 200;

			});

			page1Btn.tap(function(){

				if(sex === 0 ){
					_smq.push(['custom','卡萨帝MLA移动-时间游戏页面','开始计算_男']);
				}else{
					_smq.push(['custom','卡萨帝MLA移动-时间游戏页面','开始计算_女']);
				}
				

				page1Btn.unbind('tap');

				fromPage1ToPage2(div);
			});

		});

		prePageNum = 0;
		pageNum = 1;
	}

	//第一页切换至第二页
	function fromPage1ToPage2(div){

		var t = 100,
			head = $('.page1-head'),
			length = div.length;

		preLoadAniPic();

		page2Img.find('img').attr('src', picArr[1][sex][0]);

		div.each(function(index){

			var self = this;

			doDelay(t, function(){

				$(div).eq(length-index-1).animate({translate3d : '0,40px,0', opacity : 0}, WORD_ANI_TIME, 'ease-out');

			});

			t += 300;

		});

		doDelay(t, function(){

			head.animate({translate3d : '0,40px,0', opacity : 0}, WORD_ANI_TIME, 'ease-out',function(){

				three.change3D(page1Img, page2Img, function(){

						setPageAni(function(){

							initPage($('#page2'), function(){

								showGameTips();
								bindPageBtn(1);
							});
						});			
					
				});
			});
		});
		
	}

	function showGameTips(){

		try{
			var flag = localStorage.firstLogin ? true : false;

		}catch(e){

			var flag = false;
		}
		

		if(!flag){

			if(sex === 1){

				$('#game_tips').addClass('game-tips2');
			}

			$('#game_tips').css({ '-webkit-transform' : 'translate3d(0,-40px,0)', 'display' : 'block'});
			$('.game-tips-mask').fadeIn(500);

			$('#game_tips').animate({ translate3d : '0,0,0', opacity : 1},500,'ease-out');

			$('.game-tips-close').tap(function(){

				$('#game_tips').animate({ translate3d : '0,40px,0', opacity : 0},500,'ease-out',function(){

					$(this).hide();
				});

				$('.game-tips-mask').fadeOut(500);
			});

			localStorage.firstLogin = 1;
		}
	}

	//初始化第n页
	function initPage(parent, bindHandler){

		var index = parent.index(),
			topContent = parent.find('.page-content-top'),
			bottomContent = parent.find('.page-content-bottom'),
			content = parent.find('.page-content'),
			div = content.find('div').find('div'),
			div1 = topContent.find('div').eq(0),
			div2 = bottomContent.find('div'),
			t = 100;

		$('.page').eq(pageNum).find('.day-time').html(TIMES[pageNum]);

		div.css({'-webkit-transform' : "translate3d(0,40px,0)", opacity : 0});

		div1.css({'-webkit-transform' : "translate3d(0,-40px,0)", opacity : 0});
		
		div.each(doAnimate);

		//时间
		doDelay(500,function(){

			clearAutoTime();

			setAutoTime(pageNum);
		});

		function doAnimate(index){

			var self = this;

			doDelay(t, function(){

				$(self).animate({translate3d : '0,0,0', opacity : 1}, WORD_ANI_TIME, 'ease-out');
				
			});

			t += WAIT_TIME;

		}

		bindHandler && doDelay(t+200, bindHandler);
		
	}

	//页面切换
	function fromPageToPage(parent, lang, bindHandler, isEnd){

		var t = 200,
			content = parent.find('.page-content'),
			index = parent.index(),
			div = content.find('div').find('div'),
			length = div.length,
			page1 = parent.find('.page-img'),
			page2 = lang == "right" ? parent.next() : parent.prev(),
			page2 = page2.find('.page-img');

		div.each(doAnimate);

		prePageNum = pageNum;

		pageNum = lang == "right" ? index+1 : index-1;

		try{

			$('.page').eq(pageNum).find('.page-img>img').attr('src', picArr[pageNum][sex][0]);

		}catch(e){

			$('.page').eq(pageNum).find('.page-img>img').attr('src', picArr[pageNum][0][0]);
		}
		

		preLoadAniPic();

		if(sex === 0){

			switch(pageNum){
				case 1 :
					_smq.push(['custom','卡萨帝MLA移动-时间游戏页面','翻页-上班时间_男']);
					break;
				case 2 :
					_smq.push(['custom','卡萨帝MLA移动-时间游戏页面','翻页-工作时间_男']);
					break;
				case 3 :
					_smq.push(['custom','卡萨帝MLA移动-时间游戏页面','翻页-会议时间_男']);
					break;
				case 4 :
					_smq.push(['custom','卡萨帝MLA移动-时间游戏页面','翻页-午餐时间_男']);
					break;
				case 5 :
					_smq.push(['custom','卡萨帝MLA移动-时间游戏页面','翻页-卫生间时间_男']);
					break;
				case 6 :
					_smq.push(['custom','卡萨帝MLA移动-时间游戏页面','翻页-应酬时间_男']);
					break;
				case 7 :
					_smq.push(['custom','卡萨帝MLA移动-时间游戏页面','翻页-睡觉时间_男']);
					break;
				case 8 :
					_smq.push(['custom','卡萨帝MLA移动-时间游戏页面','翻页-结果页_男']);
					break;
			}

		}else{

			switch(pageNum){

				case 1 :
					_smq.push(['custom','卡萨帝MLA移动-时间游戏页面','翻页-上班时间_女']);
					break;
				case 2 :
					_smq.push(['custom','卡萨帝MLA移动-时间游戏页面','翻页-工作时间_女']);
					break;
				case 3 :
					_smq.push(['custom','卡萨帝MLA移动-时间游戏页面','翻页-会议时间_女']);
					break;
				case 4 :
					_smq.push(['custom','卡萨帝MLA移动-时间游戏页面','翻页-午餐时间_女']);
					break;
				case 5 :
					_smq.push(['custom','卡萨帝MLA移动-时间游戏页面','翻页-卫生间时间_女']);
					break;
				case 6 :
					_smq.push(['custom','卡萨帝MLA移动-时间游戏页面','翻页-应酬时间_女']);
					break;
				case 7 :
					_smq.push(['custom','卡萨帝MLA移动-时间游戏页面','翻页-睡觉时间_女']);
					break;
				case 8 :
					_smq.push(['custom','卡萨帝MLA移动-时间游戏页面','翻页-结果页_女']);
					break;
			}
		}

		function doAnimate(index){

			var self = this;

			doDelay(t, function(){

				var y = index < div.length-2 ? 40 : -40;
				

				$(div).eq(length-index-1).animate({translate3d : '0,'+y+'px,0', opacity : 0}, WORD_ANI_TIME, 'ease-out',function(){

					if(index === length-1){

						three.change3D(page1, page2, function(){

							setPageAni(function(){
							
								if(isEnd){
									bindHandler()
								}else{
									initPage(page2.parent(), bindHandler)
								}
							});
							
						});
					}
				});

			});

			t += WAIT_TIME;

		}
	}

	//绑定每页的按钮
	function bindPageBtn(page){

		var p = $('.page').eq(page),
			btn = p.find('#page2_btn'),
			btn1 = p.find('.page-next1'),
			btn2 = p.find('.page-next2');

		if(page<7){

			$('.page').eq(page).swipeLeft(goNextPage);

		}else if(page == 7){

			$('.page').eq(page).swipeLeft(function(){

				$(this).unbind();

				fromPageToPage(p, 'right', initPage9, true);
			});
		}
		
		if(page>1 && page <8){
			$('.page').eq(page).swipeRight(goPrevPage);
		}
		

		//第二页按钮
		if(btn.length>0){

			btn.tap(goNextPage);
		}

		if(btn1.length>0){

			btn1.tap(goPrevPage);
		}

		if(btn2.length>0){

			btn2.tap(function(){

				if(page == 7){
					$(this).unbind();
					fromPageToPage(p, 'right', initPage9, true);
					return;
				}else{
					goNextPage();
				}
				
				
			});
		}

		function goNextPage(){

			$('.page').unbind();
			$('.page-next').unbind();
			//跳转到第page+1页
			fromPageToPage(p, 'right', function(){
				bindPageBtn(page+1);
			});
		}

		function goPrevPage(){

			$('.page').unbind();
			$('.page-next').unbind();
			//跳转到第page-1页
			fromPageToPage(p, 'left', function(){
				bindPageBtn(page-1);
			});
		}
	}
	

	//初始化尾页
	function initPage9(){

		var box = $('#page9').find('.page-content').find('.end-box').eq(sex),
			score = getScore(),
			noscore = 24-score,
			sScore = 0,
			sNoscore = 24,
			copy = getEndCopy(noscore);

		pageNum = 8;

		// box.css({'display' : 'block'});

		box.find('.end-icon').attr('class', 'end-icon');

		if(sex === 0){

			var cla = noscore <= 2 ? "end-icon4" : "end-icon3";
		}else{
			var cla = noscore <= 2 ? "end-icon2" : "end-icon";
		}

		box.find('.end-icon').addClass(cla);

		box.find('.end-dotime').text(changeTime(sScore));

		box.find('.end-notime').text(changeTime(sNoscore));

		doDelay(500,function(){

			var autoT = setInterval(function(){

				var time = changeTime(sScore);

				box.find('.end-dotime').text(time);

				sScore++;

				if(sScore > score){
					clearInterval(autoT);
				}

			},60);

			var autoNT = setInterval(function(){

				var notime = changeTime(sNoscore);
				
				box.find('.end-notime').text(notime);

				sNoscore--;

				if(sNoscore < noscore){
					clearInterval(autoNT);
				}

			},60);
		});
		
		box.find('.end-words').html('<div class="'+END_COPY[sex][copy]+'"></div>');

		box.css({'-webkit-transform' : "translate3d(0,60px,0)", opacity : 0});
		
		box.animate({translate3d : '0,0,0', opacity : 1}, WORD_ANI_TIME);

		//跳转活动页面
		$('.end-activity').tap(function(){

			$(this).unbind('tap');

			goActivity($('#p1'));
		});

		$('.end-again').tap(fromPage9ToPage1);

		$('.end-product').tap(function(){

			$(this).unbind('tap');

			goProduct($('#p1'));
		});

		var wxCopy = getShareCopy(noscore);

		wxShare({

			title : wxCopy,

			desc : wxCopy
		});

		function fromPage9ToPage1(){

			if(sex === 0){
				_smq.push(['custom','卡萨帝MLA移动-时间游戏页面','再算一次_男']);
			}else{
				_smq.push(['custom','卡萨帝MLA移动-时间游戏页面','再算一次_女']);
			}

			$(this).unbind('tap');

			box.animate({translate3d : '0,-60px,0', opacity : 0}, WORD_ANI_TIME,function(){

				three.change3D(page9Img, page1Img, initPage1);
			});
		}
	}

	//算总时间
	function getScore(){

		var score = 0,
			num = $('.page-num');

		num.each(function(){

			var s = parseInt($(this).text());

			score += s;
		});

		return score;
	}

	//根据时间获取结果copy
	function getEndCopy(score){

		var copy = "";

		if(score <= 0){
			copy = 0;
		}else if(score <= 2){
			copy = 1;
		}else{
			copy = 2;
		}

		return copy;
	}

	//数字转化成时间格式
	function changeTime(num){

		var time;

		if(num>=0){

			time = num < 10 ? "0"+num : num ;

		}else{

			time = num > -10 ? "-0"+Math.abs(num) : "-"+Math.abs(num);
		}
		
		time += ":00:00";

		return time;
	}

	//时间加减
	function doCount(){

		$('.page-minus').tap(minusTime);

		$('.page-plus').tap(plusTime);

		$('.page-count').swipeUp(plusTime);

		$('.page-count').swipeDown(minusTime);

		function minusTime(){

			if($(this).hasClass('page-count')){

				var num = $(this).find('.page-num');
			}else{
				var num = $(this).next();
			}

			var n = parseInt(num.text());

			if(n<=1){
				return;
			}

			if(sex === 0){
				_smq.push(['custom','卡萨帝MLA移动-时间游戏页面','时间-减少_男']);

			}else{
				_smq.push(['custom','卡萨帝MLA移动-时间游戏页面','时间-减少_女']);

			}

			n--;

			n = n < 10 ? '0'+n : n;

			num.html(n);
		
		}

		function plusTime(){

			if($(this).hasClass('page-count')){

				var num = $(this).find('.page-num');
			}else{
				var num = $(this).prev();
			}

			var n = parseInt(num.text());

			if(n>=24){
				return;
			}



			if(sex === 0){
				_smq.push(['custom','卡萨帝MLA移动-时间游戏页面','时间-增加_男']);

			}else{
				_smq.push(['custom','卡萨帝MLA移动-时间游戏页面','时间-增加_女']);

			}

			n++;

			n = n < 10 ? '0'+n : n;

			num.html(n);
			
		}
	}

	

	//预加载page+2页动画
	function preLoadAniPic(){

		var num = pageNum+2,
			flag,s ;

		if(num > 8){
			return;
		}

		var arr = picArr[pageNum],
			arr1 = picArr[pageNum+1],
			arr2 = picArr[pageNum+2];

		if(arr.length == 2){
			arr = arr[sex];
		}else{
			arr = arr[0];
		}

		if(arr2.length == 2){
			arr2 = arr2[sex];
		}else{
			arr2 = arr2[0];
		}
	
		$('.page').eq(pageNum).find('.page-img img').attr('src',arr[0]);
		// $('.page').eq(num).find('.page-img img').attr('src',arr2[0]);

		if(prePageNum > pageNum){

			return;
		}

		new imgLoad.load({

			imageList : arr2

		}).init();

	}

	//设置时间自动更新
	var auto,gTime;

	function setAutoTime(page){

		var time = TIMES[page],
			p = /(\d{2}):(\d{2}):(\d{2})/,
			m = time.match(p),
			date = new Date(),
			ntime;

		date.setHours(parseInt(m[1]));
		date.setMinutes(parseInt(m[2]));
		date.setSeconds(parseInt(m[3]));

		gTime = getSecond(date);

		auto = setInterval(function(){

			if(pageNum >= 8){
				clearAutoTime();
			}

			var ntime = getFormatTime();

			$('.page').eq(page).find('.day-time').html(ntime);

		},1000);
	}

	function clearAutoTime(){

		clearInterval(auto);
	}

	//将秒转化成时间
	function getFormatTime(){

		gTime++;

		var t,
			h = parseInt(gTime/3600),
			m = parseInt((gTime%3600)/60),
			s = parseInt((gTime%3600)%60);

		h = h<10? "0"+h : h;
		m = m<10? "0"+m : m;
		s = s<10? "0"+s : s;

		t = h + ":" + m + ":" +s;

		return t;
	}	

	//根据时间获取秒数
	function getSecond(date){

		var h = date.getHours(),
			m = date.getMinutes(),
			s = date.getSeconds();

		var t = h*3600 + m*60 + s;

		return t;
	}	

	//提示
	function showTips(tips){
		
		if($('.pub-tips').length>0){
			return;
		}
		
		var div=document.createElement('div'),
			winW=$(window).width(),
			winH=$(window).height();

		div.className="pub-tips";
		div.innerHTML=tips;

		$('body').append($(div));

		$(div).css({left:(winW-$(div).width())/2,top:winH});

		

		$(div).animate({'translate3d':'0,-200px,0'},'ease-out',400,function(){

			setTimeout(function(){

				$(div).remove();

			},500);

		});
	}

	function doDelay(time, handler){

		setTimeout(handler, time);
	}

	function getShareCopy(score){

		var copy = [], str;

		copy.push('每天我有'+score+'小时用来爱，24小时我完全不够用！已回米勒星。');
		copy.push('每天我有'+score+'小时用来爱。不是超人，但是超忙。');
		copy.push('每天我有'+score+'小时用来爱。今晚，烛光大餐我来掌勺。');

		if(score <= 0){

			str = copy[0];

		}else if(score <=2){

			str = copy[1];

		}else{

			str = copy[2];
		}

		return str;
	}

	function wxShare(confing){
	
		var confing=confing||{},
			imgUrl='http://app.goddreamer.com/client/csd/images/share.jpg',
			url=confing.url||location.href,
			title=confing.title||'',
			desc=confing.desc||'';
		
		var dataForWeixin={
		   appId:"",
		   MsgImg:imgUrl,
		   TLImg:imgUrl,
		   url:url,
		   title:title,
		   desc:desc,
		   timeline:title,
		   timelineDesc:desc,
		   fakeid:"",
		   callback:function(){}
		};
		(function(){
		   var onBridgeReady=function(){
		   WeixinJSBridge.on('menu:share:appmessage', function(argv){
		      WeixinJSBridge.invoke('sendAppMessage',{
		         "appid":dataForWeixin.appId,
		         "img_url":dataForWeixin.MsgImg,
		         "img_width":"120",
		         "img_height":"120",
		         "link":dataForWeixin.url,
		         "desc":dataForWeixin.desc,
		         "title":dataForWeixin.title
		      }, function(res){(dataForWeixin.callback)();});
		   });
		   WeixinJSBridge.on('menu:share:timeline', function(argv){
		      (dataForWeixin.callback)();
		      WeixinJSBridge.invoke('shareTimeline',{
		         "img_url":dataForWeixin.TLImg,
		         "img_width":"120",
		         "img_height":"120",
		         "link":dataForWeixin.url,
		         "desc":dataForWeixin.timelineDesc,
		         "title":dataForWeixin.timeline
		      }, function(res){});
		   });
		   WeixinJSBridge.on('menu:share:weibo', function(argv){
		      WeixinJSBridge.invoke('shareWeibo',{
		         "content":dataForWeixin.title,
		         "url":dataForWeixin.url
		      }, function(res){(dataForWeixin.callback)();});
		   });
		   WeixinJSBridge.on('menu:share:facebook', function(argv){
		      (dataForWeixin.callback)();
		      WeixinJSBridge.invoke('shareFB',{
		         "img_url":dataForWeixin.TLImg,
		         "img_width":"120",
		         "img_height":"120",
		         "link":dataForWeixin.url,
		         "desc":dataForWeixin.desc,
		         "title":dataForWeixin.title
		      }, function(res){});
		   });
		   //WeixinJSBridge.call('hideToolbar');
		};

		try{
			onBridgeReady();
		}catch(e){
			
		}
		
		if(document.addEventListener){
		   document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
		}else if(document.attachEvent){
		   document.attachEvent('WeixinJSBridgeReady'   , onBridgeReady);
		   document.attachEvent('onWeixinJSBridgeReady' , onBridgeReady);
		}
		})();
	}

	$('body').bind('touchmove',function(e){

		e.preventDefault();
	});
}); 