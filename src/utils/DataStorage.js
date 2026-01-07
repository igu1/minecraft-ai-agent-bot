class DataStorage {
  constructor(dataPath = './data') {
    this.dataPath = dataPath
    this.fs = require('fs')
    this.path = require('path')
    
    this.ensureDataDirectory()
  }

  ensureDataDirectory() {
    if (!this.fs.existsSync(this.dataPath)) {
      this.fs.mkdirSync(this.dataPath, { recursive: true })
    }
  }

  getFilePath(key) {
    return this.path.join(this.dataPath, `${key}.json`)
  }

  set(key, data) {
    try {
      const filePath = this.getFilePath(key)
      const jsonData = JSON.stringify(data, null, 2)
      this.fs.writeFileSync(filePath, jsonData)
      return true
    } catch (error) {
      console.error(`Failed to save data for key "${key}":`, error.message)
      return false
    }
  }

  get(key, defaultValue = null) {
    try {
      const filePath = this.getFilePath(key)
      
      if (!this.fs.existsSync(filePath)) {
        return defaultValue
      }
      
      const jsonData = this.fs.readFileSync(filePath, 'utf8')
      return JSON.parse(jsonData)
    } catch (error) {
      console.error(`Failed to load data for key "${key}":`, error.message)
      return defaultValue
    }
  }

  has(key) {
    const filePath = this.getFilePath(key)
    return this.fs.existsSync(filePath)
  }

  delete(key) {
    try {
      const filePath = this.getFilePath(key)
      if (this.fs.existsSync(filePath)) {
        this.fs.unlinkSync(filePath)
        return true
      }
      return false
    } catch (error) {
      console.error(`Failed to delete data for key "${key}":`, error.message)
      return false
    }
  }

  listKeys() {
    try {
      const files = this.fs.readdirSync(this.dataPath)
      return files
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''))
    } catch (error) {
      console.error('Failed to list data keys:', error.message)
      return []
    }
  }

  clear() {
    try {
      const files = this.fs.readdirSync(this.dataPath)
      files.forEach(file => {
        const filePath = this.path.join(this.dataPath, file)
        this.fs.unlinkSync(filePath)
      })
      return true
    } catch (error) {
      console.error('Failed to clear data:', error.message)
      return false
    }
  }

  backup() {
    const backup = {}
    const keys = this.listKeys()
    
    keys.forEach(key => {
      backup[key] = this.get(key)
    })
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupPath = this.path.join(this.dataPath, `backup_${timestamp}.json`)
    
    try {
      this.fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2))
      return backupPath
    } catch (error) {
      console.error('Failed to create backup:', error.message)
      return null
    }
  }
}

module.exports = DataStorage
