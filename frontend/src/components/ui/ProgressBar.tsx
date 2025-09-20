import React, { useState, useEffect } from 'react'

interface ProgressBarProps {
    value: number
    max?: number
    variant?: 'default' | 'success' | 'warning' | 'error'
    size?: 'sm' | 'md' | 'lg'
    animated?: boolean
    showPercentage?: boolean
    className?: string
    label?: string
}

const ProgressBar: React.FC<ProgressBarProps> = ({
    value,
    max = 100,
    variant = 'default',
    size = 'md',
    animated = true,
    showPercentage = true,
    className = '',
    label
}) => {
    const [displayValue, setDisplayValue] = useState(0)

    useEffect(() => {
        if (animated) {
            const timer = setTimeout(() => {
                setDisplayValue(value)
            }, 100)
            return () => clearTimeout(timer)
        } else {
            setDisplayValue(value)
        }
    }, [value, animated])

    const percentage = Math.min((displayValue / max) * 100, 100)

    const getVariantClasses = () => {
        switch (variant) {
            case 'success':
                return 'from-green-400 to-emerald-500'
            case 'warning':
                return 'from-yellow-400 to-amber-500'
            case 'error':
                return 'from-red-400 to-rose-500'
            default:
                return 'from-yellow-400 to-orange-500'
        }
    }

    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'h-2'
            case 'md':
                return 'h-3'
            case 'lg':
                return 'h-4'
            default:
                return 'h-3'
        }
    }

    const getTextSize = () => {
        switch (size) {
            case 'sm':
                return 'text-xs'
            case 'md':
                return 'text-sm'
            case 'lg':
                return 'text-base'
            default:
                return 'text-sm'
        }
    }

    return (
        <div className={`w-full ${className}`}>
            {(label || showPercentage) && (
                <div className={`flex justify-between items-center mb-2 ${getTextSize()}`}>
                    {label && <span className="font-medium text-gray-700">{label}</span>}
                    {showPercentage && (
                        <span className="font-medium text-gray-600">
                            {Math.round(percentage)}%
                        </span>
                    )}
                </div>
            )}

            <div className={`bg-gray-200 rounded-full overflow-hidden ${getSizeClasses()}`}>
                <div
                    className={`
            bg-gradient-to-r ${getVariantClasses()}
            ${getSizeClasses()}
            rounded-full
            transition-all duration-500 ease-out
            relative
            ${animated ? 'animate-pulse' : ''}
          `}
                    style={{ width: `${percentage}%` }}
                >
                    {animated && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-slow"></div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProgressBar