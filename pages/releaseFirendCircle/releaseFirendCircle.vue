<!-- 发布朋友圈 -->
<template>
	<view class="content">
		<!-- #ifdef MP-WEIXIN -->
		<u-navbar title=" " :background="{ background: '#f8f8f8'}" :border-bottom="false" back-icon-name="" back-text="取消" :back-text-style="{color:'#404133'}">
			<view class="slot-wrap" slot="right">
				<u-button size="mini" type="success" @click="handleRelease" :disabled="$u.trim(this.content)?false:true">发表</u-button>
			</view>		
		</u-navbar>
		<!-- #endif -->
		<textarea class="input" v-model="content" placeholder="这一刻的想法..." :show-confirm-bar="false" :adjust-position="false" :disable-default-padding="true"></textarea>
		<u-upload
			class="upload"
			ref="upload"
			:action="action"
			:auto-upload="false"
			:max-size="maxSize"
			:max-count="3"
			:size-type="['compressed']"
			@on-oversize="oversizeUpload"
		></u-upload>
		<view class="tips">
			<u-cell-group>
				<u-cell-item bg-color="#f8f8f8" title="占位字段" :title-style="{ marginLeft: '10rpx' }"></u-cell-item>
				<u-cell-item bg-color="#f8f8f8" title="占位字段" :title-style="{ marginLeft: '10rpx' }"></u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			content: '',
			action: '',
			maxSize: 2 * 1024 * 1024, //限制文件大小 2M
			btnLoading: false //防止重复点击
		};
	},
	methods: {
		oversizeUpload() {},
		//自定义标题栏按钮 h5&&app
		onNavigationBarButtonTap({ index }) {
			if (index == 0) {
				this.handleRelease()
			}
		},
		//自定义标题栏按钮点击事件  微信小程序
		handleRelease(){
			if (this.$u.trim(this.content) || this.$refs.upload.lists.length) {
				this.btnLoading = true;
				uni.showLoading({
					title: '正在发布...',
					mask: true
				});
				const { id, userName, headImg } = this._user_info;
				this.circleData.unshift({
					circleMegId: Date.now(),
					userId: id,
					userName,
					createTime: '刚刚',
					userHeadImg: headImg,
					content: this.content,
					imageList: this.$refs.upload.lists.map(it => it.url),
					isPraise: false,
					praise: [],
					comment: []
				});
				setTimeout(() => {
					this.btnLoading = false;
					uni.hideLoading();
					this.$u.route({ type: 'back'});
				}, 500);
			}
		}
	}
	
};
</script>

<style scoped lang="scss">
.content {
	padding: 20rpx 40rpx;
	.input {
		caret-color: $uni-color-success;
		height: 160rpx;
		padding: 0 15rpx;
	}
	.tips {
		margin-top: 120rpx;
	}
}
</style>
<style lang="scss">
.content {
	.upload {
		/deep/.u-list-item,
		.u-add-wrap {
			background-color: #eceae8;
		}
	}
	.slot-wrap {
		display: flex;
		align-items: center;
		padding: 0 30rpx; 
	}
}
</style>
