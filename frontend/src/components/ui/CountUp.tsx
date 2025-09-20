import React, { useState, useEffect } from 'react'

interface CountUpProps {
    end: number
    start?: number
    duration?: number
    suffix?: string
    prefix?: string
    separator?: string
    decimals?: number
    className?: string
    delay?: number
}

const CountUp: React.FC<CountUpProps> = ({
    end,
    start = 0,
    duration = 2000,
    suffix = '',
    prefix = '',
    separator = ',',
    decimals = 0,
    className = '',
    delay = 0
}) => {
    const [current, setCurrent] = useState(start)
    const [hasStarted, setHasStarted] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setHasStarted(true)
        }, delay)

        return () => clearTimeout(timer)
    }, [delay])

    useEffect(() => {
        if (!hasStarted) return

        const range = end - start
        const increment = range / (duration / 16) // 60fps
        let current = start

        const timer = setInterval(() => {
            current += increment

            if (current >= end) {
                setCurrent(end)
                clearInterval(timer)
            } else {
                setCurrent(current)
            }
        }, 16)

        return () => clearInterval(timer)
    }, [start, end, duration, hasStarted])

    const formatNumber = (num: number) => {
        const fixed = num.toFixed(decimals)
        const parts = fixed.split('.')

        // Add thousand separators
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator)

        return parts.join('.')
    }

    return (
        <span className={className}>
            {prefix}{formatNumber(current)}{suffix}
        </span>
    )
}

export default CountUp