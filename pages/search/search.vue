<template>
	<view class="">
		<view class="status_bar"></view>
		<view class="content_search">
			<u-search
				:focus="true"
				@custom="clickCancel"
				placeholder="h5能否自动获取焦点取决于浏览器的实现"
				shape="square"
				:action-style="{ color: '#007aff' }"
				action-text="取消"
				:bg-color="'#ffffff'"
				id="input"
			></u-search>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},

	methods: {
		clickCancel() {
			this.$u.route({
				type: 'navigateBack'
			});
		}
	},
	onShow() {}
};
</script>

<style lang="scss" scoped>
.status_bar {
	height: var(--status-bar-height);
	width: 100%;
}
.content_search {
	padding: 16rpx;
	background-color: #f8f8f8;
}
</style>
