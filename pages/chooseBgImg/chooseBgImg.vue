<template>
	<view>
		<u-cell-group>
			<u-cell-item title="选择内置背景图" :title-style="{ marginLeft: '10rpx' }" @click="linkToBuiltinBgImg"></u-cell-item>
		</u-cell-group>
		<view style="height: 10rpx;"></view>
		<u-cell-group>
			<u-cell-item title="通过手机选择" :title-style="{ marginLeft: '10rpx' }" @click="chooseImg"></u-cell-item>
		</u-cell-group>

		<u-toast ref="uToast" />
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {
		chooseImg() {
			this.$u.route({
				url: 'components/u-avatar-cropper/u-avatar-cropper',
				params: {
					destWidth: uni.upx2px(750),
					rectWidth: uni.upx2px(500),
					fileType: 'jpg'
				}
			});
		},
		linkToBuiltinBgImg() {
			this.$u.route('pages/builtinBgImg/builtinBgImg');
		},
		emitVuex(path) {
			this.$u.vuex('_user_info.pictureBanner', path);
			this.$u.route({ type: 'back' });
			uni.$off('uAvatarCropper', this.emitVuex);
		}
	},
	created() {
		// 监听从裁剪页发布的事件，获得裁剪结果
		uni.$on('uAvatarCropper', this.emitVuex);
	}
};
</script>

<style></style>
