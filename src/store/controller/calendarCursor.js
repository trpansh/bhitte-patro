import { CALENDAR_VIEW_TYPE, YEAR_RANGE_NEPALI } from '../state';

export default {
  async create(req, res) {
    const date = { ...req.body.date };
    date.year = parseInt(date.year, 10);
    res.json({});
    return { cursor: date };
  },
  async update(req, res) {
    const { step, value, type } = req.body;
    const state = req.state.app;
    let { year, month, day } = state.cursor;
    const calendarView = state.calendarView;
    let flipAnimation = '';
    if (!step) {
      flipAnimation = 'fadeInDown';
      if (type === 'year') {
        year = parseInt(value, 10);
      } else if (type === 'month') {
        month = parseInt(value + 1, 10);
      } else {
        year = value.year;
        month = value.month;
        day = value.day;
      }
    }
    if (step === '+') {
      flipAnimation = 'fadeInRight';
      switch (calendarView) {
        case CALENDAR_VIEW_TYPE.YEAR.value:
          if (year < YEAR_RANGE_NEPALI[1]) {
            day = 1;
            year = parseInt(year, 10) + 1;
          }
          break;
        case CALENDAR_VIEW_TYPE.MONTH.value:
          month = parseInt(month, 10) + 1;
          if (month > 12) {
            month = 1;
            if (year < YEAR_RANGE_NEPALI[1]) {
              year = parseInt(year, 10) + 1;
            }
          }
          day = 1;
          break;
        default:
          break;
      }
    }
    if (step === '-') {
      flipAnimation = 'fadeInLeft';
      switch (calendarView) {
        case CALENDAR_VIEW_TYPE.YEAR.value:
          if (year > YEAR_RANGE_NEPALI[0]) {
            year = parseInt(year, 10) - 1;
            day = 1;
          }
          break;
        case CALENDAR_VIEW_TYPE.MONTH.value:
          month = parseInt(month, 10) - 1;
          day = 1;
          if (month < 1) {
            month = 12;
            if (year > YEAR_RANGE_NEPALI[0]) {
              year = parseInt(year, 10) - 1;
            }
          }
          break;
        default:
          break;
      }
    }
    const date = { year, month, day };
    res.json({ date, view: calendarView });
    return { cursor: date, flipAnimation };
  },
};