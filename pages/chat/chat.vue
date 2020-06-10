<template>
	<view class="content">
		<view class="content-box" @touchstart="touchstart" >
			<!-- 背景图- 定位方式 -->
			<image class="content-box-bg" :src="_user_info.chatBgImg" :style="{height:imgHeight}"></image>
			<view class="content-box-loading" v-if="!loading"><u-loading mode="flower"></u-loading></view>
			<view class="message" v-for="(item, index) in messageList" :key="index" :id="`msg-${item.hasBeenSentId}`">
				<view class="message-item " :class="item.isItMe ? 'right' : 'left'">
					<image class="img" :src="item.fromUserHeadImg" mode="" @tap="linkToBusinessCard(item.fromUserId)"></image>
					<view class="content">{{ item.content }}</view>
				</view>
			</view>
		</view>
		<!-- 底部聊天输入框 -->
		<view class="input-box">
			<view class="input-box-flex">
				<view class="input-box-flex-grow">
					<input
						type="text"
						class="content"
						id="input"
						v-model="formData.content"
						:hold-keyboard="true"
						:confirm-type="'send'"
						:confirm-hold="true"
						placeholder-style="color:#DDD;"
						:cursor-spacing="6"
					/>
				</view>
					<!--icon等组件 后续可能会改为nvue 因为vue不支持confirm-type-->
					<!-- <u-icon class="icon" name="heart"></u-icon> -->
					<!-- <u-icon class="icon" name="plus-circle"></u-icon> -->
					<button class="btn" type="primary" size="mini" @touchend.prevent="sendMsg">发送</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			fromUserInfo: { }, 
			formData: {
				content: '',
				limit: 15,
				index: 1
			},
			messageList: [],
			loading: true, //标识是否正在获取数据
			imgHeight:'1000px'
		};
	},
	methods: {
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
			//填充数据后，视图会自动滚动到最上面一层然后瞬间再跳回bindScroll的制定未知 ---体验不是很好，后期优化
			this.$nextTick(() => {
				this.bindScroll(sel);
				//如果还有数据
				if (this.formData.limit >= data.length) {
					this.formData.index++;
					setTimeout(()=>{
						this.loading = true;
					},200)
				}
				
			});
		},
		bindScroll(sel,duration = 0) {
			const query = uni.createSelectorQuery().in(this);
			query
				.select(sel)
				.boundingClientRect(data => {
					uni.pageScrollTo({
						scrollTop: data && data.top - 40,
						duration, 
					});
				})
				.exec();
		},
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
						fromUserId:isItMe?this._user_info.id:this.fromUserInfo.fromUserId,
						isItMe, //true此条信息是我发送的 false别人发送的
						createTime: Date.now()
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
		sendMsg() {
			if (!this.$u.trim(this.formData.content)) {
				return;
			}
			const params = {
				hasBeenSentId: Date.now(), //已发送过去消息的id
				content: this.formData.content,
				fromUserHeadImg: this._user_info.headImg, //用户头像
				fromUserId:this._user_info.id,
				isItMe: true, //true此条信息是我发送的  false别人发送的
				createTime: Date.now()
			};
			this.messageList.push(params);
			
			this.$nextTick(() => {
				this.formData.content = '';
				uni.pageScrollTo({
					scrollTop:99999,
					duration:100
				})
				
				//h5浏览器并没有很好的办法控制键盘一直处于唤起状态 而且会有样式性的问题
				// #ifdef H5
					uni.hideKeyboard()
				// #endif
			});
		},
		touchstart(){
			uni.hideKeyboard()
		},
		// userid 用户id
		linkToBusinessCard(userId){
			this.$u.route({
				url: 'pages/businessCard/businessCard',
				params:{ userId }
			})
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
		}else if(index ==1){
			//返回按钮
			this.$u.route({
				type:"switchTab",
				url:"pages/home/home"
			})
		}
	},
	onBackPress(e){
		//以下内容对h5不生效
		//--所以如果用浏览器自带的返回按钮进行返回的时候页面不会重定向 正在寻找合适的解决方案
		this.$u.route({
			type:"switchTab",
			url:"pages/home/home"
		})
		return true;
	},
	onLoad(info) {
		// { messageId,fromUserName,fromUserHeadImg } = info
		const userInfo  = this.firendList.filter(item=>item.userId == info.fromUserId)[0];
		this.fromUserInfo = {
			fromUserName:userInfo.userName,
			fromUserHeadImg:userInfo.headImg,
			fromUserId:userInfo.userId,
			messageId:info.messageId
		}
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
			success: (res) => {
				this.imgHeight = res.windowHeight+'px';
			}
		})
		
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: #f3f3f3;
}
.content {
	&-box {
		width: 100%;
		height: auto;
		min-height: calc(100vh - env(safe-area-inset-top) - 200rpx);
		box-sizing: content-box;
		padding-bottom: 100rpx;
		position: relative;
		
		// 底部安全区域
		margin-bottom: 0rpx;
		margin-bottom: constant(safe-area-inset-bottom);
		margin-bottom: env(safe-area-inset-bottom);
		
		&-bg{
			width: 100%;
			// height:calc(100vh - env(safe-area-inset-top) - 100rpx) !important;
			// min-height:calc(100vh - env(safe-area-inset-top) - 100rpx) ;
			position: fixed;
			top: 0;
			left: 0;
		}
		&-loading {
			text-align: center;
			padding: 20rpx 0;
		}
		.message {
			padding: 14rpx 20rpx;
		}
		.message-item {
			display: flex;
			justify-content: flex-start;
			align-items: flex-start;
			align-content: flex-start;
			flex-wrap: nowrap;
			flex-direction: row;
			.img {
				width: 80rpx;
				height: 80rpx;
				border-radius: 5rpx;
			}
			.content {
				padding: 20rpx;
				max-width: 500rpx;
				border-radius: 10rpx;
				font-size: 28rpx;
			}
			&.right {
				flex-direction: row-reverse;
				.content {
					background-color: $uni-color-success;
					margin-right: 28rpx;
					word-break: break-all;
					line-height: 36rpx;
					position: relative;

					&::after {
						content: '';
						display: block;
						width: 0;
						height: 0;
						border-top: 10rpx solid transparent;
						border-bottom: 10rpx solid transparent;
						border-left: 16rpx solid $uni-color-success;
						position: absolute;
						right: -16rpx;
						top: 30rpx;
					}
				}
			}
			&.left {
				.content {
					background-color: $uni-text-color-inverse;
					margin-left: 28rpx;
					word-break: break-all;
					line-height: 36rpx;
					position: relative;

					&::after {
						content: '';
						display: block;
						width: 0;
						height: 0;
						border-top: 10rpx solid transparent;
						border-bottom: 10rpx solid transparent;
						border-right: 16rpx solid $uni-text-color-inverse;
						position: absolute;
						left: -16rpx;
						top: 30rpx;
					}
				}
			}
		}
	}
	.input-box {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		box-sizing: content-box;
		z-index: 999;
		// background-color: #F3F3F3;
		background-color: $uni-bg-color-grey;
		// border-top: 1rpx solid #c8c9cc;

		margin-bottom: 0rpx;
		margin-bottom: constant(safe-area-inset-bottom);
		margin-bottom: env(safe-area-inset-bottom);
		&-flex {
			display: flex;
			justify-content: flex-start;
			align-items: center;
			flex-wrap: nowrap;
			flex-direction: row;
			padding: 0 20rpx;
			height: 100rpx;
			&-grow {
				flex-grow: 1;
				.content {
					background-color: #fff;
					height: 60rpx;
					padding: 0 20rpx;
					border-radius: 12rpx;
					font-size: 28rpx;
					caret-color: $uni-color-success;
				}
			}
			.btn{
				margin-left: 20rpx;
				background-color: $u-type-success;
				border: none;
				// height: 60rpx;
			}
		}
	}
}
</style>
