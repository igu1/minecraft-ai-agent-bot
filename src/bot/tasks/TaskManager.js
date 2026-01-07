class TaskManager {
  constructor() {
    this.tasks = new Map()
    this.taskQueue = []
    this.currentTask = null
  }

  addTask(task) {
    const taskId = this.generateTaskId()
    const taskObj = {
      id: taskId,
      ...task,
      status: 'pending',
      createdAt: Date.now()
    }
    
    this.tasks.set(taskId, taskObj)
    this.taskQueue.push(taskObj)
    
    console.log(`Task added: ${task.name} (ID: ${taskId})`)
    return taskId
  }

  getNextTask() {
    const pendingTasks = this.taskQueue.filter(task => task.status === 'pending')
    
    if (pendingTasks.length === 0) return null
    
    pendingTasks.sort((a, b) => {
      const priorityA = a.priority || 0
      const priorityB = b.priority || 0
      return priorityB - priorityA
    })
    
    return pendingTasks[0]
  }

  async executeNextTask() {
    if (this.currentTask && this.currentTask.status === 'running') {
      return this.currentTask
    }
    
    const nextTask = this.getNextTask()
    if (!nextTask) return null
    
    this.currentTask = nextTask
    nextTask.status = 'running'
    nextTask.startedAt = Date.now()
    
    console.log(`Executing task: ${nextTask.name}`)
    
    try {
      await nextTask.execute()
      nextTask.status = 'completed'
      nextTask.completedAt = Date.now()
      console.log(`Task completed: ${nextTask.name}`)
    } catch (error) {
      nextTask.status = 'failed'
      nextTask.error = error.message
      console.error(`Task failed: ${nextTask.name} - ${error.message}`)
    }
    
    this.currentTask = null
    return nextTask
  }

  cancelTask(taskId) {
    const task = this.tasks.get(taskId)
    if (task) {
      task.status = 'cancelled'
      console.log(`Task cancelled: ${task.name}`)
      return true
    }
    return false
  }

  getTaskStatus(taskId) {
    return this.tasks.get(taskId)
  }

  getAllTasks() {
    return Array.from(this.tasks.values())
  }

  getTasksByStatus(status) {
    return this.getAllTasks().filter(task => task.status === status)
  }

  clearCompletedTasks() {
    const completedTasks = this.getTasksByStatus('completed')
    completedTasks.forEach(task => {
      this.tasks.delete(task.id)
      const index = this.taskQueue.findIndex(t => t.id === task.id)
      if (index !== -1) {
        this.taskQueue.splice(index, 1)
      }
    })
    
    console.log(`Cleared ${completedTasks.length} completed tasks`)
  }

  generateTaskId() {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

module.exports = TaskManager
