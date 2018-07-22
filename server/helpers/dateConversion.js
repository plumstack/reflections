const sugar = require('sugar-date');

class DateConversion {
  constructor() {
    this.parse = sugar.Date.create;
  }

  toPostgres(date) {
    const d = this.parse(date);

    function zeroPad(int) {
      return `0${int}`.slice(-2);
    }

    const parsed = new Date(d);

    return [
      parsed.getUTCFullYear(),
      zeroPad(parsed.getMonth() + 1),
      zeroPad(parsed.getDate()),
      zeroPad(parsed.getHours()),
      zeroPad(parsed.getMinutes()),
      zeroPad(parsed.getSeconds()),
    ].join(' ');
  }

  nowToPostgres() {
    return this.toPostgres(Date.now);
  }

  toJavacsript(date) {
    return this.parse(date);
  }

  nowToJavascript() {
    return this.toJavacsript(Date.now);
  }
}

const DC = new DateConversion();

const x = DC.nowToJavascript();
const y = DC.nowToPostgres();
console.log(y);
console.log(x);

module.exports = new DateConversion();

// postgres date checker
/* SELECT *
FROM table
WHERE update_date >= '2013-05-03'::date
AND update_date < ('2013-05-03'::date + '1 day'::interval); */
