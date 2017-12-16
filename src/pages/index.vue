<template>
	<section>
		<h1>vue-calendar</h1>
		<div class="calendar-wrap">
			<Calendar 
				:events="data"
				:selectedDay="selectedDay"
				@dayClick="dayClick">
				
			</Calendar>
		</div>
	</section>
</template>
<script>
	
</script>
<style scoped lang="scss">
	h1 {
		font-size: 30px;
		text-align: center;
	}
	.calendar-wrap {
		width: 600px;
		margin: auto;
		border: 1px solid #ccc;
	}
</style>
<script>
	export default {
		data() {
			return {
				selectedDay: '',
				data: [
					{
						date: '2017-12-16',
						price: 1989,
						stock: 100
					},
					{
						date: '2017-12-17',
						price: 1899,
						stock: 99
					},
					{
						date: '2017-12-1',
						price: 1899,
						stock: 99
					},
					{
						date: '2017-12-13',
						price: 1899,
						stock: 99
					},
					{
						date: '2018-1-1',
						price: 1899,
						stock: 99
					},
				]
			}
		},
		methods: {
			dayClick(e) {
				if(JSON.stringify(e.event) !== '{}'){
					this.selectedDay = e.date;
					console.log(this.selectedDay)
				}
			}
		}
	}
</script>