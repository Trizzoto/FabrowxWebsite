"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  opacity: number
  life: number
  maxLife: number
}

export function ParticleContainer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0, radius: 150 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas to full screen
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    // Mouse move event
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.x
      mouseRef.current.y = e.y
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Create particles
    const createParticles = () => {
      const particle: Particle = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: Math.random() * 1 - 0.5,
        speedY: Math.random() * 1 - 0.5,
        color: getRandomColor(),
        opacity: Math.random() * 0.5 + 0.1,
        life: 0,
        maxLife: Math.random() * 100 + 50,
      }

      particlesRef.current.push(particle)

      // Limit particles to prevent performance issues
      if (particlesRef.current.length > 100) {
        particlesRef.current.shift()
      }
    }

    // Get random blue-ish color
    const getRandomColor = () => {
      const blueHue = Math.floor(Math.random() * 40) + 200 // 200-240 for blue hues
      return `hsl(${blueHue}, 100%, 50%)`
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create new particles occasionally
      if (Math.random() > 0.9) {
        createParticles()
      }

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Increase life
        particle.life++

        // Remove dead particles
        if (particle.life >= particle.maxLife) {
          particlesRef.current.splice(index, 1)
          return
        }

        // Fade out as life increases
        const fadeRatio = 1 - particle.life / particle.maxLife

        // Mouse interaction
        const dx = particle.x - mouseRef.current.x
        const dy = particle.y - mouseRef.current.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < mouseRef.current.radius) {
          const angle = Math.atan2(dy, dx)
          const force = (mouseRef.current.radius - distance) / mouseRef.current.radius

          particle.x += Math.cos(angle) * force * 2
          particle.y += Math.sin(angle) * force * 2
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.opacity * fadeRatio
        ctx.fill()

        // Draw connecting lines between nearby particles
        particlesRef.current.forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.strokeStyle = particle.color
            ctx.globalAlpha = ((particle.opacity * fadeRatio * (100 - distance)) / 100) * 0.5
            ctx.lineWidth = 0.5
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
          }
        })
      })

      requestAnimationFrame(animate)
    }

    // Start animation
    animate()

    // Initial particles
    for (let i = 0; i < 50; i++) {
      createParticles()
    }

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 bg-transparent pointer-events-none" />
}

