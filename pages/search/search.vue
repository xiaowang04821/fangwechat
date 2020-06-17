<template>
	<view class="">
		<!-- #ifdef MP-WEIXIN -->
		<u-navbar title=" " :background="{ background: '#f8f8f8' }">
			<view class="slot-wrap">
				<u-search
					:focus="true"
					@custom="clickCancel"
					placeholder="搜索..."
					shape="square"
					:action-style="{ color: '#007aff' }"
					action-text="取消"
					:bg-color="'#ffffff'"
					v-model="search_word"
				></u-search>
			</view>
		</u-navbar>
		<!-- #endif -->
		<!-- #ifndef MP-WEIXIN -->
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
				v-model="search_word"
			></u-search>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
export default {
	data() {
		return {
			search_word: ''
		};
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
