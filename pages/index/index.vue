<template>
	<view class="content">
		<view class="status_bar"></view>
		<view class="content_body">
			<u-avatar :src="_user_info.headImg" mode="square"></u-avatar>
			<view class="content_body_tel">{{ tel | formatTel }}</view>
			<view class="content_body_pswd">
				<u-cell-group><u-field v-model="formData.pswd" clearable type="text" password label="密码" placeholder="请填写密码"></u-field></u-cell-group>
			</view>
			<view class="content_body_btn"><u-button :ripple="true" type="success" :disabled="formData.pswd ? false : true" @click="doLogin">登录</u-button></view>
		</view>
		<view class=" u-flex u-row-around safe-area-inset-bottom content_footer">
			<text>找回密码</text>
			<text @tap="clickSheet">更多选项</text>
		</view>

		<u-action-sheet :list="list" v-model="show" border-radius="25" safe-area-inset-bottom></u-action-sheet>
	</view>
</template>

<script>
export default {
	data() {
		return {
			tel: 13525222222,
			formData: {
				pswd: ''
			},
			show: false,
			list: [
				{
					text: '切换账号',
					fontSize: '28'
				},
				{
					text: '注册',
					fontSize: '28'
				}
			]
		};
	},
	onLoad() {},
	onShow() {},
	methods: {
		clickSheet() {
			this.show = true;
		},
		doLogin() {
			
			this.$u.route({
				url: 'pages/home/home',
				type: 'switchTab'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.content {
	overflow: hidden;
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}
	&_body {
		margin-top: 170rpx;
		text-align: center;
		&_tel {
			margin-top: 10rpx;
		}
		&_pswd {
			margin-top: 40rpx;
		}
		&_btn {
			margin-top: 120rpx;
			padding: 0 20rpx;
		}
	}
	&_footer {
		position: absolute;
		bottom: 50rpx;
		width: 100%;
		padding: 0 30rpx;
		text {
			color: #2979ff;
		}
	}
}
</style>
<style scoped>
>>> .u-border-top:after {
	border-top-width: 0px;
}
</style>
