import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Download, FileSpreadsheet, FileText, Users, MapPin, Loader2, RefreshCw, CheckCircle, Award, TrendingUp, Clock, Sparkles } from 'lucide-react'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import StorageManager from '../utils/storage'
import GeminiHallPlanner from '../utils/geminiAI'
import type { HallPlan, SeatingArrangement, StudentData, HallConfig, ClassInfo, CollegeInfo } from '../utils/geminiAI'

const ResultsPage = () => {
    const navigate = useNavigate()
    const [hallPlan, setHallPlan] = useState<HallPlan | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [optimizationSuggestions, setOptimizationSuggestions] = useState<string[]>([])
    const [exportLoading, setExportLoading] = useState<string | null>(null)

    useEffect(() => {
        generateHallPlan()
    }, [])

    const generateHallPlan = async () => {
        try {
            setLoading(true)
            setError(null)

            // Get data from localStorage
            const collegeInfo: CollegeInfo = StorageManager.getCollegeInfo()
            const hallConfig: HallConfig = StorageManager.getHallConfig()
            const classes: ClassInfo[] = StorageManager.getClasses()
            const csvData: StudentData[] = StorageManager.getCsvData()

            if (!collegeInfo || !hallConfig || !classes || !csvData) {
                throw new Error('Missing required data. Please go back and complete the form.')
            }

            // Initialize AI planner
            const planner = new GeminiHallPlanner()

            // Generate hall plan
            const plan = await planner.generateHallPlan(collegeInfo, hallConfig, classes, csvData)
            setHallPlan(plan)

            // Get optimization suggestions
            const suggestions = await planner.getOptimizationSuggestions(plan)
            setOptimizationSuggestions(suggestions)

            // Save generated plan
            StorageManager.saveGeneratedPlans(plan)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while generating the hall plan')
        } finally {
            setLoading(false)
        }
    }

    const exportToCSV = async () => {
        if (!hallPlan) return
        setExportLoading('csv')

        try {
            const csvData: any[] = []

            hallPlan.halls.forEach(hall => {
                hall.students.forEach((student, index) => {
                    csvData.push({
                        'Hall Number': hall.hallNumber,
                        'Class': hall.className,
                        'Bench Number': hall.benchNumber,
                        'Position': index + 1,
                        'Student ID': student['Student ID'],
                        'Student Name': student['Name'],
                        'Roll Number': student['Roll Number'],
                        'Subject': student['Subject']
                    })
                })
            })

            const csv = csvData.map(row => Object.values(row).join(',')).join('\n')
            const headers = Object.keys(csvData[0] || {}).join(',')
            const fullCsv = headers + '\n' + csv

            const blob = new Blob([fullCsv], { type: 'text/csv' })
            saveAs(blob, `hall-plan-${hallPlan.collegeInfo.name}-${new Date().toISOString().split('T')[0]}.csv`)
        } finally {
            setExportLoading(null)
        }
    }

    const exportToExcel = async () => {
        if (!hallPlan) return
        setExportLoading('excel')

        try {
            const workbook = XLSX.utils.book_new()

            // Summary sheet
            const summaryData = [
                ['College Information', ''],
                ['College Name', hallPlan.collegeInfo.name],
                ['Address', hallPlan.collegeInfo.address],
                ['Exam Type', hallPlan.examDetails.type],
                ['Subject', hallPlan.examDetails.subject],
                ['Date', hallPlan.examDetails.date],
                ['', ''],
                ['Summary Statistics', ''],
                ['Total Students', hallPlan.summary.totalStudents],
                ['Total Halls', hallPlan.summary.totalHalls],
                ['Total Benches', hallPlan.summary.totalBenches],
                ['Average Occupancy', hallPlan.summary.averageOccupancy.toFixed(1)]
            ]

            const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
            XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')

            // Detailed seating arrangement
            const detailData: any[] = []
            hallPlan.halls.forEach(hall => {
                hall.students.forEach((student, index) => {
                    detailData.push({
                        'Hall Number': hall.hallNumber,
                        'Class': hall.className,
                        'Bench Number': hall.benchNumber,
                        'Position': index + 1,
                        'Student ID': student['Student ID'],
                        'Student Name': student['Name'],
                        'Roll Number': student['Roll Number'],
                        'Subject': student['Subject']
                    })
                })
            })

            const detailSheet = XLSX.utils.json_to_sheet(detailData)
            XLSX.utils.book_append_sheet(workbook, detailSheet, 'Seating Arrangement')

            // Export
            XLSX.writeFile(workbook, `hall-plan-${hallPlan.collegeInfo.name}-${new Date().toISOString().split('T')[0]}.xlsx`)
        } finally {
            setExportLoading(null)
        }
    }

    const exportToText = async () => {
        if (!hallPlan) return
        setExportLoading('text')

        try {
            let textContent = `
RNS HALL PLANNER - SEATING ARRANGEMENT
=======================================

COLLEGE INFORMATION:
College: ${hallPlan.collegeInfo.name}
Address: ${hallPlan.collegeInfo.address}
Exam Type: ${hallPlan.examDetails.type}
Subject: ${hallPlan.examDetails.subject}
Date: ${hallPlan.examDetails.date}

SUMMARY:
Total Students: ${hallPlan.summary.totalStudents}
Total Halls: ${hallPlan.summary.totalHalls}
Total Benches: ${hallPlan.summary.totalBenches}
Average Occupancy: ${hallPlan.summary.averageOccupancy.toFixed(1)} students per hall

DETAILED SEATING ARRANGEMENT:
============================

`

            // Group by hall number
            const hallGroups: { [key: number]: SeatingArrangement[] } = {}
            hallPlan.halls.forEach(arrangement => {
                if (!hallGroups[arrangement.hallNumber]) {
                    hallGroups[arrangement.hallNumber] = []
                }
                hallGroups[arrangement.hallNumber].push(arrangement)
            })

            Object.keys(hallGroups).sort((a, b) => parseInt(a) - parseInt(b)).forEach(hallNum => {
                textContent += `HALL ${hallNum}:\n`
                textContent += `${'-'.repeat(50)}\n`

                hallGroups[parseInt(hallNum)].forEach(arrangement => {
                    textContent += `Bench ${arrangement.benchNumber} (${arrangement.className}):\n`
                    arrangement.students.forEach((student, index) => {
                        textContent += `  ${index + 1}. ${student['Student ID']} - ${student['Name']} (Roll: ${student['Roll Number']})\n`
                    })
                    textContent += '\n'
                })
                textContent += '\n'
            })

            if (optimizationSuggestions.length > 0) {
                textContent += '\nOPTIMIZATION SUGGESTIONS:\n'
                textContent += '========================\n'
                optimizationSuggestions.forEach((suggestion, index) => {
                    textContent += `${index + 1}. ${suggestion}\n`
                })
            }

            const blob = new Blob([textContent], { type: 'text/plain' })
            saveAs(blob, `hall-plan-${hallPlan.collegeInfo.name}-${new Date().toISOString().split('T')[0]}.txt`)
        } finally {
            setExportLoading(null)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="relative mb-8">
                        <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg animate-pulse">
                            <Loader2 className="w-12 h-12 text-white animate-spin" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
                    </div>
                    <h2 className="text-3xl font-bold gradient-text mb-4">Generating Hall Plan</h2>
                    <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
                        Our AI is creating your optimal seating arrangement. This may take a few moments...
                    </p>
                    <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                            <Sparkles className="w-4 h-4" />
                            <span>AI Processing</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4" />
                            <span>Optimizing Layout</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-white flex items-center justify-center">
                <div className="text-center max-w-lg mx-auto p-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-orange-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <span className="text-3xl text-white">⚠️</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h2>
                    <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/planner')}
                            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Go Back</span>
                        </button>
                        <button
                            onClick={generateHallPlan}
                            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg"
                        >
                            <RefreshCw className="w-5 h-5" />
                            <span>Try Again</span>
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (!hallPlan) return null

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-white">
            {/* Enhanced Header */}
            <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-yellow-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate('/planner')}
                            className="flex items-center space-x-2 text-gray-600 hover:text-yellow-600 transition-colors duration-200 group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                            <span className="font-medium">Back to Planner</span>
                        </button>
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold gradient-text">
                                Hall Plan Results
                            </h1>
                        </div>
                        <button
                            onClick={generateHallPlan}
                            className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-colors duration-200 group"
                        >
                            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                            <span className="font-medium">Regenerate</span>
                        </button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Success Message */}
                <div className="mb-8">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                                <Award className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-green-800">Hall Plan Generated Successfully!</h3>
                                <p className="text-green-700">Your optimal seating arrangement is ready for review and export.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Summary Cards */}
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                    {[
                        {
                            title: 'Total Students',
                            value: hallPlan.summary.totalStudents,
                            icon: Users,
                            color: 'yellow',
                            trend: '+12%'
                        },
                        {
                            title: 'Total Halls',
                            value: hallPlan.summary.totalHalls,
                            icon: MapPin,
                            color: 'orange',
                            trend: 'Optimal'
                        },
                        {
                            title: 'Total Benches',
                            value: hallPlan.summary.totalBenches,
                            icon: FileSpreadsheet,
                            color: 'yellow',
                            trend: 'Efficient'
                        },
                        {
                            title: 'Avg Occupancy',
                            value: hallPlan.summary.averageOccupancy.toFixed(1),
                            icon: TrendingUp,
                            color: 'orange',
                            trend: '95% Full'
                        }
                    ].map((stat, index) => (
                        <div key={index} className={`bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border ${stat.color === 'yellow' ? 'border-yellow-100' : 'border-orange-100'} hover:shadow-xl transition-all duration-300 group`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color === 'yellow' ? 'from-yellow-400 to-yellow-600' : 'from-orange-400 to-orange-600'} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <span className={`text-xs font-medium px-2 py-1 ${stat.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' : 'bg-orange-100 text-orange-700'} rounded-full`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                                <p className="text-3xl font-bold gradient-text">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Enhanced Export Buttons */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8 border border-white/20">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                        <Download className="w-7 h-7 mr-3 text-yellow-500" />
                        Export Hall Plan
                        <span className="ml-4 text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
                            Multiple Formats Available
                        </span>
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                format: 'CSV',
                                description: 'Comma-separated values for data analysis',
                                icon: FileSpreadsheet,
                                color: 'green',
                                action: exportToCSV,
                                loading: exportLoading === 'csv'
                            },
                            {
                                format: 'Excel',
                                description: 'Complete workbook with summary sheets',
                                icon: FileSpreadsheet,
                                color: 'blue',
                                action: exportToExcel,
                                loading: exportLoading === 'excel'
                            },
                            {
                                format: 'Text',
                                description: 'Plain text format for printing',
                                icon: FileText,
                                color: 'gray',
                                action: exportToText,
                                loading: exportLoading === 'text'
                            }
                        ].map((exportOption, index) => (
                            <button
                                key={index}
                                onClick={exportOption.action}
                                disabled={exportOption.loading}
                                className={`group relative overflow-hidden ${exportOption.color === 'green' ? 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' :
                                        exportOption.color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' :
                                            'bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700'
                                    } text-white p-6 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                <div className="flex items-center justify-center space-x-3 mb-3">
                                    {exportOption.loading ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <exportOption.icon className="w-6 h-6" />
                                    )}
                                    <span className="text-lg">Export as {exportOption.format}</span>
                                </div>
                                <p className="text-sm opacity-90">{exportOption.description}</p>

                                {/* Shimmer effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            </button>
                        ))}
                    </div>
                </div>                {/* Enhanced Hall Details */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 mb-8 border border-white/20">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                        <MapPin className="w-7 h-7 mr-3 text-orange-500" />
                        Detailed Seating Arrangement
                    </h2>

                    {/* Group halls */}
                    {(() => {
                        const hallGroups: { [key: number]: SeatingArrangement[] } = {}
                        hallPlan.halls.forEach(arrangement => {
                            if (!hallGroups[arrangement.hallNumber]) {
                                hallGroups[arrangement.hallNumber] = []
                            }
                            hallGroups[arrangement.hallNumber].push(arrangement)
                        })

                        return Object.keys(hallGroups).sort((a, b) => parseInt(a) - parseInt(b)).map(hallNum => (
                            <div key={hallNum} className="mb-12 animate-slide-up">
                                <div className="sticky top-4 z-10 mb-6">
                                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-4 rounded-2xl shadow-lg">
                                        <h3 className="text-xl font-bold flex items-center">
                                            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                                                <span className="font-bold">{hallNum}</span>
                                            </div>
                                            Hall {hallNum}
                                            <span className="ml-auto text-sm bg-white/20 px-3 py-1 rounded-full">
                                                {hallGroups[parseInt(hallNum)].length} Benches
                                            </span>
                                        </h3>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {hallGroups[parseInt(hallNum)].map((arrangement, index) => (
                                        <div key={index} className="bg-white/60 border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:bg-white/80 transition-all duration-300 group">
                                            <div className="flex justify-between items-center mb-4">
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                                                        <span className="text-white font-bold text-sm">{arrangement.benchNumber}</span>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">Bench {arrangement.benchNumber}</h4>
                                                        <span className="text-xs text-gray-500 font-medium">{arrangement.className}</span>
                                                    </div>
                                                </div>
                                                <div className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full font-medium">
                                                    {arrangement.students.length}/{arrangement.capacity}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                {arrangement.students.map((student, studentIndex) => (
                                                    <div key={studentIndex} className="bg-gradient-to-r from-gray-50 to-yellow-50/30 p-3 rounded-lg border border-gray-100 hover:border-yellow-200 transition-colors duration-200">
                                                        <div className="flex items-center space-x-2 mb-1">
                                                            <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                                                                <span className="text-white text-xs font-bold">{studentIndex + 1}</span>
                                                            </div>
                                                            <div className="font-semibold text-gray-900 text-sm">{student['Name']}</div>
                                                        </div>
                                                        <div className="text-xs text-gray-600 ml-8">
                                                            <div>ID: <span className="font-medium">{student['Student ID']}</span></div>
                                                            <div>Roll: <span className="font-medium">{student['Roll Number']}</span></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    })()}
                </div>

                {/* Enhanced Optimization Suggestions */}
                {optimizationSuggestions.length > 0 && (
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-8 shadow-lg animate-fade-in">
                        <h2 className="text-2xl font-bold text-yellow-900 mb-6 flex items-center">
                            <Sparkles className="w-7 h-7 mr-3 text-orange-600" />
                            AI Optimization Suggestions
                            <span className="ml-4 text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
                                Powered by Gemini AI
                            </span>
                        </h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {optimizationSuggestions.map((suggestion, index) => (
                                <div key={index} className="flex items-start space-x-4 bg-white/60 p-4 rounded-xl border border-yellow-100 hover:border-orange-200 transition-colors duration-200">
                                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-1">
                                        {index + 1}
                                    </div>
                                    <p className="text-yellow-800 leading-relaxed">{suggestion}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ResultsPage