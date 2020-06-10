<template>
	<view class="mask" v-show="show" @tap="clickMask">
		<view class="" style="position: relative;top:0;left:0;text-align:right">
			<view class="triangle"></view>
		</view>
		<view class="uni-combox__selector" >
			<scroll-view scroll-y="true" class="uni-combox__selector-scroll">
				<view class="uni-combox__selector-item" v-for="(item, index) in list" :key="index" @tap.stop="onSelectorClick(index)" hover-class="select-hover-class" >
					<u-icon :name="item.icon" v-if="item.icon" class="uni-combox__selector-item-icon"></u-icon>
					<text>{{ item[listKey] }}</text>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		list: {
			type: Array,
			default() {
				return [];
			}
		},
		listKey: {
			type: String,
			default: ''
		},
		show: {
			type: Boolean,
			default: false
		}
	},
	watch: {
		show(val) {
			val && this.$emit('on-open');
		}
	},
	data() {
		return {};
	},
	methods: {
		onSelectorClick(index) {
			setTimeout(()=>{
				this.$emit('on-select',index)
				this.$emit('update:show')
			},80)
		},
		clickMask() {
			this.$emit('update:show')
		}
	}
};
</script>

<style lang="scss" scoped>
.mask {
	width: 750rpx;
	height: 100%;
	overflow: hidden;
	position: absolute;
	top: 0;
	left: 0;
	z-index: 1000;
	background-color: transparent;
}
.uni-combox__selector {
	position: absolute;
	top: 10rpx;
	right: 20rpx;
	box-sizing: border-box;
	width: 28%; // 下拉框宽度
	background-color: $u-main-color;
	border-radius: 3px;
	box-shadow: #dddddd 2px 2px 4px, #dddddd -2px -2px 4px;
	z-index: 998;
}
.triangle{
	position: absolute;
	width: 0;
	height: 0;
	// $u-main-color
	border-bottom: solid 5px $u-main-color;
	border-right: solid 5px transparent;
	border-left: solid 5px transparent;
	right: 30rpx;
	top: 0px;
	z-index: 999;
}
.uni-combox__selector-scroll {
	max-height: 150px;
	box-sizing: border-box;
}

.uni-combox__selector-item {
	/* #ifdef APP-NVUE */
	display: flex;
	/* #endif */
	font-size: 24rpx;
	padding: 20rpx ;
	color: #ffffff;
	border-bottom: 1rpx solid $u-type-info;
	&-icon {
		padding-right: 10rpx;
	}
}

.uni-combox__selector-item:last-child {
	border-bottom: none;
}
</style>
