const sugar = require('sugar-date');

sugar.extend();

class DateConversion {
  static toPostgres(date) {
    const d = Date.create(date);

    function zeroPad(d) {
      return (`0${d}`).slice(-2);
    }

    const parsed = new Date(d);

    return [parsed.getUTCFullYear(), zeroPad(parsed.getMonth() + 1), zeroPad(parsed.getDate()), zeroPad(parsed.getHours()), zeroPad(parsed.getMinutes()), zeroPad(parsed.getSeconds())].join(' ');
  }

  static toJavacsript(date) {
    return Date.create(date);
  }
}


const x = DateConversion.toPostgres('next thursday at noon');
console.log(DateConversion.toJavacsript('next friday at 4pm'));
console.log(x);
