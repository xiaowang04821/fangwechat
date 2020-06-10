import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

let lifeData = {};

try {
	// 尝试获取本地是否存在lifeData变量，第一次启动APP时是不存在的
	lifeData = uni.getStorageSync('lifeData');
} catch (e) {

}

// 需要永久存储，且下次APP启动需要取出的，在state中的变量名
let saveStateKeys = ['_user_info', '_token'];

// 保存变量到本地存储中
const saveLifeData = function(key, value) {
	// 判断变量名是否在需要存储的数组中
	if (saveStateKeys.indexOf(key) != -1) {
		// 获取本地存储的lifeData对象，将变量添加到对象中
		let tmp = uni.getStorageSync('lifeData');
		// 第一次打开APP，不存在lifeData变量，故放一个{}空对象
		tmp = tmp ? tmp : {};
		tmp[key] = value;
		// 执行这一步后，所有需要存储的变量，都挂载在本地的lifeData对象中
		uni.setStorageSync('lifeData', tmp);
	}
}
const store = new Vuex.Store({
	state: {
		// 如果上面从本地获取的lifeData对象下有对应的属性，就赋值给state中对应的变量
		_user_info: lifeData._user_info ? lifeData._user_info : {
			headImg: require('@/static/image/huge.jpg'), //头像
			id: 1, //id
			userName: 'DR', //昵称
			wechatNumber: 'October', //微信号
			signature: 'who do you want to meet.', //个性签名
			phone: '13535351112', //手机号
			pictureBanner: require('@/static/image/circleBanner/3.jpg'), //相册背景图
			chatBgImg: require('@/static/image/Ran.jpg'), //聊天背景图
			address: "河南郑州"
		},
		_token: lifeData._token ? lifeData._token : '',
		// 如果vuex_version无需保存到本地永久存储，无需lifeData.vuex_version方式
		vuex_version: '1.0.1',
		//朋友圈展示信息
		circleData: [{
				circleMegId: 1,
				userId: 2,
				userName: "陈冠希",
				createTime: "2分钟前",
				userHeadImg: require('@/static/image/guanxi.jpg'),
				content: "今天心情好，出去吃烧烤哈哈哈哈哈哈哈哈哈哈哈。今天心情好，出去吃烧烤哈哈哈哈哈哈哈哈哈哈哈。今天心情好，出去吃烧烤哈哈哈哈哈哈哈哈哈哈哈。",
				imageList: [
					require('@/static/image/circle/1.jpg')
				],
				isPraise: false,
				praise: [{
						id: 2,
						userName: '陈冠希'
					},
					{
						id: 3,
						userName: "迪丽热巴"
					}
				],
				comment:[
					{ userId:"2",userName:"陈冠希",content:"也太好吃了8" },
					{ userId:"3",userName:"迪丽热巴",content:"？？所以烧烤照片呢" },
					{ userId:"1",userName:"DR",content:"他就在这得瑟呢" ,replyUserId:"3",replyUserName:"迪丽热巴"}
				]
			},
			{
				circleMegId: 2,
				userId: 3,
				userName: "迪丽热巴",
				createTime: "1小时前",
				userHeadImg: require('@/static/image/girl.jpg'),
				content: "我拍的！",
				imageList: [
					require('@/static/image/circle/2.jpg'),
					require('@/static/image/circle/3.jpg'),
					require('@/static/image/circle/4.jpg'),
					require('@/static/image/circle/5.jpg'),
				],
				isPraise: true,
				praise: [{
					id: 1,
					userName: 'DR'
				}, {
					id: 3,
					userName: "迪丽热巴"
				}],
				comment:[]
			},
			{
				circleMegId: 3,
				userId: 4,
				userName: "小贱贱",
				createTime: "昨天",
				userHeadImg: require('@/static/image/boy.jpg'),
				content: "。。。我tm直接痴呆",
				imageList: [],
				isPraise: false,
				praise: [],
				comment:[
					{ userId:"4",userName:"小贱贱",content:"出门发现钥匙锁家里了" },
				]
			},
		],
		//我的朋友
		firendList: [{
				userId: 2,
				userName: "陈冠希",
				wechatNumber: 'chenguanxi',
				headImg: require('@/static/image/guanxi.jpg'),
				signature: '我最帅，不接受反驳',
				pictureBanner: require('@/static/image//circleBanner/2.jpg'),
				show: false,
				isTop: true,
				address: "中国香港"
			},
			{
				userId: 3,
				userName: "迪丽热巴",
				wechatNumber: 'reba',
				headImg: require('@/static/image/girl.jpg'),
				signature: '我最美，不接受反驳',
				pictureBanner: require('@/static/image//circleBanner/4.jpg'),
				show: false,
				address: "新疆维吾尔自治区"
			},
			{
				userId: 4,
				userName: "小贱贱",
				wechatNumber: 'xiaojianjian',
				headImg: require('@/static/image/boy.jpg'),
				signature: '我最贱，不接受反驳',
				pictureBanner: require('@/static/image//circleBanner/1.jpg'),
				show: false,
				address: "美利坚合众国"
			},
		],
		//内置朋友圈相册banner图
		circleBgList:[
			{ src:require('@/static/image/circleBanner/1.jpg'),isCheck:false },
			{ src:require('@/static/image/circleBanner/2.jpg'),isCheck:false },
			{ src:require('@/static/image/circleBanner/3.jpg'),isCheck:false },
			{ src:require('@/static/image/circleBanner/4.jpg'),isCheck:false },
		]
	},
	mutations: {
		$uStore(state, payload) {
			// 判断是否多层级调用，state中为对象存在的情况，诸如user.info.score = 1
			let nameArr = payload.name.split('.');
			let saveKey = '';
			let len = nameArr.length;
			if (nameArr.length >= 2) {
				let obj = state[nameArr[0]];
				for (let i = 1; i < len - 1; i++) {
					obj = obj[nameArr[i]];
				}
				obj[nameArr[len - 1]] = payload.value;
				saveKey = nameArr[0];
			} else {
				// 单层级变量，在state就是一个普通变量的情况
				state[payload.name] = payload.value;
				saveKey = payload.name;
			}
			// 保存变量到本地，见顶部函数定义
			saveLifeData(saveKey, state[saveKey])
		},
	},
	
})

export default store
