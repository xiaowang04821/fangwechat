<template>
	<view class="content">
		<!-- #ifdef MP-WEIXIN -->
		<u-navbar title=" " :background="{ background: '#f8f8f8'}" :border-bottom="false" back-icon-name="" back-text="取消" :back-text-style="{color:'#404133'}">
			<view class="slot-wrap" slot="right">
				<u-button size="mini" type="success" @click="handleLink" >完成</u-button>
			</view>		
		</u-navbar>
		<!-- #endif -->
		<u-grid @click="clickGrid">
			<u-grid-item v-for="(item, index) in bgList" :key="index"  :index="index">
				<image :src="item.src" class="img" mode="scaleToFill"></image>
				<view class="check-box" v-show="item.isCheck"><u-icon style="display: inline-block;" name="checkbox-mark"></u-icon></view>
			</u-grid-item>
		</u-grid>
	</view>
</template>

<script>
export default {
	data() {
		return {
			bgList:[]
		};
	},
	methods: {
		clickGrid(index){
			this.bgList.forEach((item,i)=>{
				if(index == i) item.isCheck = !item.isCheck;
				else item.isCheck = false;
			})
		},
		//自定义标题栏按钮 h5&&app
		onNavigationBarButtonTap({ index }) {
			if (index == 0) {
				this.handleLink()
			}
		},
		//处理跳转逻辑
		handleLink(){
			const item = this.bgList.find(it=>it.isCheck);
			if(item){
				this.$u.vuex('_user_info.pictureBanner', item.src);
				this.$u.route({ type: 'back',delta:2});
			}
		},
		
	},
	onShow() {
		this.bgList = JSON.parse(JSON.stringify(this.circleBgList))
	}
};
</script>

<style lang="scss" scoped>
.content {
	.img {
		width: calc(750rpx / 3.4);
		height: calc(750rpx / 3.4);
	}
	.check-box{
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 40rpx;
		line-height: 40rpx;
		background-color: $u-type-success;
		opacity: 0.7;
		text-align: center;
		color:#FFFFFF;
	}
	.slot-wrap {
		display: flex;
		align-items: center;
		padding: 0 30rpx; 
	}
}
</style>
