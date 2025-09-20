import React, { forwardRef, useEffect, useRef, useState } from 'react'

interface AnimatedDivProps extends React.HTMLAttributes<HTMLDivElement> {
    animation?: 'fade-in' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale-in' | 'zoom-in' | 'flip' | 'bounce-in'
    delay?: number
    duration?: number
    easing?: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear'
    threshold?: number
    triggerOnce?: boolean
    children: React.ReactNode
}

const AnimatedDiv = forwardRef<HTMLDivElement, AnimatedDivProps>(({
    animation = 'fade-in',
    delay = 0,
    duration = 600,
    easing = 'ease-out',
    threshold = 0.1,
    triggerOnce = true,
    children,
    className = '',
    style,
    ...props
}, ref) => {
    const [isVisible, setIsVisible] = useState(false)
    const elementRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    if (triggerOnce) {
                        observer.disconnect()
                    }
                } else if (!triggerOnce) {
                    setIsVisible(false)
                }
            },
            {
                threshold,
                rootMargin: '50px'
            }
        )

        if (elementRef.current) {
            observer.observe(elementRef.current)
        }

        return () => observer.disconnect()
    }, [threshold, triggerOnce])

    const getAnimationStyles = () => {
        const baseStyles = {
            transition: `all ${duration}ms ${easing}`,
            transitionDelay: `${delay}ms`,
        }

        if (!isVisible) {
            switch (animation) {
                case 'fade-in':
                    return {
                        ...baseStyles,
                        opacity: 0,
                        transform: 'translateY(20px)',
                    }
                case 'slide-up':
                    return {
                        ...baseStyles,
                        opacity: 0,
                        transform: 'translateY(50px)',
                    }
                case 'slide-down':
                    return {
                        ...baseStyles,
                        opacity: 0,
                        transform: 'translateY(-50px)',
                    }
                case 'slide-left':
                    return {
                        ...baseStyles,
                        opacity: 0,
                        transform: 'translateX(50px)',
                    }
                case 'slide-right':
                    return {
                        ...baseStyles,
                        opacity: 0,
                        transform: 'translateX(-50px)',
                    }
                case 'scale-in':
                    return {
                        ...baseStyles,
                        opacity: 0,
                        transform: 'scale(0.8)',
                    }
                case 'zoom-in':
                    return {
                        ...baseStyles,
                        opacity: 0,
                        transform: 'scale(0.3)',
                    }
                case 'flip':
                    return {
                        ...baseStyles,
                        opacity: 0,
                        transform: 'perspective(400px) rotateY(-90deg)',
                    }
                case 'bounce-in':
                    return {
                        ...baseStyles,
                        opacity: 0,
                        transform: 'scale(0.3)',
                    }
                default:
                    return {
                        ...baseStyles,
                        opacity: 0,
                        transform: 'translateY(20px)',
                    }
            }
        }

        return {
            ...baseStyles,
            opacity: 1,
            transform: 'translateY(0) translateX(0) scale(1) rotateY(0deg)',
        }
    }

    return (
        <div
            ref={ref || elementRef}
            className={className}
            style={{
                ...getAnimationStyles(),
                ...style,
            }}
            {...props}
        >
            {children}
        </div>
    )
})

AnimatedDiv.displayName = 'AnimatedDiv'

export default AnimatedDiv