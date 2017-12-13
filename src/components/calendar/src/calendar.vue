<template>
	<section>
		<div class="calendar">
			<div class="calendar-month">
				<span class="month-left"  @click="handlePrev"><i>&lt;</i></span>
				<strong>{{currentMonth}}</strong>
				<span class="month-right" @click="handleNext"><i>&gt;</i></span>
			</div>
			<table class="calendar-table">
				<thead class="calendar-week">
					<th v-for="week in WEEKS">{{week}}</th>
				</thead>
				<tbody class="calendar-body">
					<tr v-for="row in rows">
						<td 
							v-for="cell in row" 
							:class="getClasses(cell)" 
							@click="selectedDate(cell)">
							<span>{{cell.text}}</span>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</section>
</template>
<script>
	import moment from 'moment'
	import { nextMonth, prevMonth, getFirstDayOfMonth, getDayCountOfMonth, isSameDate } from './util'
	export default {
		name: 'Calendar',
		props: {
			firstDayOfWeek: {
				default: 7,
        type: Number,
        // validator: val => val >= 1 && val <= 7
			},
			value: {},
			showWeekNumber: {
        type: Boolean,
        default: false
      },
		},
		computed: {
			currentMonth() {
				return moment(this.date).locale(this.locale).format('YYYY MMMM')
			},
			year() {
				return this.date.getFullYear();
			},
			month() {
				return this.date.getMonth();
			},
			WEEKS() {
				return ['日', '一', '二', '三', '四', '五', '六'];
			},
			rows() {
				const date = this.date;
				// let day = getFirstDayOfMonth(date);
				const offset = getFirstDayOfMonth(date);
				const dateCountOfMonth = getDayCountOfMonth(date);
				const dateCountOfLastMonth = getDayCountOfMonth(prevMonth(date));
				const rows = this.tableRows;
				let count = 1 - offset;
				let month;
				// let firstDayPosition;
				// const startDate = this.startDate;
				// const disabledDate = this.disabledDate;
				for(let i = 0; i < 6; i++) {
					const row = rows[i];
					// if(!row[0]){
					// 	row[0] = { type: 'week', text: getWeekNumber(nextDate(startDate, i * 7 + 1)) }
					// }
					for(let j = 0; j < 7; j++) {
						let cell = row[j];
						if(!cell) {
							cell = { row: i, column: j, type: 'normal', inRange: false, start: false, end: false}
						}
						cell.type = 'normal';
						const index = i * 7 + j;
						if(i >= 0 && i <= 1 ) {
							if(index >= offset) {
								cell.text = count++;
								month = this.month;
							} else {
								cell.text = count++ + dateCountOfLastMonth;
								cell.type = 'prev-month';
								month = this.month - 1;
							}
						} else {
							if(count <= dateCountOfMonth) {
								cell.text = count++;
								month = this.month;
							} else {
								cell.text = count++ - dateCountOfMonth;
								cell.type = 'next-month';
								month = this.month + 1;
							}
						}
						if(isSameDate(new Date(), new Date(this.year, month, cell.text))) {
							cell.type = 'today'
						}
						cell.date = moment(new Date(this.year, month, cell.text)).format('YYYY-MM-DD');
						this.$set(row, j, cell);
					}
				}
				return rows;
			}
		},
		data() {
			return {
				tableRows: [ [], [], [], [], [], [] ],
				locale: 'zh-cn',
				currMonth: '',
				currDate: '', 
				day: '',
				date: new Date(2018,-1,1),
			}
		},
		methods: {
			selectedDate(cell) {
				console.log(cell.date)
			},
			handleNext () {
				this.date = nextMonth(this.date)
			},
			handlePrev() {
				this.date = prevMonth(this.date)
			},
			getClasses(cell) {
				let classes = [];
				if(cell.type === 'normal') {
					classes.push('available')
					if(cell.type === 'today') {
						classes.push('today')
					}
				} else {
					classes.push(cell.type)
				}
				return classes;
			}
		},
		mounted() {
			console.log(this.day)
		}
	}
</script>
<style scoped lang="scss">
	.calendar {
		.calendar-month {
			display: flex;
			justify-content: space-between;
			height: 30px;
			line-height: 30px;
			background: #ccc;
			strong {
				font-weight: normal;
			}
			span[class^="month-"] {
				display: inline-block;
				width: 30px;
				text-align: center;
				font-size: 20px;
				cursor: pointer;
				i {
					font-family: 'Microsoft Yahei';
					font-style: normal;
				}
			}
		}
		.calendar-table {
			width: 100%;
			border-collapse: collapse;
			border-spacing: 0;
			.calendar-week {
				width: 100%;
				th {
					padding: 5px;
					text-align: center;
					border-right: 1px solid #ccc;
					&:last-child {
						border-right: none;
					}
				}
			}
			td {
				padding: 15px;
				border-top: 1px solid #ccc;
				border-right: 1px solid #ccc;
				text-align: center;
				color: #999;
				&:hover {
					background: #f0f0f0;
				}
				&.available {
					color: #333;
				}
				&.today {
					color: #409EFF;
					background: #f3f3f3;
				}
			}
		}
	}
</style>