import { GoogleGenerativeAI } from '@google/generative-ai'

// Gemini AI configuration
const API_KEY = 'AIzaSyBOMRPeR6y0M_QA0JY4-4E-q6Tejn_1vio'
const genAI = new GoogleGenerativeAI(API_KEY)

interface StudentData {
    'Student ID': string
    'Name': string
    'Class': string
    'Roll Number': string
    'Subject': string
}

interface HallConfig {
    classCount: number
    benchesPerClass: number
    studentsPerBench: number
    extraAllocation: boolean
}

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

interface SeatingArrangement {
    hallNumber: number
    className: string
    benchNumber: number
    students: StudentData[]
    capacity: number
}

interface HallPlan {
    collegeInfo: CollegeInfo
    examDetails: {
        subject: string
        date: string
        type: string
    }
    halls: SeatingArrangement[]
    summary: {
        totalStudents: number
        totalHalls: number
        totalBenches: number
        averageOccupancy: number
    }
}

class GeminiHallPlanner {
    private model: any

    constructor() {
        this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    }

    async generateHallPlan(
        collegeInfo: CollegeInfo,
        hallConfig: HallConfig,
        classes: ClassInfo[],
        students: StudentData[]
    ): Promise<HallPlan> {
        try {
            // Prepare the prompt for Gemini AI
            const prompt = this.createPrompt(collegeInfo, hallConfig, classes, students)

            // Get AI response
            const result = await this.model.generateContent(prompt)
            const response = await result.response
            const aiSuggestion = response.text()

            // Parse AI response and generate hall plan
            const hallPlan = this.parseAIResponse(aiSuggestion, collegeInfo, hallConfig, classes, students)

            return hallPlan
        } catch (error) {
            console.error('Error generating hall plan with AI:', error)
            // Fallback to manual generation if AI fails
            return this.generateFallbackPlan(collegeInfo, hallConfig, classes, students)
        }
    }

    private createPrompt(
        collegeInfo: CollegeInfo,
        hallConfig: HallConfig,
        classes: ClassInfo[],
        students: StudentData[]
    ): string {
        return `
You are a smart hall planner for academic examinations. Please help create an optimal seating arrangement based on the following information:

COLLEGE INFORMATION:
- College: ${collegeInfo.name}
- Exam Type: ${collegeInfo.examType}
- Subject: ${collegeInfo.subject}
- Date: ${collegeInfo.examDate}

HALL CONFIGURATION:
- Number of Classes/Halls: ${hallConfig.classCount}
- Benches per Class: ${hallConfig.benchesPerClass}
- Students per Bench: ${hallConfig.studentsPerBench}
- Extra Allocation Allowed: ${hallConfig.extraAllocation ? 'Yes' : 'No'}

CLASSES:
${classes.map(c => `- ${c.name} (ID: ${c.id}) - Expected: ${c.studentCount} students`).join('\n')}

STUDENT DATA:
Total Students: ${students.length}
Students by Class: ${this.getStudentsByClass(students)}

REQUIREMENTS:
1. Distribute students optimally across available halls
2. Maintain proper spacing and avoid overcrowding
3. Group students by class when possible but ensure fair distribution
4. Consider exam security and prevent cheating opportunities
5. Optimize for supervision and accessibility

Please suggest:
1. How to distribute students across ${hallConfig.classCount} halls
2. Which students should sit together (if any)
3. Any special arrangements needed
4. Hall capacity utilization recommendations

Provide practical suggestions for creating the optimal seating arrangement.
    `
    }

    private getStudentsByClass(students: StudentData[]): string {
        const classCounts: { [key: string]: number } = {}
        students.forEach(student => {
            classCounts[student.Class] = (classCounts[student.Class] || 0) + 1
        })

        return Object.entries(classCounts)
            .map(([className, count]) => `${className}: ${count}`)
            .join(', ')
    }

    private parseAIResponse(
        aiResponse: string,
        collegeInfo: CollegeInfo,
        hallConfig: HallConfig,
        classes: ClassInfo[],
        students: StudentData[]
    ): HallPlan {
        // Since AI response is text-based, we'll use it as guidance
        // but generate the actual seating arrangement programmatically
        console.log('AI Suggestion:', aiResponse)

        return this.generateOptimalPlan(collegeInfo, hallConfig, classes, students, aiResponse)
    }

    private generateOptimalPlan(
        collegeInfo: CollegeInfo,
        hallConfig: HallConfig,
        classes: ClassInfo[],
        students: StudentData[],
        _aiGuidance?: string
    ): HallPlan {
        const halls: SeatingArrangement[] = []
        const totalCapacityPerHall = hallConfig.benchesPerClass * hallConfig.studentsPerBench
        const extraCapacityPerHall = hallConfig.extraAllocation ? hallConfig.benchesPerClass : 0
        const maxCapacityPerHall = totalCapacityPerHall + extraCapacityPerHall

        // Group students by class
        const studentsByClass: { [key: string]: StudentData[] } = {}
        students.forEach(student => {
            if (!studentsByClass[student.Class]) {
                studentsByClass[student.Class] = []
            }
            studentsByClass[student.Class].push(student)
        })

        // Distribute students across halls
        let currentHall = 1
        let currentHallStudents: StudentData[] = []

        // Sort classes by student count for better distribution
        const sortedClasses = Object.keys(studentsByClass).sort((a, b) =>
            studentsByClass[b].length - studentsByClass[a].length
        )

        for (const className of sortedClasses) {
            const classStudents = studentsByClass[className]

            for (const student of classStudents) {
                // Check if current hall has space
                if (currentHallStudents.length >= maxCapacityPerHall) {
                    // Create hall arrangement for current hall
                    this.createHallArrangement(
                        halls,
                        currentHall,
                        currentHallStudents,
                        hallConfig,
                        classes
                    )

                    // Move to next hall
                    currentHall++
                    currentHallStudents = []
                }

                currentHallStudents.push(student)
            }
        }

        // Create arrangement for the last hall if it has students
        if (currentHallStudents.length > 0) {
            this.createHallArrangement(
                halls,
                currentHall,
                currentHallStudents,
                hallConfig,
                classes
            )
        }

        // Calculate summary
        const summary = {
            totalStudents: students.length,
            totalHalls: halls.length,
            totalBenches: halls.reduce((sum, hall) => sum + Math.ceil(hall.students.length / hallConfig.studentsPerBench), 0),
            averageOccupancy: halls.length > 0 ? (students.length / halls.length) : 0
        }

        return {
            collegeInfo,
            examDetails: {
                subject: collegeInfo.subject,
                date: collegeInfo.examDate,
                type: collegeInfo.examType
            },
            halls,
            summary
        }
    }

    private createHallArrangement(
        halls: SeatingArrangement[],
        hallNumber: number,
        hallStudents: StudentData[],
        hallConfig: HallConfig,
        _classes: ClassInfo[]
    ): void {
        // Group students by class within this hall
        const studentsByClass: { [key: string]: StudentData[] } = {}
        hallStudents.forEach(student => {
            if (!studentsByClass[student.Class]) {
                studentsByClass[student.Class] = []
            }
            studentsByClass[student.Class].push(student)
        })

        // Create bench arrangements
        let benchNumber = 1
        const studentsPerBench = hallConfig.studentsPerBench
        const maxStudentsPerBench = hallConfig.extraAllocation ? studentsPerBench + 1 : studentsPerBench

        for (const className of Object.keys(studentsByClass)) {
            const classStudents = studentsByClass[className]

            // Distribute class students across benches
            for (let i = 0; i < classStudents.length; i += maxStudentsPerBench) {
                const benchStudents = classStudents.slice(i, i + maxStudentsPerBench)

                halls.push({
                    hallNumber,
                    className,
                    benchNumber,
                    students: benchStudents,
                    capacity: maxStudentsPerBench
                })

                benchNumber++
            }
        }
    }

    private generateFallbackPlan(
        collegeInfo: CollegeInfo,
        hallConfig: HallConfig,
        classes: ClassInfo[],
        students: StudentData[]
    ): HallPlan {
        console.log('Using fallback plan generation...')
        return this.generateOptimalPlan(collegeInfo, hallConfig, classes, students)
    }

    // Method to get optimization suggestions
    async getOptimizationSuggestions(hallPlan: HallPlan): Promise<string[]> {
        try {
            const prompt = `
Based on this hall plan summary:
- Total Students: ${hallPlan.summary.totalStudents}
- Total Halls: ${hallPlan.summary.totalHalls}
- Average Occupancy: ${hallPlan.summary.averageOccupancy.toFixed(1)} students per hall

Please provide 3-5 optimization suggestions for improving the seating arrangement, focusing on:
1. Security and anti-cheating measures
2. Supervision efficiency
3. Student comfort and accessibility
4. Emergency evacuation considerations

Provide concise, actionable suggestions.
      `

            const result = await this.model.generateContent(prompt)
            const response = await result.response
            const suggestions = response.text()

            // Parse suggestions into array
            return suggestions.split('\n').filter((line: string) => line.trim().length > 0)
        } catch (error) {
            console.error('Error getting optimization suggestions:', error)
            return [
                'Ensure proper spacing between students',
                'Place supervisors strategically for maximum coverage',
                'Consider special seating for students with accessibility needs',
                'Plan clear pathways for emergency evacuation',
                'Group students to minimize movement during exam'
            ]
        }
    }
}

export default GeminiHallPlanner
export type { HallPlan, SeatingArrangement, StudentData, HallConfig, ClassInfo, CollegeInfo }