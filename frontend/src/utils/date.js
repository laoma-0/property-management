/**
 * 格式化日期时间
 * @param {Date|string|number} date - 需要格式化的日期
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date) {
    if (!date) return ''

    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}`
}