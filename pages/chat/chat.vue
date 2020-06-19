<template>
	<view class="content">
		<view class="content-box" @touchstart="touchstart" id="content-box">
			<!-- 背景图- 定位方式 -->
			<image class="content-box-bg" :src="_user_info.chatBgImg" :style="{ height: imgHeight }"></image>
			<view class="content-box-loading" v-if="!loading"><u-loading mode="flower"></u-loading></view>
			<view class="message" v-for="(item, index) in messageList" :key="index" :id="`msg-${item.hasBeenSentId}`">
				<view class="message-item " :class="item.isItMe ? 'right' : 'left'">
					<image class="img" :src="item.fromUserHeadImg" mode="" @tap="linkToBusinessCard(item.fromUserId)"></image>
					<!-- contentType = 1 文本 -->
					<view class="content" v-if="item.contentType == 1">{{ item.content }}</view>
					<!-- contentType = 2 语音 -->
					<view
						class="content contentType2"
						:class="[{ 'content-type-right': item.isItMe }]"
						v-if="item.contentType == 2"
						@tap="handleAudio(item)"
						hover-class="contentType2-hover-class"
						:style="{width:`${130+(item.contentDuration*2)}rpx`}"
					>
						<view
							class="voice_icon"
							:class="[
								{ voice_icon_right: item.isItMe },
								{ voice_icon_left: !item.isItMe },
								{ voice_icon_right_an: item.anmitionPlay && item.isItMe },
								{ voice_icon_left_an: item.anmitionPlay && !item.isItMe }
							]"
						></view>
						<view class="">{{ item.contentDuration }}''</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部聊天输入框 -->
		<view class="input-box" :class="{ 'input-box-mpInputMargin': mpInputMargin }">
			<view class="input-box-flex">
				<!-- #ifndef H5 -->
				<image v-if="chatType === 'voice'" class="icon_img" :src="require('@/static/voice.png')" mode="" @click="switchChatType('keyboard')"></image>
				<image v-if="chatType === 'keyboard'" class="icon_img" :src="require('@/static/keyboard.png')" mode="" @click="switchChatType('voice')"></image>
				<!-- #endif -->
				<view class="input-box-flex-grow">
					<input
						v-if="chatType === 'keyboard'"
						type="text"
						class="content"
						id="input"
						v-model="formData.content"
						:hold-keyboard="true"
						:confirm-type="'send'"
						:confirm-hold="true"
						placeholder-style="color:#DDDDDD;"
						:cursor-spacing="6"
						@confirm="sendMsg(null)"
					/>
					<view
						class="voice_title"
						v-if="chatType === 'voice'"
						:style="{ background: recording ? '#c7c6c6' : '#FFFFFF' }"
						@touchstart.stop.prevent="startVoice"
						@touchmove.stop.prevent="moveVoice"
						@touchend.stop="endVoice"
						@touchcancel.stop="cancelVoice"
					>
						{{ voiceTitle }}
					</view>
				</view>
				<!-- #ifdef H5 || MP-WEIXIN --> 
				<button class="btn" type="primary" size="mini" @touchend.prevent="sendMsg(null)">发送</button>
				<!-- #endif -->
			</view>
		</view>
		
		<!-- //语音动画 -->
		<view class="voice_an"  v-if="recording">
			<view class="voice_an_icon">
				<view id="one" class="wave"></view>
				<view id="two" class="wave"></view>
				<view id="three" class="wave"></view>
				<view id="four" class="wave"></view>
				<view id="five" class="wave"></view>
				<view id="six" class="wave"></view>
				<view id="seven" class="wave"></view>
			</view>
			<view class="text">{{voiceIconText}}</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			fromUserInfo: {},
			formData: {
				content: '',
				limit: 15,
				index: 1
			},
			messageList: [],
			loading: true, //标识是否正在获取数据
			imgHeight: '1000px',
			mpInputMargin: false, //适配微信小程序 底部输入框高度被顶起的问题
			chatType:"keyboard",  // 'voice'语音 'keyboard'键盘
			voiceTitle: '按住 说话',
			Recorder: uni.getRecorderManager(),
			Audio: uni.createInnerAudioContext(),
			recording: false, //标识是否正在录音
			isStopVoice: false, //加锁 防止点击过快引起的当录音正在准备(还没有开始录音)的时候,却调用了stop方法但并不能阻止录音的问题
			voiceInterval:null,
			voiceTime:0, //总共录音时长
			canSend:true, //是否可以发送
			PointY:0, //坐标位置
			voiceIconText:"正在录音..."
		};
	},
	methods: {
		//拼接消息 处理滚动
		async joinData() {
			if (!this.loading) {
				//如果没有获取数据 即loading为false时，return 避免用户重复上拉触发加载
				return;
			}
			this.loading = false;
			const data = await this.getMessageData();
			//获取节点信息
			const { index } = this.formData;
			const sel = `#msg-${index > 1 ? this.messageList[0].hasBeenSentId : data[data.length - 1].hasBeenSentId}`;
			this.messageList = [...data, ...this.messageList];
			//填充数据后，视图会自动滚动到最上面一层然后瞬间再跳回bindScroll的指定位置 ---体验不是很好，后期优化
			this.$nextTick(() => {
				this.bindScroll(sel);
				//如果还有数据
				if (this.formData.limit >= data.length) {
					this.formData.index++;
					setTimeout(() => {
						this.loading = true;
					}, 200);
				}
			});
		},
		//处理滚动
		bindScroll(sel, duration = 0) {
			const query = uni.createSelectorQuery().in(this);
			query
				.select(sel)
				.boundingClientRect(data => {
					uni.pageScrollTo({
						scrollTop: data && data.top - 40,
						duration
					});
				})
				.exec();
		},
		//获取消息
		getMessageData() {
			let getData = () => {
				let arr = [];
				let startIndex = (this.formData.index - 1) * this.formData.limit;
				let endIndex = startIndex + this.formData.limit;
				for (let i = startIndex; i < endIndex; i++) {
					const isItMe = Math.random() > 0.5 ? true : false;
					arr.unshift({
						hasBeenSentId: i, //已发送过去消息的id
						content: `很高兴认识你，这是第${i + 1}条消息。`,
						fromUserHeadImg: isItMe ? this._user_info.headImg : this.fromUserInfo.fromUserHeadImg, //用户头像
						fromUserId: isItMe ? this._user_info.id : this.fromUserInfo.fromUserId,
						isItMe, //true此条信息是我发送的 false别人发送的
						createTime: Date.now(),
						contentType: 1, // 1文字文本 2语音
						anmitionPlay: false //标识音频是否在播放
					});
				}
				return arr;
			};
			return new Promise((resolve, reject) => {
				const data = getData();
				setTimeout(() => {
					resolve(data);
				}, 500);
			});
		},
		//切换语音或者键盘方式
		switchChatType(type) {
			this.chatType = type;
		},
		//发送消息
		sendMsg(data) {
			const params = {
				hasBeenSentId: Date.now(), //已发送过去消息的id
				content: this.formData.content,
				fromUserHeadImg: this._user_info.headImg, //用户头像
				fromUserId: this._user_info.id,
				isItMe: true, //true此条信息是我发送的  false别人发送的
				createTime: Date.now(),
				contentType: 1
			};

			if (data) {
				//说明是发送语音
				if(data.contentType == 2){
					params.content = data.content;
					params.contentType = data.contentType;
					params.contentDuration = data.contentDuration;
					params.anmitionPlay = false;
				}else if(data.contentType == 3){
					// --
				}
			} else if (!this.$u.trim(this.formData.content)) {
				//验证输入框书否为空字符传
				return;
			}

			this.messageList.push(params);

			this.$nextTick(() => {
				this.formData.content = '';
				uni.pageScrollTo({
					scrollTop: 99999,
					// #ifdef MP-WEIXIN
					duration: 0, //小程序如果有滚动效果 input的焦点也会随着页面滚动...
					// #endif
					// #ifndef MP-WEIXIN
					duration: 100
					// #endif
				});
				// #ifdef MP-WEIXIN
				if (params.contentType == 1) {
					this.mpInputMargin = true;
				}
				// #endif
				//h5浏览器并没有很好的办法控制键盘一直处于唤起状态 而且会有样式性的问题
				// #ifdef H5
				uni.hideKeyboard();
				// #endif
			});
		},
		//用户触摸屏幕的时候隐藏键盘
		touchstart() {
			uni.hideKeyboard();
		},
		// userid 用户id
		linkToBusinessCard(userId) {
			this.$u.route({
				url: 'pages/businessCard/businessCard',
				params: {
					userId
				}
			});
		},
		//准备开始录音
		startVoice(e) {
			this.recording = true;
			this.isStopVoice = false;
			this.canSend = true;
			this.voiceIconText = "正在录音..."
			this.PointY = e.touches[0].clientY;
			this.Recorder.start({
				format: 'mp3'
			});
		},
		//录音已经开始
		beginVoice(){
			if (this.isStopVoice) {
				this.Recorder.stop();
				return;
			}
			this.voiceTitle = '松开 结束'
			this.voiceInterval =  setInterval(()=>{
				this.voiceTime ++;
			},1000)
		},
		//move 正在录音中
		moveVoice(e){
			const PointY = e.touches[0].clientY
			const slideY = this.PointY - PointY;
			if(slideY > uni.upx2px(120)){
				this.canSend = false;
				this.voiceIconText = '松开手指 取消发送 '
			}else if(slideY > uni.upx2px(60)){
				this.canSend = true;
				this.voiceIconText = '手指上滑 取消发送 '
			}else{
				this.voiceIconText = '正在录音... '
			}
		},
		//结束录音
		endVoice() {
			this.isStopVoice = true; //加锁 确保已经结束录音并不会录制
			this.Recorder.stop();
			this.voiceTitle = '按住 说话'
		},
		//录音被打断
		cancelVoice(e){
			this.voiceTime = 0;
			this.voiceTitle = '按住 说话';
			this.canSend = false;
			this.Recorder.stop();
		},
		//处理录音文件
		handleRecorder({ tempFilePath,duration }) {
			let contentDuration;
			// #ifdef MP-WEIXIN
			this.voiceTime = 0;
			if (duration < 600) {
				this.voiceIconText="说话时间过短";
				setTimeout(()=>{
					this.recording = false;
				},200)
				return;
			} 
			contentDuration = duration/1000;
			// #endif
			
			// #ifdef APP-PLUS
			contentDuration = this.voiceTime +1;
			this.voiceTime = 0;
			if(contentDuration <= 0) {
				this.voiceIconText="说话时间过短";
				setTimeout(()=>{
					this.recording = false;
				},200)
				return;
			};
			// #endif
			
			this.recording = false;
			const params = {
				contentType: 2,
				content: tempFilePath,
				contentDuration: Math.ceil(contentDuration)
			};
			this.canSend && this.sendMsg(params);
		},
		//控制播放还是暂停音频文件
		handleAudio(item) {
			this.Audio.paused ? this.playAudio(item) : this.stopAudio(item);
		},
		//播放音频
		playAudio(item) {
			this.Audio.src = item.content;
			this.Audio.hasBeenSentId = item.hasBeenSentId;
			this.Audio.play();
			item.anmitionPlay = true;
		},
		//停止音频
		stopAudio(item) {
			item.anmitionPlay = false;
			this.Audio.src = '';
			this.Audio.stop();
		},
		//关闭动画
		closeAnmition() {
			const hasBeenSentId = this.Audio.hasBeenSentId;
			const item = this.messageList.find(it => it.hasBeenSentId == hasBeenSentId);
			item.anmitionPlay = false;
		}
	},
	onPageScroll(e) {
		if (e.scrollTop < 50) {
			this.joinData();
		}
	},
	onNavigationBarButtonTap({ index }) {
		if (index == 0) {
			//用户详情 设置
		} else if (index == 1) {
			//返回按钮
			this.$u.route({
				type: 'switchTab',
				url: 'pages/home/home'
			});
		}
	},
	//返回按钮事件
	onBackPress(e) {
		//以下内容对h5不生效
		//--所以如果用浏览器自带的返回按钮进行返回的时候页面不会重定向 正在寻找合适的解决方案
		this.$u.route({
			type: 'switchTab',
			url: 'pages/home/home'
		});
		return true;
	},
	onLoad(info) {
		// { messageId,fromUserName,fromUserHeadImg } = info
		const userInfo = this.firendList.filter(item => item.userId == info.fromUserId)[0];
		this.fromUserInfo = {
			fromUserName: userInfo.userName,
			fromUserHeadImg: userInfo.headImg,
			fromUserId: userInfo.userId,
			messageId: info.messageId
		};

		//录音开始事件
		this.Recorder.onStart(e => {
			
			this.beginVoice();
		});
		//录音结束事件
		this.Recorder.onStop(res => {
			clearInterval(this.voiceInterval);
			this.handleRecorder(res);
		});

		//音频停止事件
		this.Audio.onStop(e => {
			this.closeAnmition();
		});

		//音频播放结束事件
		this.Audio.onEnded(e => {
			this.closeAnmition();
		});
	},
	onReady() {
		//自定义返回按钮 因为原生的返回按钮不可阻止默认事件
		// #ifdef H5
		const icon = document.getElementsByClassName('uni-page-head-btn')[0];
		icon.style.display = 'none';
		// #endif

		uni.setNavigationBarTitle({
			title: this.fromUserInfo.fromUserName
		});
		this.joinData();
		uni.getSystemInfo({
			success: res => {
				this.imgHeight = res.windowHeight + 'px';
			}
		});

		// #ifdef MP-WEIXIN
		uni.onKeyboardHeightChange(res => {
			if (res.height == 0) {
				this.mpInputMargin = false;
			}
		});
		// #endif
	}
};
</script>

<style lang="scss" scoped>
 @import './index.scss'
</style>
