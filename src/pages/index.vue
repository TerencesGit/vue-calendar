<template>
	<section>
		<h1>vue-calendar</h1>
		<!-- <date-picker class="date-picker" :placeholder="placeholder"></date-picker> -->
		<div class="calendar-wrap">
			<price-calendar 
				:data="skuData"
				:firstDayOfWeek="0"
				:endDate="endDate"
				:selectedDay="selectedDay" 
				@dayClick="dayClick"
				@prevMonth="handlePrevMonth"
				@nextMonth="handleNextMonth">
			</price-calendar>
		</div>
	</section>
</template>

<script>
	export default {
		data() {
			return {
				selectedDay: '',
				skuData: [],
				startDate: '',
				endDate: '',
				events: [
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
				],
				placeholder: '请选择日期'
			}
		},
		methods: {
			dayClick(cell) {
				if(cell.data) {
					this.selectedDay = cell.date;
				}
			},
			handlePrevMonth(date) {
				console.log(date.getMonth())
				this.getSkuData(1234, date.getMonth())
			},
			handleNextMonth(date) {
				console.log(date.getMonth())
				this.getSkuData(1234, date.getMonth()+1)
			},
			getSkuData(wareId, date) {
				this.$http.get('/static/data/index.json',{
					params: {
						wareId,
						date,
					}
				}).then(res => {
					console.log(res)
						if(res.data.status === 1) {
							// res.data.data.currentMonthSku.splice(0, date)
							this.skuData = res.data.data.currentMonthSku;
							this.endDate = res.data.data.sellSkuPeriod.maxDate;
							// let  = res.data.data.currentMonthSku;
							// skuData.map(d => d.skuDate).sort((a, b) => {
							// 	return a > b;
							// })
							// this.skuData = skuData;
						}
					}).catch(err => {
						console.log(err)
					})
			}
		},
		mounted() {
			// console.log(this.events.map(e => e.date).sort((a,b) => {
			// 	return a < b;
			// }))
		},
		created() {
			// this.getSkuData(12345, 2)
		}
	}
</script>

<style scoped lang="scss">
	h1 {
		font-size: 30px;
		text-align: center;
	}
	.calendar-wrap {
		width: 600px;
		margin: auto;
	}
	.date-picker {
		text-align: center;
	}
</style>