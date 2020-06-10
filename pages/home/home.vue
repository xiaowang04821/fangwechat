<template>
	<view class="content">
		<selectInput :list="selectList" :list-key="'name'" :show.sync="selectShow" @on-select="checkSelect" />
		<searchInput />
		<u-swipe-action :show="item.show" :index="index" v-for="(item, index) in list" btn-width="160" :key="item.id" @click="click" @open="open" :options="options">
			<view class="item" :class="item.isTop ? 'bg_view' : ''" hover-class="message-hover-class" @tap="linkTo(item)">
				<image mode="aspectFill" :src="item.images" />
				<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
				<view class="right u-border-bottom title-wrap">
					<view class="right_top">
						<view class="right_top_name u-line-1">{{ item.name }}</view>
						<view class="right_top_time ">{{ item.updateTime }}</view>
					</view>
					<view class="right_btm ">
						<view class="u-line-1">-</view>
						<view class=""></view>
					</view>
				</view>
			</view>
		</u-swipe-action>
	</view>
</template>

<script>
import searchInput from '@/components/searchInput/index.vue';
import selectInput from '@/components/selectInput/selectInput.vue';
export default {
	components: { searchInput, selectInput },
	data() {
		return {
			list: [
				{
					id: 1,
					userId:3,
					name: '迪丽热巴',
					images: require('@/static/image/girl.jpg'),
					updateTime: '下午 5:10',
					show: false,
					isTop: true
				},
				{
					id: 2,
					userId:4,
					name: '小贱贱',
					images: require('@/static/image/boy.jpg'),
					updateTime: '下午 5:10',
					show: false
				},
				{
					id: 3,
					userId:2,
					name: '陈冠希',
					images: require('@/static/image/guanxi.jpg'),
					updateTime: '下午 5:10',
					show: false
				}
			],
			selectShow: false,
			options: [
				{
					text: '删除',
					style: {
						backgroundColor: '#dd524d',
						fontSize: '24rpx'
					}
				}
			],
			selectList: [{ id: '1', name: '添加朋友', icon: 'man-add-fill' }, { id: '2', name: '扫一扫', icon: 'scan' }, { id: '3', name: '收付款', icon: 'fingerprint' }]
		};
	},
	methods: {
		click(index, index1) {
			if (index1 == 0) {
				this.list.splice(index, 1);
			} 
		},
		open(index) {
			this.list[index].show = true;
			this.list.map((val, idx) => {
				if (index != idx) this.list[idx].show = false;
			});
		},
		onNavigationBarButtonTap({ index }) {
			if (index == 0) {
				this.selectShow = !this.selectShow;
			}
		},
		linkTo({ id, name, images ,userId }) {
			this.$u.route({
				url: 'pages/chat/chat',
				params: { messageId: id,fromUserId:userId}
			});
		},
		checkSelect(index) {
			if (index == 1) {
				uni.vibrateLong();
				//扫码
				uni.scanCode({
					success: function(res) {
						// console.log('条码内容：' + res.result);
						this.$u.toast('条码类型:', res.scanType);
					}
				});
			}
		},
	},
	onShow() {
		
	}
};
</script>

<style lang="scss" scoped>
.content {
	.item {
		width: 750rpx;
		display: flex;
		align-items: center;
		// padding: 20rpx;
		image {
			width: 76rpx;
			height: 76rpx;
			margin: 20rpx;
			border-radius: 12rpx;
			flex: 0 0 76rpx;
		}
		.right {
			overflow: hidden;
			flex: 1 0;
			padding: 20rpx 20rpx 20rpx 0;
			&_top {
				display: flex;
				justify-content: space-between;
				&_name {
					font-size: 28rpx;
					color: $u-main-color;
					flex: 0 0 450rpx;
					overflow: hidden;
				}
				&_time {
					font-size: 22rpx;
					color: $u-light-color;
				}
			}
			&_btm {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 22rpx;
				color: $u-tips-color;
				padding-top: 10rpx;
			}
		}
	}
	.bg_view {
		background-color: #fafafa;
	}
}
</style>
