<template>
	<view class="content" id="content">
		<!-- #ifdef MP-WEIXIN -->
		<u-navbar title=" " :background="{ background: '#f8f8f8' }" :border-bottom="false">
			<view class="slot-wrap" slot="right"><u-icon name="camera-fill" size="36" @click="linkToRelease"></u-icon></view>
		</u-navbar>
		<!-- #endif -->
		<view class="content-imgbox">
			<image class="bgimg" :src="_user_info.pictureBanner" mode="scaleToFill" @tap="showSheet"></image>
			<image class="headimg" :src="_user_info.headImg" @tap="linkToBusinessCard(_user_info.id)"></image>
			<text class="nickname">{{ _user_info.userName }}</text>
		</view>
		<view class="signature">
			<view class="">{{ _user_info.signature }}</view>
		</view>

		<!-- 朋友圈列表 -->
		<view class="content-circle">
			<view class="content-circle-box" v-for="(item, index) in circleData" :key="item.circleMegId">
				<view class="headimg"><image class="img" :src="item.userHeadImg" @tap="linkToBusinessCard(item.userId)"></image></view>
				<view class="content">
					<view class="content-name" @tap="linkToBusinessCard(item.userId)">{{ item.userName }}</view>
					<view class="content-desc">{{ item.content }}</view>
					<view class="content-img" v-if="item.imageList.length">
						<!-- //只有一张图时候 -->
						<view v-if="item.imageList.length == 1"><image class="img-1" :src="item.imageList[0]" mode="widthFix" @tap="previewImg(0, item.imageList)"></image></view>
						<!-- 有多张图的时候 -->
						<view v-else-if="item.imageList.length > 1">
							<view class="content-img-more">
								<image
									class="img-more"
									v-for="(src, index) in item.imageList"
									:key="index"
									:class="index % 3 == 0 && 'img-3'"
									:src="src"
									mode="aspectFill"
									@tap="previewImg(index, item.imageList)"
								></image>
							</view>
						</view>
					</view>
					<!-- 相对时间 点赞按钮等 -->
					<view class="relavivetime" :id="`comment-${'null'}-${index}`">
						<view class="time">{{ item.createTime }}</view>
						<view class="icon-box">
							<view @tap="clickThumb(item)">
								<image class="img icon-box-item thumb" :src="item.isPraise ? require('@/static/like-fill.png') : require('@/static/like.png')" mode=""></image>
							</view>
							<view @tap="handleComment(item.circleMegId, null, index)">
								<image class="img icon-box-item" :src="require('@/static/comment.png')" mode=""></image>
							</view>
						</view>
					</view>
					<!-- 点赞人 评论 -->
					<view class="msg-box">
						<view class="thumbinfo" v-if="item.praise.length">
							<image class="thumbinfo-icon" :src="require('@/static/like.png')"></image>
							<text class="thumbinfo-name" v-for="(userInfo, index) in item.praise" :key="userInfo.id" @tap="linkToBusinessCard(userInfo.id)">
								{{ userInfo.userName }}{{ index != item.praise.length - 1 ? '，' : '' }}
							</text>
						</view>
						<view class="comment" v-if="item.comment.length">
							<view
								class="comment-box"
								v-for="(comment, index) in item.comment"
								:key="index"
								hover-class="comment-hover-class"
								:id="`comment-${item.circleMegId}-${index}`"
								@tap="handleComment(item.circleMegId, comment, index)"
							>
								<text class="comment-box-name" v-if="!comment.replyUserId" @tap.stop="linkToBusinessCard(comment.userId)">{{ comment.userName }}：</text>
								<text class="comment-box-name" v-if="comment.replyUserId" @tap.stop="linkToBusinessCard(comment.userId)">
									{{ comment.userName }}
									<text class="callback">回复</text>
								</text>
								<text v-if="comment.replyUserId" class="comment-box-name" @tap.stop="linkToBusinessCard(comment.replyUserId)">{{ comment.replyUserName }}：</text>
								<text class="comment-box-content">{{ comment.content }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- #ifdef H5 -->
			<view :style="{ height: showInput ? '100rpx' : 0 }"></view>
			<!-- #endif -->
			<!-- #ifdef APP-PLUS -->
			<view v-show="showInput" :style="{ height: viewOffsetBottom + 'px' }"></view>
			<!-- #endif -->
		</view>

		<!-- 底部聊天输入框 其实可以封装成组件的...-->
		<!-- #ifdef MP-WEIXIN -->
		<view class="input-box" v-if="showInput" id="input-box" :style="{ bottom: inputOffsetBottom > 0 ? inputOffsetBottom + 'px' : '0' }">
		<!-- #endif -->
		<!-- #ifndef MP-WEIXIN -->
		<view class="input-box" v-show="showInput" id="input-box" :style="{ bottom: inputOffsetBottom > 0 ? inputOffsetBottom + 'px' : '0' }">
		<!-- #endif -->
			<view class="input-box-flex">
				<view class="input-box-flex-grow">
					<input
						type="text"
						class="content"
						id="input"
						v-model="content"
						:adjust-position="false"
						:confirm-type="'send'"
						:confirm-hold="true"
						placeholder-style="color:#DDD;"
						:cursor-spacing="6"
						:placeholder="placeholder"
						:focus="showInput"
						@blur="blurInput"
						@confirm="sendMsg"
					/>
				</view>
				<button class="btn" type="primary" size="mini" @touchend.prevent="sendMsg">发送</button>
			</view>
		</view>

		<u-action-sheet :list="list" v-model="show" border-radius="25" safe-area-inset-bottom @click="clickAction"></u-action-sheet>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	name: 'firendCircle',
	data() {
		return {
			show: false, //u-action-sheet  show
			list: [{ text: '更换相册封面', fontSize: '28' }],
			content: '',
			placeholder: '',
			showInput: false,
			focus: false,
			circleMegId: '', //某一条朋友圈id
			commentInfo: {},
			inputOffsetBottom: 0, //键盘的高度
			viewOffsetBottom: 0, //视窗距离页面的距离
			sel: '' //选中的节点
		};
	},
	watch: {
		inputOffsetBottom: {
			handler(val) {
				if (val != 0) {
					this.$nextTick(() => {
						//暂时不支持h5的滚动方式 因为h5不支持键盘的高度监听
						//微信小程序会把input的焦点和placeholder顶起，正在寻找解决方案
						// #ifndef MP-WEIXIN || H5
						this.bindScroll(this.sel, 100);
						// #endif
					});
				}
			}
		}
	},
	methods: {
		//自定义标题栏按钮
		onNavigationBarButtonTap({ index }) {
			if (index == 0) {
				//发布朋友圈
				this.$u.route('pages/releaseFirendCircle/releaseFirendCircle');
			} else if (index == 1) {
				//返回按钮
				this.$u.route({ type: 'back' });
			}
		},
		//打开底部更换相册封面弹窗
		showSheet() {
			this.show = true;
		},
		//点赞
		clickThumb(item) {
			item.isPraise = !item.isPraise;
			if (item.isPraise) {
				item.praise.push({ id: this._user_info.id, userName: this._user_info.userName });
			} else {
				const index = item.praise.findIndex(i => i.id == this._user_info.id);
				item.praise.splice(index, 1);
			}
		},
		//跳转到名片
		linkToBusinessCard(userId) {
			this.$u.route({
				url: 'pages/businessCard/businessCard',
				params: { userId }
			});
		},
		//点击评论 唤出输入框和键盘
		handleComment(circleMegId, comment, index) {
			this.content = '';
			this.circleMegId = circleMegId;
			this.commentInfo = comment || {};
			this.placeholder = '评论：';
			if (comment) {
				this.sel = `#comment-${circleMegId}-${index}`;
				if (comment.replyUserId) {
					//xxx回复xxx ...
					this.placeholder = `回复${comment.replyUserName}:`;
				} else {
					if (comment.userId == this._user_info.id) {
						//如果是回复自己
						this.placeholder = `评论：`;
					} else {
						// xxx评论...
						this.placeholder = `回复${comment.userName}:`;
					}
				}
			} else {
				this.sel = `#comment-${'null'}-${index}`;
			}
			this.showInput = true;
		},
		//发送消息
		sendMsg() {
			if (!this.$u.trim(this.content)) {
				return;
			}
			this.circleData.forEach(item => {
				if (item.circleMegId == this.circleMegId) {
					const { id, userName } = this._user_info;
					const { replyUserId, replyUserName } = this.commentInfo;
					const params = {
						userId: id,
						userName,
						content: this.content
					};
					//如果是回复别人的话
					if (Object.keys(this.commentInfo).length) {
						if (this.commentInfo.replyUserId) {
							//点击了xxx回复xxx ...
							params.replyUserId = replyUserId;
							params.replyUserName = replyUserName;
						} else {
							if (this.commentInfo.userId !== this._user_info.id) {
								//点击了 xxx评论...
								params.replyUserId = this.commentInfo.userId;
								params.replyUserName = this.commentInfo.userName;
							} else {
								//如果是回复自己
								// -- 保持params原来的参数不变
							}
						}
					}
					item.comment.push(params);
				}
			});
			this.closeInputModel();
		},
		//将视图滚动到键盘的上方 微信小程序有些许bug 会把输入框的焦点和placeholder顶起... 、
		//暂时不适配微信小程序，正在解决此bug
		bindScroll(sel, duration = 0) {
			uni.createSelectorQuery()
				.select('#content')
				.boundingClientRect(data => {
					//最外层盒子节点
					uni.createSelectorQuery()
						.select(sel)
						.boundingClientRect(res => {
							if (!res) return;
							//选中的节点
							let windowHeight = 0;
							uni.getSystemInfo({
								success: system => {
									windowHeight = system.windowHeight;
								}
							});
							const inputKeyBoardHeight = uni.upx2px(100) + this.inputOffsetBottom; //input输入框和键盘的高度
							const contentHeight = windowHeight - inputKeyBoardHeight; //可视内容的高度（除去input输入框和键盘）
							let scrollTop = 0;
							scrollTop = res.top - data.top - contentHeight + res.height; //滚动到实际距离是元素距离顶部的距离减去最外层盒子的滚动距离再减去可视内容的高度然后再加上此元素的高度
							uni.pageScrollTo({ duration, scrollTop });
						})
						.exec();
				})
				.exec();
		},
		//查看大图
		previewImg(current, imgList) {
			uni.previewImage({
				current,
				urls: imgList,
				// #ifndef MP-WEIXIN
				indicator: 'number'
				// #endif
			});
		},
		//关闭键盘 关闭输入框
		closeInputModel() {
			this.showInput = false;
			this.content = '';
			this.circleMegId = '';
			this.commentInfo = {};
			uni.hideKeyboard();
		},
		//失去焦点触发
		blurInput() {
			this.closeInputModel();
		},
		keyboardheightchange(res) {
			console.log(res);
		},
		//模拟数据 可通过接口获取
		getData() {
			uni.showLoading({
				title: '正在加载...',
				mask: true
			});
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					// do something
					//由于模拟的数据是从vuex中获取的 所以他是响应式的
					//在此可以做数据的获取 并且再生命周期中调用
					//例如this.circleData = await xxx ...
					uni.hideLoading();
					resolve();
				}, 500);
			});
		},
		//点击相册封面弹窗选择项
		clickAction(index) {
			if (index == 0) {
				this.$u.route('pages/chooseBgImg/chooseBgImg');
			}
		},
		//点击自定义组件相机按钮
		linkToRelease() {
			this.$u.route('pages/releaseFirendCircle/releaseFirendCircle');
		}
	},
	onReady() {
		//兼容h5在pages.json中设置 autoBackButton：false无效  其实只是想修改下默认返回按钮的样式，发现不生效...
		// #ifdef H5
		const icon = document.getElementsByClassName('uni-page-head-btn')[0];
		icon.style.display = 'none';
		// #endif

		//设置input输入框距离键盘的高度 --也就是键盘的高度
		//设置view距离键盘和输入框的高度
		//h5暂不支持键盘的高度监听
		uni.onKeyboardHeightChange(res => {
			this.inputOffsetBottom = res.height;
			this.viewOffsetBottom = res.height + uni.upx2px(100);
			if (res.height == 0) {
				// #ifndef MP-WEIXIN
				this.showInput = false;
				// #endif
			}
		});
	},
	//下拉刷新
	async onPullDownRefresh() {
		await this.getData();
		uni.stopPullDownRefresh();
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: #ffffff;
}
.comment-hover-class {
	background-color: #f3dada;
}
image {
	will-change: transform;
}
.content {
	&-imgbox {
		position: relative;
		.bgimg {
			width: 100%;
			height: 560rpx;
		}
		.headimg {
			width: 110rpx;
			height: 110rpx;
			border-radius: 6rpx;
			position: absolute;
			right: 30rpx;
			bottom: -20rpx;
		}
		.nickname {
			color: #ffffff;
			position: absolute;
			right: 170rpx;
			bottom: 20rpx;
			font-size: 30rpx;
			font-weight: bold;
		}
	}
	&-circle {
		&-box {
			padding: 18rpx 30rpx;
			border-bottom: 1rpx solid #f2eeee;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			align-items: flex-start;
			.headimg {
				width: 80rpx;
				height: 80rpx;
				.img {
					width: 100%;
					height: 100%;
					border-radius: 10rpx;
				}
			}

			.content {
				flex: 1;
				padding-left: 18rpx;
				font-size: 30rpx;
				&-name {
					color: #36648b;
				}
				&-desc {
					color: $u-main-color;
					padding-top: 6rpx;
					line-height: 34rpx;
				}
				&-img {
					margin-top: 10rpx;
					.img-1 {
						will-change: transform;
						width: 280rpx;
						height: auto;
						max-height: 400rpx;
					}
					&-more {
						display: flex;
						flex-wrap: wrap;
						.img-more {
							display: block;
							width: 160rpx;
							height: 160rpx;
							margin: 4rpx;
						}
						.img-3 {
							margin: 4rpx 4rpx 4rpx 0;
						}
					}
				}
				.msg-box {
					width: 100%;
					background-color: $u-type-error-light;
					margin-top: 15rpx;
					border-radius: 4rpx;
					.thumbinfo {
						// border-bottom: 1rpx solid gray;
						padding: 6rpx;
						display: flex;
						align-items: center;
						flex-wrap: wrap;
						&-icon {
							width: 28rpx;
							height: 28rpx;
							line-height: 28rpx;
							margin-right: 15rpx;
							text-align: center;
							vertical-align: middle;
							padding-left: 10rpx;
						}
						&-name {
							font-size: 28rpx;
							color: #36648b;
						}
					}
					.comment {
						padding: 6rpx 8rpx;
						color: $uni-text-color;
						font-size: 28rpx;
						&-box {
							padding: 4rpx 0;
							&-name {
								color: #36648b;
								.callback {
									color: $uni-text-color;
								}
							}
							&-content {
								word-break: break-all;
							}
						}
					}
				}
			}
			.relavivetime {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 26rpx;
				.time {
					color: $uni-text-color-grey;
				}
				.icon-box {
					display: flex;
					align-items: center;
					&-item {
						background-color: $u-type-error-light;
						padding: 4rpx 12rpx;
						border-radius: 6rpx;
						&.thumb {
							margin-right: 10rpx;
						}
					}
					.img {
						width: 34rpx;
						height: 34rpx;
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
		background-color: #eaeaea;

		/* #ifdef MP-WEIXIN */
		padding-bottom: 0rpx; 
		/* #endif */

		/* #ifndef MP-WEIXIN */
		margin-bottom: 0rpx;
		margin-bottom: constant(safe-area-inset-bottom);
		margin-bottom: env(safe-area-inset-bottom);
		/* #endif */
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
			.btn {
				margin-left: 20rpx;
				background-color: $u-type-success;
				border: none;
			}
		}
	}

	.signature {
		display: flex;
		justify-content: flex-end;
		font-size: 24rpx;
		color: gray;
		padding: 35rpx 30rpx 35rpx 100rpx;
		text-align: right;
	}
	.slot-wrap {
		display: flex;
		align-items: center;
		padding: 0 30rpx;
	}
}
</style>
