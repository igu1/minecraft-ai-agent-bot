class MathUtils {
  static distance(pos1, pos2) {
    return Math.sqrt(
      Math.pow(pos1.x - pos2.x, 2) +
      Math.pow(pos1.y - pos2.y, 2) +
      Math.pow(pos1.z - pos2.z, 2)
    )
  }

  static distance2D(pos1, pos2) {
    return Math.sqrt(
      Math.pow(pos1.x - pos2.x, 2) +
      Math.pow(pos1.z - pos2.z, 2)
    )
  }

  static clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
  }

  static lerp(start, end, factor) {
    return start + (end - start) * factor
  }

  static randomBetween(min, max) {
    return Math.random() * (max - min) + min
  }

  static randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  static normalizeVector(vector) {
    const magnitude = Math.sqrt(vector.x * vector.x + vector.y * vector.y + vector.z * vector.z)
    if (magnitude === 0) return { x: 0, y: 0, z: 0 }
    
    return {
      x: vector.x / magnitude,
      y: vector.y / magnitude,
      z: vector.z / magnitude
    }
  }

  static addVectors(v1, v2) {
    return {
      x: v1.x + v2.x,
      y: v1.y + v2.y,
      z: v1.z + v2.z
    }
  }

  static subtractVectors(v1, v2) {
    return {
      x: v1.x - v2.x,
      y: v1.y - v2.y,
      z: v1.z - v2.z
    }
  }

  static scaleVector(vector, scalar) {
    return {
      x: vector.x * scalar,
      y: vector.y * scalar,
      z: vector.z * scalar
    }
  }

  static dotProduct(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z
  }

  static angleBetween(v1, v2) {
    const dot = this.dotProduct(v1, v2)
    const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z)
    const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y + v2.z * v2.z)
    
    if (mag1 === 0 || mag2 === 0) return 0
    
    return Math.acos(dot / (mag1 * mag2))
  }
}

module.exports = MathUtils
