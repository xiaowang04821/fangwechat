<template>
	<view class="content">
		<view class="" v-for="(item,index) in cellList" :key="index">
			<u-cell-group>
				<u-cell-item  :title="item.title" :title-style="{marginLeft:'10rpx'}"  @tap="linkTo(item)">
					<u-icon slot="icon" :name="item.icon" :color="item.color" size="32"></u-icon> 
				</u-cell-item>
			</u-cell-group>
			<view v-if="index!=cellList.length" class="" style="height: 10rpx;"></view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			cellList:[
				{ title:"朋友圈",icon:"moments",color:"#409eff" ,bind:"pages/firendCircle/firendCircle" },
				{ title:"扫一扫",icon:"scan",color:"#409eff" },
				{ title:"看一看",icon:"eye",color:"#ff9900" },
			]
		};
	},
	methods: {
		linkTo(item){
			item.bind && this.$u.route(item.bind)
		}
	}
};
</script>

<style lang="scss" scoped>
	.content{
		
	}
</style>
