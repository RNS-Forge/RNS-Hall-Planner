// Storage utility functions for RNS Hall Planner

interface StorageData {
    [key: string]: any
}

class StorageManager {
    // Local Storage methods
    static setLocal(key: string, data: any): void {
        try {
            localStorage.setItem(key, JSON.stringify(data))
        } catch (error) {
            console.error('Error saving to localStorage:', error)
        }
    }

    static getLocal<T>(key: string): T | null {
        try {
            const data = localStorage.getItem(key)
            return data ? JSON.parse(data) : null
        } catch (error) {
            console.error('Error reading from localStorage:', error)
            return null
        }
    }

    static removeLocal(key: string): void {
        try {
            localStorage.removeItem(key)
        } catch (error) {
            console.error('Error removing from localStorage:', error)
        }
    }

    static clearLocal(): void {
        try {
            localStorage.clear()
        } catch (error) {
            console.error('Error clearing localStorage:', error)
        }
    }

    // Session Storage methods
    static setSession(key: string, data: any): void {
        try {
            sessionStorage.setItem(key, JSON.stringify(data))
        } catch (error) {
            console.error('Error saving to sessionStorage:', error)
        }
    }

    static getSession<T>(key: string): T | null {
        try {
            const data = sessionStorage.getItem(key)
            return data ? JSON.parse(data) : null
        } catch (error) {
            console.error('Error reading from sessionStorage:', error)
            return null
        }
    }

    static removeSession(key: string): void {
        try {
            sessionStorage.removeItem(key)
        } catch (error) {
            console.error('Error removing from sessionStorage:', error)
        }
    }

    static clearSession(): void {
        try {
            sessionStorage.clear()
        } catch (error) {
            console.error('Error clearing sessionStorage:', error)
        }
    }

    // Check if storage is available
    static isStorageAvailable(type: 'localStorage' | 'sessionStorage'): boolean {
        try {
            const storage = window[type]
            const test = '__storage_test__'
            storage.setItem(test, test)
            storage.removeItem(test)
            return true
        } catch {
            return false
        }
    }

    // App-specific storage methods
    static saveHallPlanData(data: StorageData): void {
        this.setLocal('hallPlanData', {
            ...data,
            timestamp: new Date().toISOString()
        })
    }

    static getHallPlanData(): StorageData | null {
        return this.getLocal('hallPlanData')
    }

    static saveWorkInProgress(data: StorageData): void {
        this.setSession('workInProgress', {
            ...data,
            timestamp: new Date().toISOString()
        })
    }

    static getWorkInProgress(): StorageData | null {
        return this.getSession('workInProgress')
    }

    static clearAllData(): void {
        this.removeLocal('hallPlanData')
        this.removeSession('workInProgress')
        this.removeLocal('collegeInfo')
        this.removeLocal('hallConfig')
        this.removeLocal('classes')
        this.removeLocal('csvData')
        this.removeLocal('generatedPlans')
    }

    // Save individual data pieces
    static saveCollegeInfo(data: any): void {
        this.setLocal('collegeInfo', data)
    }

    static getCollegeInfo(): any {
        return this.getLocal('collegeInfo')
    }

    static saveHallConfig(data: any): void {
        this.setLocal('hallConfig', data)
    }

    static getHallConfig(): any {
        return this.getLocal('hallConfig')
    }

    static saveClasses(data: any): void {
        this.setLocal('classes', data)
    }

    static getClasses(): any {
        return this.getLocal('classes')
    }

    static saveCsvData(data: any): void {
        this.setLocal('csvData', data)
    }

    static getCsvData(): any {
        return this.getLocal('csvData')
    }

    static saveGeneratedPlans(data: any): void {
        this.setLocal('generatedPlans', data)
    }

    static getGeneratedPlans(): any {
        return this.getLocal('generatedPlans')
    }
}

export default StorageManager