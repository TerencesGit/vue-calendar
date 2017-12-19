import DatePicker from './src/picker'

DatePicker.install = (Vue) => {
	Vue.component(DatePicker.name, DatePicker)
}
export default DatePicker;