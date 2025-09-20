import React, { useState, useRef, useEffect } from 'react'

interface SparkleEffectProps {
    children: React.ReactNode
    color?: string
    size?: number
    count?: number
    className?: string
}

const SparkleEffect: React.FC<SparkleEffectProps> = ({
    children,
    color = '#fbbf24',
    size = 10,
    count = 3,
    className = ''
}) => {
    const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])
    const containerRef = useRef<HTMLDivElement>(null)

    const generateSparkle = () => ({
        id: Math.random(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2000
    })

    useEffect(() => {
        const interval = setInterval(() => {
            setSparkles(current => {
                const newSparkles = [...current, generateSparkle()]
                return newSparkles.slice(-count)
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [count])

    return (
        <div ref={containerRef} className={`relative inline-block ${className}`}>
            {children}

            {/* Sparkles */}
            {sparkles.map(sparkle => (
                <div
                    key={sparkle.id}
                    className="absolute pointer-events-none animate-ping"
                    style={{
                        left: `${sparkle.x}%`,
                        top: `${sparkle.y}%`,
                        animationDelay: `${sparkle.delay}ms`,
                        animationDuration: '1.5s'
                    }}
                >
                    <div
                        className="w-2 h-2 rounded-full opacity-70"
                        style={{
                            backgroundColor: color,
                            width: size,
                            height: size,
                            boxShadow: `0 0 ${size}px ${color}`
                        }}
                    />
                </div>
            ))}
        </div>
    )
}

export default SparkleEffect