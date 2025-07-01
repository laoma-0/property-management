<template>
  <div class="date-utils-demo">
    <div class="header">
      <h1>日期工具函数演示</h1>
      <p class="subtitle">封装了各种日期处理功能，满足项目开发需求</p>
    </div>

    <div class="demo-container">
      <div class="current-time">
        <h2>当前时间</h2>
        <div class="time-display">{{ currentTime }}</div>
      </div>

      <div class="demo-section">
        <h2>日期格式化</h2>
        <div class="demo-content">
          <div>默认格式: {{ formatDate(now) }}</div>
          <div>短日期: {{ formatDate(now, 'YYYY-MM-DD') }}</div>
          <div>中文格式: {{ formatDate(now, 'YYYY年MM月DD日 HH时mm分ss秒') }}</div>
          <div>自定义格式: {{ formatDate(now, 'DD/MM/YYYY HH:mm') }}</div>
          <div>包含毫秒: {{ formatDate(now, 'YYYY-MM-DD HH:mm:ss.SSS') }}</div>
        </div>
      </div>

      <div class="demo-section">
        <h2>日期解析</h2>
        <div class="demo-content">
          <div>解析 '2023-05-15': {{ parseDate('2023-05-15') }}</div>
          <div>解析 '15/05/2023': {{ parseDate('15/05/2023', 'DD/MM/YYYY') }}</div>
          <div>解析 '05/15/2023': {{ parseDate('05/15/2023', 'MM/DD/YYYY') }}</div>
          <div>解析 '2023-05-15 14:30:00': {{ parseDate('2023-05-15 14:30:00', 'YYYY-MM-DD HH:mm:ss') }}</div>
        </div>
      </div>

      <div class="demo-section">
        <h2>日期加减</h2>
        <div class="demo-content">
          <div>加3天: {{ formatDate(addDays(now, 3)) }}</div>
          <div>加2个月: {{ formatDate(addMonths(now, 2)) }}</div>
          <div>加1年: {{ formatDate(addYears(now, 1)) }}</div>
          <div>加5小时: {{ formatDate(addHours(now, 5)) }}</div>
          <div>加30分钟: {{ formatDate(addMinutes(now, 30)) }}</div>
        </div>
      </div>

      <div class="demo-section">
        <h2>日期比较</h2>
        <div class="demo-content">
          <div>昨天和今天是否同一天: {{ isSameDay(yesterday, now) }}</div>
          <div>今天是否在昨天之后: {{ isAfter(now, yesterday) }}</div>
          <div>昨天是否在今天之前: {{ isBefore(yesterday, now) }}</div>
        </div>
      </div>

      <div class="demo-section">
        <h2>日期差值</h2>
        <div class="demo-content">
          <div>今天和明天相差: {{ diffInDays(now, tomorrow) }} 天</div>
          <div>现在和1小时后相差: {{ diffInHours(now, addHours(now, 1)) }} 小时</div>
          <div>现在和30分钟后相差: {{ diffInMinutes(now, addMinutes(now, 30)) }} 分钟</div>
        </div>
      </div>

      <div class="demo-section">
        <h2>工作日计算</h2>
        <div class="demo-content">
          <div>今天是周末吗: {{ isWeekend(now) }}</div>
          <div>今天是工作日吗: {{ isWeekday(now) }}</div>
          <div>加5个工作日: {{ formatDate(addBusinessDays(now, 5)) }}</div>
        </div>
      </div>

      <div class="demo-section">
        <h2>日期范围</h2>
        <div class="demo-content">
          <div>本月开始: {{ formatDate(getMonthStart(now)) }}</div>
          <div>本月结束: {{ formatDate(getMonthEnd(now)) }}</div>
          <div>本季度开始: {{ formatDate(getQuarterStart(now)) }}</div>
          <div>本季度结束: {{ formatDate(getQuarterEnd(now)) }}</div>
          <div>本周日期:
            <div v-for="(date, index) in weekDates" :key="index" class="date-item">
              {{ formatDate(date, 'YYYY-MM-DD (dddd)') }}
            </div>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <h2>相对时间</h2>
        <div class="demo-content">
          <div>10秒前: {{ getRelativeTime(addSeconds(now, -10)) }}</div>
          <div>45分钟前: {{ getRelativeTime(addMinutes(now, -45)) }}</div>
          <div>5小时前: {{ getRelativeTime(addHours(now, -5)) }}</div>
          <div>3天前: {{ getRelativeTime(addDays(now, -3)) }}</div>
          <div>2周前: {{ getRelativeTime(addDays(now, -14)) }}</div>
          <div>1年前: {{ getRelativeTime(addYears(now, -1)) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
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
  getQuarterStart,
  getQuarterEnd,
  getRelativeTime
} from '@/utils/dateUtils'

export default {
  name: 'DateUtilsDemo',
  data() {
    return {
      now: new Date(),
      currentTime: '',
      timer: null
    }
  },
  computed: {
    yesterday() {
      return addDays(this.now, -1);
    },
    tomorrow() {
      return addDays(this.now, 1);
    },
    weekDates() {
      const start = addDays(this.now, -this.now.getDay());
      return getDateRange(start, addDays(start, 6));
    }
  },
  methods: {
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
    getMonthStart,
    getMonthEnd,
    getQuarterStart,
    getQuarterEnd,
    getRelativeTime,
    addSeconds(date, seconds) {
      return new Date(date.getTime() + seconds * 1000);
    }
  },
  mounted() {
    // 更新当前时间
    this.timer = setInterval(() => {
      this.now = new Date();
      this.currentTime = formatDate(this.now);
    }, 1000);
  },
  beforeUnmount() {
    clearInterval(this.timer);
  }
}
</script>

<style scoped>
.date-utils-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  padding: 20px;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.header h1 {
  margin: 0;
  font-size: 2.5rem;
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-top: 10px;
}

.demo-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.demo-section {
  padding: 25px;
  border-bottom: 1px solid #eee;
  transition: background-color 0.3s;
}

.demo-section:hover {
  background-color: #f9f9ff;
}

.demo-section h2 {
  color: #2c3e50;
  margin-top: 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
  font-size: 1.5rem;
}

.demo-content {
  padding: 15px 0;
  line-height: 1.8;
  font-size: 1.1rem;
}

.current-time {
  text-align: center;
  padding: 30px;
  background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%);
  color: white;
}

.time-display {
  font-size: 2.5rem;
  font-weight: bold;
  letter-spacing: 2px;
  margin-top: 15px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.date-item {
  padding: 8px 12px;
  margin: 5px 0;
  background-color: #f0f8ff;
  border-radius: 6px;
  font-family: monospace;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .date-utils-demo {
    padding: 10px;
  }

  .header h1 {
    font-size: 1.8rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .time-display {
    font-size: 1.8rem;
  }
}
</style>