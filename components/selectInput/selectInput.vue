<template>
	<view class="mask" v-if="show" @tap="clickMask">
		<view  style="position: relative;top:0;left:0;text-align:right">
			<view class="triangle" :style="{'top':triangle_styles}"></view>
		</view>
		<view class="uni-combox__selector" :style="{'top':__selector_styles}">
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
		return {
			statusBarHeight:0
		};
	},
	methods: {
		onSelectorClick(index) {
			setTimeout(()=>{
				this.$emit('on-select',index)
				this.clickMask();
			},80)
		},
		clickMask() {
			this.$emit('update:show')
			// #ifdef MP-WEIXIN
			this.$emit('close',false)
			// #endif
		}
	},
	created() {
			uni.getSystemInfo({
				success:(res)=>{
					//状态栏的高度 将用来适配刘海屏
					this.statusBarHeight = res.statusBarHeight;
				}
			})
	},
	computed:{
		__selector_styles(){
			// #ifdef MP-WEIXIN
			return this.statusBarHeight+48+uni.upx2px(10)+'px'
			// #endif
			// #ifndef MP-WEIXIN
			return '10rpx'
			// #endif
		},
		triangle_styles(){
			// #ifdef MP-WEIXIN
			return this.statusBarHeight+48+uni.upx2px(1)+'px'
			// #endif
			// #ifndef MP-WEIXIN
			return '0rpx'
			// #endif
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
	/* #ifdef MP-WEIXIN */
	right: 40rpx;
	/* #endif */
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
	top: 0rpx;
	/* #ifdef MP-WEIXIN */
	right: 29%;
	/* #endif */
	z-index: 999;
}
.uni-combox__selector-scroll {
	max-height: 150px;
	box-sizing: border-box;
}

.uni-combox__selector-item {
	/* #ifdef APP-NVUE || MP-WEIXIN */
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
