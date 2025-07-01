/**
 * 日期工具函数库，访问http://localhost:5173/date-utils-demo即可看到
 *
 * 功能：
 * 1. 日期格式化
 * 2. 日期解析
 * 3. 日期加减
 * 4. 日期比较
 * 5. 日期差值计算
 * 6. 工作日计算
 * 7. 日期范围生成
 */

// 日期格式化
export function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const milliseconds = String(date.getMilliseconds()).padStart(3, '0');

    return format
        .replace('YYYY', year)
        .replace('YY', String(year).slice(-2))
        .replace('MM', month)
        .replace('M', parseInt(month))
        .replace('DD', day)
        .replace('D', parseInt(day))
        .replace('HH', hours)
        .replace('H', parseInt(hours))
        .replace('mm', minutes)
        .replace('m', parseInt(minutes))
        .replace('ss', seconds)
        .replace('s', parseInt(seconds))
        .replace('SSS', milliseconds)
        .replace('SS', milliseconds.slice(0, 2))
        .replace('S', parseInt(milliseconds));
}

// 日期解析
export function parseDate(dateString, format = 'YYYY-MM-DD') {
    if (!dateString) return null;

    // 处理常见格式
    if (format === 'YYYY-MM-DD') {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    if (format === 'YYYY-MM-DD HH:mm:ss') {
        const [datePart, timePart] = dateString.split(' ');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hours, minutes, seconds] = timePart.split(':').map(Number);
        return new Date(year, month - 1, day, hours, minutes, seconds);
    }

    if (format === 'DD/MM/YYYY') {
        const [day, month, year] = dateString.split('/').map(Number);
        return new Date(year, month - 1, day);
    }

    if (format === 'MM/DD/YYYY') {
        const [month, day, year] = dateString.split('/').map(Number);
        return new Date(year, month - 1, day);
    }

    // 默认处理ISO格式
    return new Date(dateString);
}

// 日期加减
export function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

export function addMonths(date, months) {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
}

export function addYears(date, years) {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
}

export function addHours(date, hours) {
    const result = new Date(date);
    result.setHours(result.getHours() + hours);
    return result;
}

export function addMinutes(date, minutes) {
    const result = new Date(date);
    result.setMinutes(result.getMinutes() + minutes);
    return result;
}

// 日期比较
export function isSameDay(date1, date2) {
    if (!(date1 instanceof Date)) date1 = new Date(date1);
    if (!(date2 instanceof Date)) date2 = new Date(date2);

    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
}

export function isBefore(date1, date2) {
    if (!(date1 instanceof Date)) date1 = new Date(date1);
    if (!(date2 instanceof Date)) date2 = new Date(date2);

    return date1 < date2;
}

export function isAfter(date1, date2) {
    if (!(date1 instanceof Date)) date1 = new Date(date1);
    if (!(date2 instanceof Date)) date2 = new Date(date2);

    return date1 > date2;
}

// 日期差值计算
export function diffInDays(date1, date2) {
    if (!(date1 instanceof Date)) date1 = new Date(date1);
    if (!(date2 instanceof Date)) date2 = new Date(date2);

    const diffTime = Math.abs(date2 - date1);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

export function diffInHours(date1, date2) {
    if (!(date1 instanceof Date)) date1 = new Date(date1);
    if (!(date2 instanceof Date)) date2 = new Date(date2);

    const diffTime = Math.abs(date2 - date1);
    return Math.floor(diffTime / (1000 * 60 * 60));
}

export function diffInMinutes(date1, date2) {
    if (!(date1 instanceof Date)) date1 = new Date(date1);
    if (!(date2 instanceof Date)) date2 = new Date(date2);

    const diffTime = Math.abs(date2 - date1);
    return Math.floor(diffTime / (1000 * 60));
}

// 工作日计算
export function isWeekend(date) {
    if (!(date instanceof Date)) date = new Date(date);
    const day = date.getDay();
    return day === 0 || day === 6;
}

export function isWeekday(date) {
    return !isWeekend(date);
}

export function addBusinessDays(date, days) {
    let result = new Date(date);
    let count = 0;

    while (count < days) {
        result = addDays(result, 1);
        if (isWeekday(result)) {
            count++;
        }
    }

    return result;
}

// 日期范围生成
export function getDateRange(startDate, endDate, step = 1, unit = 'days') {
    const dates = [];
    let current = new Date(startDate);

    while (current <= endDate) {
        dates.push(new Date(current));

        switch (unit) {
            case 'days':
                current = addDays(current, step);
                break;
            case 'weeks':
                current = addDays(current, step * 7);
                break;
            case 'months':
                current = addMonths(current, step);
                break;
            case 'years':
                current = addYears(current, step);
                break;
            default:
                current = addDays(current, step);
        }
    }

    return dates;
}

// 获取月份的第一天和最后一天
export function getMonthStart(date) {
    if (!(date instanceof Date)) date = new Date(date);
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function getMonthEnd(date) {
    if (!(date instanceof Date)) date = new Date(date);
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

// 获取年份的第一天和最后一天
export function getYearStart(date) {
    if (!(date instanceof Date)) date = new Date(date);
    return new Date(date.getFullYear(), 0, 1);
}

export function getYearEnd(date) {
    if (!(date instanceof Date)) date = new Date(date);
    return new Date(date.getFullYear(), 11, 31);
}

// 获取季度
export function getQuarter(date) {
    if (!(date instanceof Date)) date = new Date(date);
    const month = date.getMonth();
    return Math.floor(month / 3) + 1;
}

// 获取季度开始和结束日期
export function getQuarterStart(date) {
    if (!(date instanceof Date)) date = new Date(date);
    const quarter = getQuarter(date);
    const startMonth = (quarter - 1) * 3;
    return new Date(date.getFullYear(), startMonth, 1);
}

export function getQuarterEnd(date) {
    if (!(date instanceof Date)) date = new Date(date);
    const quarter = getQuarter(date);
    const endMonth = quarter * 3;
    return new Date(date.getFullYear(), endMonth, 0);
}

// 获取相对时间描述
export function getRelativeTime(date) {
    if (!(date instanceof Date)) date = new Date(date);

    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
        return `${diffInSeconds}秒前`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes}分钟前`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours}小时前`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays}天前`;
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) {
        return `${diffInWeeks}周前`;
    }

    return formatDate(date, 'YYYY年MM月DD日');
}

export default {
    formatDate,
    parseDate,
    addDays,
    addMonths,
    addYears,
    addHours,
    addMinutes,
    isSameDay,
    isBefore,
    isAfter,
    diffInDays,
    diffInHours,
    diffInMinutes,
    isWeekend,
    isWeekday,
    addBusinessDays,
    getDateRange,
    getMonthStart,
    getMonthEnd,
    getYearStart,
    getYearEnd,
    getQuarter,
    getQuarterStart,
    getQuarterEnd,
    getRelativeTime
};