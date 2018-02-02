<template>
	<section>
		<div class="price-calendar">
			<div class="calendar-month">
				<span class="month-prev" @click="handlePrev"><i v-show="isMonthPrev">&lt;</i></span>
				<strong>
					{{this.year}} 年 {{this.month + 1}} 月
				</strong>
				<span class="month-next" @click="handleNext"><i v-show="isMonthNext">&gt;</i></span>
			</div>
			<table cellspacing="0" class="calendar-table">
				<thead class="calendar-week">
					<th v-for="week in WEEKS">{{week}}</th>
				</thead>
				<tbody class="calendar-body">
					<tr v-for="row in rows">
						<td 
							v-for="cell in row" 
							:class="getClasses(cell)" 
							@click.stop="handleDayClick(cell)">
							<span class="day">{{cell.text}}</span>
							<span v-if="cell.data.skuStock" class="stock-status">{{cell.stockStatus}}</span>
							<span v-if="cell.data.adultPrice" class="price">￥{{cell.data.adultPrice}}起</span>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</section>
</template>
<script>
	import { nextMonth, prevMonth, getFirstDayOfMonth, getDayCountOfMonth, isSameDate, filled, formatDate } from './util'
	const WEEKS = ['日', '一', '二', '三', '四', '五', '六'];
	export default {
		name: 'priceCalendar',
		props: {
			firstDayOfWeek: {
				default: 0,
        type: Number,
        validator: val => val >= 0 && val <= 6
			},
			selectedDay: {
				type: String, 
			},
			startDate: {
				type: String, 
			},
			endDate: {
				type: String, 
			},
			data: {
				type: Array,
				default: () => {
					return []
				},
			}
		},
		computed: {
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
				const dateCountOfMonth = getDayCountOfMonth(date);
				const dateCountOfLastMonth = getDayCountOfMonth(prevMonth(date));
				const rows = this.tableRows;
				let count = 1 - offset;
				let year, month;
				for(let i = 0; i < 6; i++) {
					const row = rows[i];
					for(let j = 0; j < 7; j++) {
						let cell = row[j];
						cell = { row: i, column: j, type: 'normal', isSelected: false, classes: [], stockStatus: '', data: {} };
						const index = i * 7 + j;
						if(i >= 0 && i <= 1 ) {
							if(index >= offset) {
								cell.type = 'normal';
								cell.text = count++;
								month = this.month;
								year = this.year;
							} else {
								cell.text = count++ + dateCountOfLastMonth;
								cell.classes.push('prev-month')
								month = this.month === 0 ? 11 : this.month - 1;
								year = this.month === 0 ? this.year - 1 : this.year;
							}
						} else {
							if(count <= dateCountOfMonth) {
								cell.type = 'normal';
								cell.text = count++;
								month = this.month;
								year = this.year;
							} else {
								cell.text = count++ - dateCountOfMonth;
								cell.classes.push('next-month')
								month = this.month === 11 ? 0 : this.month + 1;
								year = this.month === 11 ? this.year + 1 : this.year;
							}
						}
						cell.date = formatDate(year + '-'+ (month + 1) + '-'+ cell.text);
						if(isSameDate(new Date(this.selectedDay), new Date(year, month, cell.text))) {
							cell.isSelected = true;
							cell.classes.push('selected')
						}
						this.$set(row, j, cell);
					}
				}
				this.data.length > 0 && this.renderData(rows)
				return rows;
			},
			isMonthPrev() {
				let startDate = this.startDate ? new Date(this.startDate) : new Date();
				return this.year > startDate.getFullYear() || (this.year === startDate.getFullYear() && 
					this.month > startDate.getMonth())
			},
			isMonthNext() {
				if(!this.endDate) return false;
				let endDate = new Date(this.endDate);
				return this.year < endDate.getFullYear() || (this.year === endDate.getFullYear() &&
							 	this.month < endDate.getMonth())
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
				let isClick = cell && cell.data && cell.data.skuStock && cell.data.skuStock.storageNum;
				if(isClick) {
					this.$emit('dayClick', cell)
				}
			},
			handlePrev() {
				if(this.isMonthPrev) {
					this.date = prevMonth(this.date)
					this.$emit('prevMonth', this.date)
				}
			},
			handleNext() {
				if(this.isMonthNext) {
					this.date = nextMonth(this.date)
					this.$emit('nextMonth', this.date)
				}
			},
			getClasses(cell) {
				return cell.classes.join(' ');
			},
			renderData(rows) {
				for(let i = 0; i < rows.length; i++) {
					let row = rows[i];
					for(let j = 0; j < row.length; j++) {
						let cell = row[j];
						for(let k = 0; k < this.data.length; k++) {
							let _data = this.data[k];
							if(isSameDate(new Date(cell.date), new Date(_data.skuDate))) {
								if(_data.skuStock) {
										if(_data.skuStock.storageNum === 0) {
											cell.classes.push('disabled')
											cell.stockStatus = '售罄'
										} else {
											cell.classes.push('active')
											if(_data.skuStock.storageNum > 5) {
												cell.stockStatus = '充足'
												cell.classes.push('more')
											} else {
												cell.stockStatus = '紧张'
												cell.classes.push('less')
											}
										}
								}
								cell.data = _data;
								// this.data.splice(k,1)
								break;
							}
						}
					}
				}
			}
		},
		mounted() {
			this.date = new Date()
		}
	}
</script>
<style scoped lang="scss">
	.price-calendar {
		background: #fff;
		border: 1px solid #ccc;
		.calendar-month {
			display: flex;
			justify-content: space-between;
			height: 30px;
			line-height: 30px;
			text-align: center;
			color: #fff;
			background: #c60c1a;
			overflow: hidden;
			strong {
				font-weight: normal;
			}
			span[class^="month-"] {
				display: block;
				width: 30px;
				height: 30px;
				font-size: 20px;
				i {
					display: block;
					cursor: pointer;
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
			.calendar-week {
				width: 100%;
				th {
					padding: 5px;
					text-align: center;
					font-weight: normal;
				}
			}
			td {
				height: 50px;
				padding-left: 3px;
				border-top: 1px solid #ccc;
				border-right: 1px solid #ccc;
				text-align: left;
				font-size: 12px;
				vertical-align: top;
				span {
					display: block;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
				.price {
					color: #c60c1a;
				}
				&.prev-month, &.next-month {
					background: #fcfcfc;
					.day {
						color: #b0b0b0;
					}
				}
				&.disabled {
					cursor: not-allowed;
					span {
						color: #999;
					}
				}
				&.more {
					.stock-status {
						color: #3DB7EC
					}
				}
				&.less {
					.stock-status {
						color: #c60c1a
					}
				}
				&.active {
					cursor: pointer;
					&:hover {
						background: #f0f0f0;
					}
				}
				&.selected {
					background: #f0f0f0;
				}
			}
		}
	}
</style>