class TimeUtils {
  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  static formatDuration(ms) {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`
    } else {
      return `${seconds}s`
    }
  }

  static formatTimestamp(date = new Date()) {
    return date.toISOString().replace('T', ' ').substring(0, 19)
  }

  static getTimeOfDay(minecraftTime) {
    const time = minecraftTime.timeOfDay || 0
    const hours = Math.floor((time + 6000) / 1000) % 24
    
    if (hours >= 6 && hours < 12) return 'morning'
    if (hours >= 12 && hours < 18) return 'afternoon'
    if (hours >= 18 && hours < 22) return 'evening'
    return 'night'
  }

  static isNighttime(minecraftTime) {
    return this.getTimeOfDay(minecraftTime) === 'night'
  }

  static isDaytime(minecraftTime) {
    return !this.isNighttime(minecraftTime)
  }

  static async waitForCondition(condition, timeout = 30000, checkInterval = 1000) {
    const startTime = Date.now()
    
    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return true
      }
      await this.sleep(checkInterval)
    }
    
    return false
  }

  static async retry(fn, maxRetries = 3, delay = 1000) {
    let lastError
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error
        if (i < maxRetries - 1) {
          await this.sleep(delay * Math.pow(2, i))
        }
      }
    }
    
    throw lastError
  }

  static debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  static throttle(func, limit) {
    let inThrottle
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }
}

module.exports = TimeUtils
