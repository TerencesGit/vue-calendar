<template>
	<div v-if="visible" class="calendar">
		<div class="calendar-month">
			<span class="month-left"  @click="handlePrev"><i v-show="isMonthPrev">&lt;</i></span>
			<strong>
				<!-- {{currentMonth}} -->
				{{this.year}} 年 {{this.month + 1}} 月
			</strong>
			<span class="month-right" @click="handleNext"><i v-show="isMonthNext">&gt;</i></span>
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
						@click.stop="handleDayClick(cell)">
						<span>{{cell.text}}</span>
						<span v-if="cell.event && cell.event.stock">余{{cell.event.stock}}</span>
						<span v-if="cell.event && cell.event.price" class="calendar-price">￥{{cell.event.price}}起</span>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
<script>
	import moment from 'moment'
	import { nextMonth, prevMonth, getFirstDayOfMonth, getDayCountOfMonth, isSameDate } from './util'
	const WEEKS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
	export default {
		name: 'Calendar',
		props: {
			firstDayOfWeek: {
				default: 0,
        type: Number,
        validator: val => val >= 0 && val <= 6
			},
			selectedDay: {
				type: String,
			},
			events: {
				type: Array,
				default: () => {
					return []
				},
			},
			visible: {
				type: Boolean,
				default: false,
			}
		},
		computed: {
			currentMonth() {
				return this.date.getFullYear() + '年' + (this.date.getMonth() + 1) + '月';
				// return moment(this.date).locale(this.locale).format('YYYY MMMM')
			},
			year() {
				return this.date.getFullYear();
			},
			month() {
				return this.date.getMonth();
			},
			WEEKS() {
				const week = this.firstDayOfWeek;
        return WEEKS.concat(WEEKS).slice(week, week + 7);
			},
			offsetDay() {
        const week = this.firstDayOfWeek;
        return week > 3 ? 7 - week : -week;
      },
			rows() {
				const date = this.date;
				let day = getFirstDayOfMonth(date);
				const offset = (day + this.offsetDay) > 0 ? day + this.offsetDay : day + this.offsetDay + 7;
				// console.log(day, this.offsetDay, offset)
				const dateCountOfMonth = getDayCountOfMonth(date);
				const dateCountOfLastMonth = getDayCountOfMonth(prevMonth(date));
				const rows = this.tableRows;
				let count = 1 - offset;
				let month;
				for(let i = 0; i < 6; i++) {
					const row = rows[i];
					for(let j = 0; j < 7; j++) {
						let cell = row[j];
						if(!cell) {
							cell = { row: i, column: j, type: 'normal', inRange: false, start: false, end: false, isSelected: false }
						}
						cell.event = {}
						cell.isSelected = false;
						const index = i * 7 + j;
						if(i >= 0 && i <= 1 ) {
							if(index >= offset) {
								cell.type = 'normal';
								cell.text = count++;
								month = this.month;
							} else {
								cell.text = count++ + dateCountOfLastMonth;
								cell.type = 'prev-month';
								month = this.month - 1;
							}
						} else {
							if(count <= dateCountOfMonth) {
								cell.type = 'normal';
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
						if(isSameDate(new Date(this.selectedDay), new Date(this.year, month, cell.text))) {
							cell.isSelected = true
						}
						cell.date = moment(new Date(this.year, month, cell.text)).format('YYYY-MM-DD');
						this.events.filter(event => {
							if(isSameDate(new Date(event.date), new Date(this.year, month, cell.text))) {
								cell.event = event;
							}
						})
						this.$set(row, j, cell);
					}
				}
				return rows;
			},
			dateRange() {
				return {
					startDate: this.events[0] && this.events[0].date,
					endDate: this.events[0] && this.events[this.events.length - 1].date,
				}
			},
			isMonthPrev() {
				if(!this.events[0])return true;
				return this.year > new Date(this.dateRange.startDate).getFullYear() || 
				(this.year === new Date(this.dateRange.startDate).getFullYear() && 
					this.month > new Date(this.dateRange.startDate).getMonth())
			},
			isMonthNext() {
				if(!this.events[0])return true;
				return this.year < new Date(this.dateRange.endDate).getFullYear() || 
							 (this.year === new Date(this.dateRange.endDate).getFullYear() &&
							 	this.month < new Date(this.dateRange.endDate).getMonth())
			},
		},
		data() {
			return {
				tableRows: [ [], [], [], [], [], [] ],
				locale: 'zh-cn',
				date: new Date(),
			}
		},
		methods: {
			handleDayClick(cell) {
				this.$emit('dayClick', cell)
			},
			handlePrev() {
				if(this.isMonthPrev) {
					this.date = prevMonth(this.date)
				}
			},
			handleNext() {
				if(this.isMonthNext) {
					this.date = nextMonth(this.date)
				}
			},
			getClasses(cell) {
				let classes = [];
				if(cell.type === 'normal') {
					if(cell.type === 'today') {
						classes.push('today')
					}
					classes.push('current')
				} else {
					classes.push(cell.type)
				}
				if(cell.event && JSON.stringify(cell.event) === '{}') {
					classes.push('disabled')
				} else {
					classes.push('available')
				}
				if(cell.isSelected) {
					classes.push('selected')
				}
				return classes.join(' ');
			},
		},
		mounted() {
			this.date = this.events[0] ? new Date(this.events[0].date) : new Date()
		}
	}
</script>
<style scoped lang="scss">
	.calendar {
		width: 260px;
		.calendar-month {
			height: 30px;
			line-height: 30px;
			text-align: center;
			background: #ccc;
			overflow: hidden;
			strong {
				font-weight: normal;
			}
			span[class^="month-"] {
				display: inline-block;
				width: 30px;
				height: 30px;
				text-align: center;
				font-size: 20px;
				cursor: pointer;
				&.month-left {
					float: left;
				}
				&.month-right {
					float: right;
				}
				i {
					font-family: sans-serif;
					font-style: normal;
					font-weight: bold;
				}
			}
		}
		.calendar-table {
			width: 100%;
			border-spacing: 0;
			border-collapse: collapse;
			table-layout: fixed;
			font-size: 13px;
			color: #444;
			font-family: 'Microsoft Yahei';
			border: 1px solid #ccc;
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
				height: 30px;
				border-top: 1px solid #ccc;
				border-right: 1px solid #ccc;
				text-align: left;
				vertical-align: top;
				color: #999;
				span {
					display: block;
				}
				&.available {
					cursor: pointer;
					&:hover {
						background: #f0f0f0;
					}
				}
				&.today {
					color: #409EFF;
					background: #f3f3f3;
				}
				&.current {
					color: #333;
				}
				&.selected {
					color: #fff;
					background: #f60;
					&:hover {
						color: #fff;
						background: #f60;
					}
				}
			}
		}
	}
</style>