<template>
	<view>
		<view class="userinfo">
			<image :src="userInfo.headImg" @tap="previewImg(userInfo.headImg)" class="img"></image>
			<view class="userinfo-desc">
				<view class="userinfo-desc-name">{{userInfo.userName}}</view>
				<view class="userinfo-desc-gray">昵称：{{userInfo.userName}}</view>
				<view class="userinfo-desc-gray">微信号：{{userInfo.wechatNumber}}</view>
				<view class="userinfo-desc-gray">地区：{{userInfo.address}}</view>
			</view>
		</view>
		<view  class="perch"></view>
		<u-cell-group >
			<u-cell-item title="朋友圈" label="模拟数据暂不支持查看好友朋友圈" hover-class="none" :title-style="{ marginLeft: '10rpx' }"></u-cell-item>
			<u-cell-item title="更多信息" :title-style="{ marginLeft: '10rpx' }" @click="linkToMoreInfoMation"></u-cell-item>
		</u-cell-group>
		<view class="" v-if="!isItMe">
			<view  class="perch"></view>
			<u-cell-group >
				<u-cell-item title="发消息" :arrow="false" :center="true" :title-style="{ marginLeft: '10rpx' }" @click="linkToChat">
					<u-icon slot="icon" name="chat" color="#36648B" size="32"></u-icon>
				</u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo:{},
				isItMe:false
			}
		},
		methods: {
			linkToChat(){
				this.$u.route({
					url:"pages/chat/chat",
					params:{ fromUserId:this.userInfo.userId }
				})
			},
			previewImg(urls){
				uni.previewImage({urls:[urls]})
			},
			linkToMoreInfoMation(){
				this.$u.route({
					url:"pages/moreInforMation/moreInforMation",
					params:{ signature:this.userInfo.signature }
				})
			}
		},
		onLoad({ userId }) {
			if(userId == this._user_info.id){
				this.userInfo = this._user_info;
				this.isItMe = true;
				return;
			}
			this.userInfo = this.firendList.filter(item=>item.userId == userId)[0];
		}
	}
</script>

<style scoped lang="scss">
	.perch{
		height: 10rpx;
	}
.userinfo{
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
	padding: 20rpx 30rpx 40rpx 40rpx;
	background-color: #FFFFFF;
	.img{
		display: block;
		width: 110rpx;
		height: 110rpx;
		border-radius: 10rpx;
	}
	&-desc{
		padding-left: 30rpx;
		&-name{
			font-weight: bold;
			font-size: 36rpx;
			transform: translateY(-10rpx);
		}
		&-gray{
			color: $u-tips-color;
			font-size: 29rpx;
		}
	}
}
</style>
