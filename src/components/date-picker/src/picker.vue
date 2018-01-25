<template>
	<section>
		<div class="input-picker">
			<input 
				type="text" 
				class="input-inner" 
				:placeholder="placeholder" 
				@click="handleClick">
		</div>
		<Calendar :visible="pickerVisible"></Calendar>
	</section>
</template>
<script>
	import Calendar from './calendar'
	export default {
		name: 'DatePicker',
		props: {
			placeholder: {
				type: String,
				default: '请选择日期',
			}
		},
		components: {
			Calendar,
		},
		data() {
			return {
				pickerVisible: false,
			}
		},
		methods: {
			handleClick() {
				this.pickerVisible = true;
			}
		},

	}
</script>
<style scoped lang="scss">
	* {
		box-sizing: border-box;
	}
	.input-picker {
		display: inline-block;
		width: 200px;
		padding: 0 15px;
		border: 1px solid #ccc;
		.input-inner {
			width: 100%;
			height: 32px;
			border: none;
			outline: none;
			font-size: 14px;
		}
	}
</style>