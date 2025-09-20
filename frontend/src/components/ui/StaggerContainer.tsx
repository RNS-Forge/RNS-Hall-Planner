import React, { useEffect, useState } from 'react'

interface StaggerContainerProps {
    children: React.ReactNode
    staggerDelay?: number
    className?: string
    animation?: 'fade-up' | 'fade-in' | 'scale-in' | 'slide-left' | 'slide-right'
    threshold?: number
}

const StaggerContainer: React.FC<StaggerContainerProps> = ({
    children,
    staggerDelay = 100,
    className = '',
    animation = 'fade-up',
    threshold = 0.1
}) => {
    const [isVisible, setIsVisible] = useState(false)
    const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!containerRef) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.disconnect()
                }
            },
            {
                threshold,
                rootMargin: '50px'
            }
        )

        observer.observe(containerRef)

        return () => observer.disconnect()
    }, [containerRef, threshold])

    const getAnimationClasses = (index: number) => {
        const delay = isVisible ? index * staggerDelay : 0

        const baseClasses = `transition-all duration-600 ease-out`
        const delayStyle = { transitionDelay: `${delay}ms` }

        if (!isVisible) {
            switch (animation) {
                case 'fade-up':
                    return {
                        className: `${baseClasses} opacity-0 translate-y-8`,
                        style: delayStyle
                    }
                case 'fade-in':
                    return {
                        className: `${baseClasses} opacity-0`,
                        style: delayStyle
                    }
                case 'scale-in':
                    return {
                        className: `${baseClasses} opacity-0 scale-90`,
                        style: delayStyle
                    }
                case 'slide-left':
                    return {
                        className: `${baseClasses} opacity-0 translate-x-8`,
                        style: delayStyle
                    }
                case 'slide-right':
                    return {
                        className: `${baseClasses} opacity-0 -translate-x-8`,
                        style: delayStyle
                    }
                default:
                    return {
                        className: `${baseClasses} opacity-0 translate-y-8`,
                        style: delayStyle
                    }
            }
        }

        return {
            className: `${baseClasses} opacity-100 translate-y-0 translate-x-0 scale-100`,
            style: delayStyle
        }
    }

    return (
        <div
            ref={setContainerRef}
            className={className}
            style={{ '--stagger-delay': `${staggerDelay}ms` } as React.CSSProperties}
        >
            {React.Children.map(children, (child, index) => {
                if (!React.isValidElement(child)) return child

                const { className: animClassName, style: animStyle } = getAnimationClasses(index)

                return (
                    <div
                        key={index}
                        className={animClassName}
                        style={animStyle}
                    >
                        {child}
                    </div>
                )
            })}
        </div>
    )
}

export default StaggerContainer