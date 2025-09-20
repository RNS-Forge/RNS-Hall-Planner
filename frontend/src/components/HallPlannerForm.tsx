import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, FileSpreadsheet, Settings, ArrowLeft, ArrowRight, CheckCircle, Download, Users, Building, FileText } from 'lucide-react'
import Papa from 'papaparse'

interface ClassInfo {
    id: string
    name: string
    studentCount: number
}

interface CollegeInfo {
    name: string
    address: string
    examType: string
    examDate: string
    subject: string
}

interface HallConfig {
    classCount: number
    benchesPerClass: number
    studentsPerBench: number
    extraAllocation: boolean
}

const HallPlannerForm = () => {
    const navigate = useNavigate()
    const [step, setStep] = useState(1)

    // Form data states
    const [collegeInfo, setCollegeInfo] = useState<CollegeInfo>({
        name: '',
        address: '',
        examType: '',
        examDate: '',
        subject: ''
    })

    const [hallConfig, setHallConfig] = useState<HallConfig>({
        classCount: 1,
        benchesPerClass: 10,
        studentsPerBench: 2,
        extraAllocation: false
    })

    const [classes, setClasses] = useState<ClassInfo[]>([
        { id: '1', name: 'Class 1', studentCount: 0 }
    ])

    const [csvData, setCsvData] = useState<any[]>([])
    const [csvFile, setCsvFile] = useState<File | null>(null)
    const [uploadProgress, setUploadProgress] = useState(0)

    // Update classes when classCount changes
    const handleClassCountChange = (count: number) => {
        setHallConfig(prev => ({ ...prev, classCount: count }))

        const newClasses: ClassInfo[] = []
        for (let i = 1; i <= count; i++) {
            const existingClass = classes.find(c => c.id === i.toString())
            newClasses.push(existingClass || { id: i.toString(), name: `Class ${i}`, studentCount: 0 })
        }
        setClasses(newClasses)
    }

    // Handle CSV file upload with progress simulation
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setCsvFile(file)
            setUploadProgress(0)

            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(progressInterval)
                        return 100
                    }
                    return prev + 10
                })
            }, 100)

            Papa.parse(file, {
                complete: (results: any) => {
                    setCsvData(results.data)
                    console.log('CSV Data:', results.data)
                    setUploadProgress(100)
                },
                header: true,
                skipEmptyLines: true
            })
        }
    }

    // Download sample CSV
    const downloadSampleCSV = () => {
        const sampleData = [
            { 'Student ID': 'STU001', 'Name': 'John Doe', 'Class': 'Class 1', 'Roll Number': '1', 'Subject': 'Mathematics' },
            { 'Student ID': 'STU002', 'Name': 'Jane Smith', 'Class': 'Class 1', 'Roll Number': '2', 'Subject': 'Mathematics' },
            { 'Student ID': 'STU003', 'Name': 'Mike Johnson', 'Class': 'Class 2', 'Roll Number': '1', 'Subject': 'Physics' },
            { 'Student ID': 'STU004', 'Name': 'Sarah Wilson', 'Class': 'Class 2', 'Roll Number': '2', 'Subject': 'Physics' }
        ]

        const csv = Papa.unparse(sampleData)
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'sample_students.csv'
        a.click()
        window.URL.revokeObjectURL(url)
    }

    const handleSubmit = () => {
        // Store data in localStorage for the next page
        localStorage.setItem('collegeInfo', JSON.stringify(collegeInfo))
        localStorage.setItem('hallConfig', JSON.stringify(hallConfig))
        localStorage.setItem('classes', JSON.stringify(classes))
        localStorage.setItem('csvData', JSON.stringify(csvData))

        navigate('/results')
    }

    const nextStep = () => setStep(prev => prev + 1)
    const prevStep = () => setStep(prev => prev - 1)

    const stepTitles = [
        { title: 'College Information', icon: Building },
        { title: 'Hall Configuration', icon: Settings },
        { title: 'Class Details', icon: Users },
        { title: 'Student Data Upload', icon: FileSpreadsheet }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-white">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-yellow-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center space-x-2 text-gray-600 hover:text-yellow-600 transition-colors duration-200 group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                            <span className="font-medium">Back to Home</span>
                        </button>
                        <h1 className="text-2xl font-bold gradient-text">
                            Hall Planner Configuration
                        </h1>
                        <div className="flex items-center space-x-2 text-gray-600">
                            <span className="text-sm font-medium">Step {step} of 4</span>
                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-300"
                                    style={{ width: `${(step / 4) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Progress Stepper */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-8">
                        {stepTitles.map((stepItem, index) => (
                            <div key={index} className="flex flex-col items-center group">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 ${step > index + 1
                                        ? 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg'
                                        : step === index + 1
                                            ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg scale-110'
                                            : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                                    }`}>
                                    {step > index + 1 ? (
                                        <CheckCircle className="w-8 h-8" />
                                    ) : (
                                        <stepItem.icon className="w-8 h-8" />
                                    )}
                                </div>
                                <div className="text-center">
                                    <h3 className={`text-sm font-semibold transition-colors duration-300 ${step >= index + 1 ? 'text-gray-900' : 'text-gray-500'
                                        }`}>
                                        {stepItem.title}
                                    </h3>
                                    <div className={`text-xs mt-1 ${step > index + 1
                                            ? 'text-green-600 font-medium'
                                            : step === index + 1
                                                ? 'text-yellow-600 font-medium'
                                                : 'text-gray-400'
                                        }`}>
                                        {step > index + 1 ? 'Completed' : step === index + 1 ? 'In Progress' : 'Pending'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step Content */}
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 p-8">
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">College Information</h2>
                                <p className="text-gray-600">Please provide your institution details</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        College Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={collegeInfo.name}
                                        onChange={(e) => setCollegeInfo(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                        placeholder="Enter college name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Address *
                                    </label>
                                    <input
                                        type="text"
                                        value={collegeInfo.address}
                                        onChange={(e) => setCollegeInfo(prev => ({ ...prev, address: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                        placeholder="Enter college address"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Exam Type *
                                    </label>
                                    <select
                                        value={collegeInfo.examType}
                                        onChange={(e) => setCollegeInfo(prev => ({ ...prev, examType: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                    >
                                        <option value="">Select exam type</option>
                                        <option value="Mid Term">Mid Term</option>
                                        <option value="Final Exam">Final Exam</option>
                                        <option value="Unit Test">Unit Test</option>
                                        <option value="Practical Exam">Practical Exam</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Exam Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={collegeInfo.examDate}
                                        onChange={(e) => setCollegeInfo(prev => ({ ...prev, examDate: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        value={collegeInfo.subject}
                                        onChange={(e) => setCollegeInfo(prev => ({ ...prev, subject: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                        placeholder="Enter subject name"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Hall Configuration</h2>
                                <p className="text-gray-600">Configure your examination hall settings</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Number of Classes *
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={hallConfig.classCount}
                                        onChange={(e) => handleClassCountChange(parseInt(e.target.value) || 1)}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Benches per Class *
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="50"
                                        value={hallConfig.benchesPerClass}
                                        onChange={(e) => setHallConfig(prev => ({ ...prev, benchesPerClass: parseInt(e.target.value) || 10 }))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Students per Bench *
                                    </label>
                                    <select
                                        value={hallConfig.studentsPerBench}
                                        onChange={(e) => setHallConfig(prev => ({ ...prev, studentsPerBench: parseInt(e.target.value) }))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 bg-white/80 backdrop-blur-sm"
                                    >
                                        <option value={1}>1 Student</option>
                                        <option value={2}>2 Students</option>
                                        <option value={3}>3 Students</option>
                                    </select>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="extraAllocation"
                                        checked={hallConfig.extraAllocation}
                                        onChange={(e) => setHallConfig(prev => ({ ...prev, extraAllocation: e.target.checked }))}
                                        className="w-5 h-5 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500 focus:ring-2"
                                    />
                                    <label htmlFor="extraAllocation" className="ml-3 text-sm font-semibold text-gray-700">
                                        Enable Extra Allocation (10% buffer)
                                    </label>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6 mt-6">
                                <h3 className="text-lg font-bold text-yellow-800 mb-3">Configuration Summary</h3>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    <div className="text-yellow-700">
                                        <span className="font-medium">Total Classes:</span> {hallConfig.classCount}
                                    </div>
                                    <div className="text-yellow-700">
                                        <span className="font-medium">Benches per Class:</span> {hallConfig.benchesPerClass}
                                    </div>
                                    <div className="text-yellow-700">
                                        <span className="font-medium">Students per Bench:</span> {hallConfig.studentsPerBench}
                                    </div>
                                    <div className="text-yellow-700">
                                        <span className="font-medium">Total Capacity:</span> {hallConfig.classCount * hallConfig.benchesPerClass * hallConfig.studentsPerBench}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Class Details</h2>
                                <p className="text-gray-600">Configure individual class information</p>
                            </div>

                            <div className="space-y-4">
                                {classes.map((classItem, index) => (
                                    <div key={classItem.id} className="bg-gradient-to-r from-gray-50 to-yellow-50 border border-gray-200 rounded-xl p-6">
                                        <div className="grid md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Class Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={classItem.name}
                                                    onChange={(e) => {
                                                        const newClasses = [...classes]
                                                        newClasses[index].name = e.target.value
                                                        setClasses(newClasses)
                                                    }}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 bg-white/80"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Expected Students
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={classItem.studentCount}
                                                    onChange={(e) => {
                                                        const newClasses = [...classes]
                                                        newClasses[index].studentCount = parseInt(e.target.value) || 0
                                                        setClasses(newClasses)
                                                    }}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 bg-white/80"
                                                />
                                            </div>

                                            <div className="flex items-end">
                                                <div className="text-sm text-gray-600">
                                                    <div className="font-medium">Benches Required:</div>
                                                    <div className="text-lg font-bold text-yellow-600">
                                                        {Math.ceil(classItem.studentCount / hallConfig.studentsPerBench)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Student Data Upload</h2>
                                <p className="text-gray-600">Upload your student list in CSV format</p>
                            </div>

                            {/* Sample CSV Download */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
                                    <FileText className="w-5 h-5 mr-2" />
                                    Download Sample CSV Template
                                </h3>
                                <p className="text-blue-700 mb-4">
                                    Download our sample CSV file to see the required format for student data upload.
                                </p>
                                <button
                                    onClick={downloadSampleCSV}
                                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                                >
                                    <Download className="w-5 h-5 mr-2 group-hover:translate-y-1 transition-transform duration-300" />
                                    Download Sample CSV
                                </button>
                            </div>

                            {/* File Upload */}
                            <div className="border-2 border-dashed border-yellow-300 rounded-2xl p-8 text-center bg-gradient-to-br from-yellow-50 to-orange-50 hover:border-yellow-400 transition-colors duration-300">
                                <Upload className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Student CSV File</h3>
                                <p className="text-gray-600 mb-6">
                                    Choose a CSV file with student information (Student ID, Name, Class, Roll Number, Subject)
                                </p>
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="csvUpload"
                                />
                                <label
                                    htmlFor="csvUpload"
                                    className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl cursor-pointer transition-all duration-300 group"
                                >
                                    <Upload className="w-5 h-5 mr-2 group-hover:-translate-y-1 transition-transform duration-300" />
                                    Choose CSV File
                                </label>
                            </div>

                            {/* Upload Progress */}
                            {csvFile && (
                                <div className="bg-white border border-gray-200 rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <FileSpreadsheet className="w-6 h-6 text-green-500" />
                                            <div>
                                                <p className="font-semibold text-gray-900">{csvFile.name}</p>
                                                <p className="text-sm text-gray-500">{(csvFile.size / 1024).toFixed(2)} KB</p>
                                            </div>
                                        </div>
                                        <div className="text-sm font-medium text-green-600">
                                            {uploadProgress}% Complete
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            {/* CSV Data Preview */}
                            {csvData.length > 0 && (
                                <div className="bg-white border border-gray-200 rounded-xl p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                        CSV Data Preview ({csvData.length} records)
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    {csvData[0] && Object.keys(csvData[0]).map((header) => (
                                                        <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            {header}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {csvData.slice(0, 5).map((row, index) => (
                                                    <tr key={index}>
                                                        {Object.values(row).map((value: any, cellIndex) => (
                                                            <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {value}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {csvData.length > 5 && (
                                            <p className="text-sm text-gray-500 mt-2 text-center">
                                                Showing first 5 records of {csvData.length} total records
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-8 border-t border-gray-200">
                        <button
                            onClick={prevStep}
                            disabled={step === 1}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${step === 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700 hover:shadow-md'
                                }`}
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Previous</span>
                        </button>

                        {step < 4 ? (
                            <button
                                onClick={nextStep}
                                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                            >
                                <span>Next Step</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={csvData.length === 0}
                                className={`flex items-center space-x-2 px-8 py-3 font-semibold rounded-xl transition-all duration-300 ${csvData.length === 0
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl'
                                    }`}
                            >
                                <span>Generate Hall Plan</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HallPlannerForm