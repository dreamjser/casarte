define([], function() {


	var picArr = [],
		picNum = [11, 22, 15, 16, 17, 11, 16, 16, 11], //序列帧图片数量
		picSex = [0, 0, 1, 0, 1, 0, 1, 0, 0]; //是否有性别区分 0-有 1-没有

	for (var i = 0; i < 9; i++) {

		var arr = [],
			len = picNum[i],
			sex = picSex[i],
			arr1 = [],
			arr2 = [];

		for (var j = 0; j < len; j++) {

			var pic1, pic2;

			if (sex === 0) {

				pic1 = 'images/animate/' + i + '_0/' + j + '.jpg',
					pic2 = 'images/animate/' + i + '_1/' + j + '.jpg';

			} else {

				pic1 = 'images/animate/' + i + '/' + j + '.jpg';
				pic2 = '';
			}

			arr1.push(pic1);
			if (pic2 != '') {
				arr2.push(pic2);
			}

		}

		arr.push(arr1);

		if (arr2.length !== 0) {
			arr.push(arr2);
		}

		picArr.push(arr);
	}

	return {

		picArr: picArr
	}
});