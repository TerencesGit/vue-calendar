/**
 * [description]
 * @param  {[type]} date   [description]
 * @param  {Number} amount [description]
 * @return {[type]}        [description]
 */
export const prevDate = (date, amount = 1) => {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate() - amount);
}

export const nextDate = (date, amount = 1) => {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

export const prevMonth = (date, amount = 1) => {
	return new Date(date.getFullYear(), date.getMonth() - amount, 1);
}

export const nextMonth = (date, amount = 1) => {
	return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

export const getFirstDayOfMonth = (date) => {
 	const temp = new Date(date.getTime());
 	temp.setDate(1);
 	return temp.getDay();
}

export const getDayCountOfMonth = (date) => {
	let year = date.getFullYear(),
			month = date.getMonth();
	return new Date(year, month + 1, 0).getDate();
}

export const isSameDate = (date1, date2) => {
	return date1.getFullYear() === date2.getFullYear() && 
	date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
}
export const filled = (n) => {
	return String(n).replace(/^(\d)$/, '0$1'); 
}
export const formatDate = (date) => {
	date = new Date(date);
	return date.getFullYear() + '-' + filled(date.getMonth()+1) + '-' + filled(date.getDate());
}