import React from 'react'
import type { LucideIcon } from 'lucide-react'

interface FloatingActionButtonProps {
    icon: LucideIcon
    onClick: () => void
    label?: string
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
    size?: 'sm' | 'md' | 'lg'
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
    className?: string
    disabled?: boolean
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
    icon: Icon,
    onClick,
    label,
    variant = 'primary',
    size = 'md',
    position = 'bottom-right',
    className = '',
    disabled = false,
}) => {
    const getVariantClasses = () => {
        switch (variant) {
            case 'primary':
                return 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-glow'
            case 'secondary':
                return 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-soft'
            case 'success':
                return 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-glow-success'
            case 'warning':
                return 'bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white'
            case 'error':
                return 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-glow-error'
            default:
                return 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-glow'
        }
    }

    const getSizeClasses = () => {
        switch (size) {
            case 'sm':
                return 'w-12 h-12'
            case 'md':
                return 'w-14 h-14'
            case 'lg':
                return 'w-16 h-16'
            default:
                return 'w-14 h-14'
        }
    }

    const getIconSize = () => {
        switch (size) {
            case 'sm':
                return 20
            case 'md':
                return 24
            case 'lg':
                return 28
            default:
                return 24
        }
    }

    const getPositionClasses = () => {
        switch (position) {
            case 'bottom-right':
                return 'bottom-6 right-6'
            case 'bottom-left':
                return 'bottom-6 left-6'
            case 'top-right':
                return 'top-6 right-6'
            case 'top-left':
                return 'top-6 left-6'
            default:
                return 'bottom-6 right-6'
        }
    }

    return (
        <div className={`fixed z-50 ${getPositionClasses()}`}>
            <button
                onClick={onClick}
                disabled={disabled}
                className={`
          ${getSizeClasses()}
          ${getVariantClasses()}
          rounded-full
          flex items-center justify-center
          transition-all duration-300 ease-out
          hover:scale-110 hover:shadow-xl
          active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          group
          ${className}
        `}
                aria-label={label}
            >
                <Icon size={getIconSize()} className="group-hover:scale-110 transition-transform duration-200" />

                {/* Ripple effect */}
                <div className="absolute inset-0 rounded-full bg-white opacity-0 group-active:opacity-20 group-active:animate-ping"></div>

                {/* Tooltip */}
                {label && (
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        <div className="bg-gray-900 text-white text-xs font-medium px-3 py-1 rounded-lg whitespace-nowrap">
                            {label}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                    </div>
                )}
            </button>
        </div>
    )
}

export default FloatingActionButton