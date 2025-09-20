import React from 'react'

interface ParallaxContainerProps {
    children: React.ReactNode
    speed?: number
    direction?: 'up' | 'down' | 'left' | 'right'
    className?: string
}

const ParallaxContainer: React.FC<ParallaxContainerProps> = ({
    children,
    speed = 0.5,
    direction = 'up',
    className = ''
}) => {
    const [offset, setOffset] = React.useState(0)

    React.useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.pageYOffset
            const parallax = scrolled * speed

            setOffset(parallax)
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [speed])

    const getTransform = () => {
        switch (direction) {
            case 'up':
                return `translateY(-${offset}px)`
            case 'down':
                return `translateY(${offset}px)`
            case 'left':
                return `translateX(-${offset}px)`
            case 'right':
                return `translateX(${offset}px)`
            default:
                return `translateY(-${offset}px)`
        }
    }

    return (
        <div
            className={`${className}`}
            style={{
                transform: getTransform(),
                willChange: 'transform'
            }}
        >
            {children}
        </div>
    )
}

export default ParallaxContainer