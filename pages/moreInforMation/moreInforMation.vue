<template>
	<view>
		<u-cell-group >
			<u-cell-item title="个性签名" :arrow="false" :center="true" hover-class="none" :value="signature">
			</u-cell-item>
		</u-cell-group>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				signature:""
			}
		},
		methods: {
			
		},
		onLoad({signature}) {
			this.signature = signature
		}
	}
</script>

<style>

</style>
