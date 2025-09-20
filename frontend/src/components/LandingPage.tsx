import { useNavigate } from 'react-router-dom'
import { ArrowRight, Users, FileSpreadsheet, Settings, Download, Shield, Clock, Upload, CheckCircle, TrendingUp, Award, Calendar, MapPin, Brain, Eye } from 'lucide-react'

const LandingPage = () => {
    const navigate = useNavigate()

    const handleGetStarted = () => {
        navigate('/planner')
    }

    return (
        <div className="min-h-screen bg-white relative">
            {/* Subtle geometric background pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-50 to-transparent rounded-full opacity-40"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-orange-50 to-transparent rounded-full opacity-30"></div>
                
                {/* Subtle grid pattern */}
                <div className="absolute inset-0 opacity-5" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ea580c' fill-opacity='0.3'%3E%3Ccircle cx='60' cy='60' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
            </div>

            {/* Professional Header */}
            <header className="relative bg-white border-b border-orange-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Users className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">RNS Hall Planner</h1>
                                    <p className="text-sm text-orange-600 font-medium">Professional Hall Management</p>
                                </div>
                            </div>
                        </div>
                        
                        <nav className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Features</a>
                            <a href="#how-it-works" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">How it Works</a>
                            <a href="#pricing" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Pricing</a>
                            <a href="#contact" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">Contact</a>
                        </nav>

                        <div className="flex items-center space-x-4">
                            
                            <button 
                                onClick={handleGetStarted}
                                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-md"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="relative max-w-7xl mx-auto px-6 py-16">
                <div className="text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center px-6 py-2 mb-8 bg-orange-50 rounded-full border border-orange-200">
                        <Award className="w-5 h-5 text-orange-600 mr-2" />
                        <span className="text-orange-700 font-semibold text-sm">Trusted by 500+ Educational Institutions</span>
                    </div>

                    {/* Main Headline */}
                    <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                        Smart Hall Planning for
                        <span className="block text-orange-600 mt-2">
                            Academic Excellence
                        </span>
                    </h2>

                    {/* Subtitle */}
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
                        Transform your examination logistics with AI-powered seating arrangements. 
                        Upload student data, configure hall capacity, and generate optimal layouts in seconds.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                        <button
                            onClick={handleGetStarted}
                            className="group bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
                        >
                            Get Started Free
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                        </button>

                        <button className="bg-white hover:bg-gray-50 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg border border-gray-200 hover:border-orange-300 transition-all duration-300 flex items-center">
                            <Eye className="w-5 h-5 mr-2" />
                            Watch Demo
                        </button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>No signup required</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Free forever</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Instant results</span>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mt-24" id="features">
                    <div className="text-center mb-16">
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">
                            Powerful Features for Modern Education
                        </h3>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Everything you need to manage examination seating arrangements efficiently
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: Upload,
                                title: 'Smart CSV Upload',
                                description: 'Upload student data with automatic validation and error detection',
                                color: 'orange'
                            },
                            {
                                icon: Settings,
                                title: 'Dynamic Configuration',
                                description: 'Flexible hall setup with real-time capacity optimization',
                                color: 'orange'
                            },
                            {
                                icon: Brain,
                                title: 'AI Generation',
                                description: 'Advanced algorithms create optimal seating with conflict resolution',
                                color: 'orange'
                            },
                            {
                                icon: Download,
                                title: 'Multi-Format Export',
                                description: 'Export to CSV, Excel, PDF with custom templates',
                                color: 'orange'
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300"
                            >
                                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                                    <feature.icon className="w-7 h-7 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* How It Works Section */}
                <div className="mt-24" id="how-it-works">
                    <div className="text-center mb-16">
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">
                            Simple 3-Step Process
                        </h3>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            From student data to optimized hall arrangement in under 2 minutes
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                step: '01',
                                title: 'Upload & Validate',
                                description: 'Upload your student CSV file with automatic validation and smart error correction',
                                icon: FileSpreadsheet,
                                features: ['Auto-validation', 'Error detection', 'Format correction']
                            },
                            {
                                step: '02',
                                title: 'Configure & Optimize',
                                description: 'Set up hall parameters with intelligent suggestions and capacity optimization',
                                icon: Settings,
                                features: ['Smart suggestions', 'Capacity optimization', 'Constraint handling']
                            },
                            {
                                step: '03',
                                title: 'Generate & Export',
                                description: 'AI creates optimal layout with multiple export options and sharing capabilities',
                                icon: Download,
                                features: ['AI optimization', 'Multiple formats', 'Cloud sharing']
                            }
                        ].map((step, index) => (
                            <div key={index} className="text-center">
                                <div className="relative mb-8">
                                    <div className="w-24 h-24 bg-orange-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                                        <step.icon className="w-12 h-12 text-white" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-orange-200">
                                        <span className="text-sm font-bold text-orange-600">{step.step}</span>
                                    </div>
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h4>
                                <p className="text-gray-600 leading-relaxed mb-6">{step.description}</p>
                                
                                <div className="space-y-2">
                                    {step.features.map((feature, featureIndex) => (
                                        <div key={featureIndex} className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stats Section */}
                <div className="mt-24">
                    <div className="bg-orange-50 rounded-3xl p-12 border border-orange-100">
                        <div className="text-center mb-12">
                            <h3 className="text-3xl font-bold text-gray-900 mb-4">
                                Trusted by Institutions Worldwide
                            </h3>
                            <p className="text-lg text-gray-700">Real metrics from real users</p>
                        </div>
                        
                        <div className="grid md:grid-cols-4 gap-8 text-center">
                            {[
                                { number: '1,500+', label: 'Halls Planned', icon: MapPin },
                                { number: '50K+', label: 'Students Organized', icon: Users },
                                { number: '99.9%', label: 'Accuracy Rate', icon: Award },
                                { number: '< 90s', label: 'Average Processing', icon: Clock }
                            ].map((stat, index) => (
                                <div key={index} className="group">
                                    <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <stat.icon className="w-7 h-7 text-orange-600" />
                                    </div>
                                    <div className="text-3xl font-bold text-gray-900 mb-2">
                                        {stat.number}
                                    </div>
                                    <div className="text-gray-700 font-medium">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Trust Section */}
                <div className="mt-24 text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8">Why Choose RNS Hall Planner?</h3>
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { icon: Shield, text: 'Enterprise Security', description: 'Bank-level security for your data' },
                            { icon: Clock, text: 'Real-time Processing', description: 'Instant results and updates' },
                            { icon: Brain, text: 'AI-Powered Intelligence', description: 'Smart optimization algorithms' },
                            { icon: TrendingUp, text: 'Continuous Optimization', description: 'Always improving performance' }
                        ].map((feature, index) => (
                            <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <feature.icon className="w-6 h-6 text-orange-600" />
                                </div>
                                <h4 className="font-bold text-gray-900 mb-2">{feature.text}</h4>
                                <p className="text-gray-600 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Final CTA */}
                <div className="mt-24 text-center">
                    <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100">
                        <h3 className="text-4xl font-bold text-gray-900 mb-6">
                            Ready to revolutionize your hall planning?
                        </h3>
                        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Join thousands of educational institutions using AI-powered hall planning 
                            for efficient, accurate, and stress-free examination management.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={handleGetStarted}
                                className="bg-orange-600 hover:bg-orange-700 text-white px-12 py-4 rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
                            >
                                Start Planning Now
                                <ArrowRight className="ml-3 w-6 h-6" />
                            </button>
                            
                            <div className="text-sm text-gray-500 flex items-center space-x-2">
                                <Calendar className="w-4 h-4" />
                                <span>Free trial • No credit card required • Start in 30 seconds</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-50 border-t border-gray-200 mt-24">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="col-span-2">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900">RNS Hall Planner</h4>
                            </div>
                            <p className="text-gray-600 mb-4 max-w-md">
                                Professional hall management solution trusted by educational institutions worldwide.
                            </p>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2 text-gray-500">
                                    <Shield className="w-4 h-4" />
                                    <span className="text-sm">Secure</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-500">
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="text-sm">Reliable</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-500">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-sm">Fast</span>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <h5 className="font-bold text-gray-900 mb-4">Product</h5>
                            <ul className="space-y-2 text-gray-600">
                                <li><a href="#" className="hover:text-orange-600 transition-colors">Features</a></li>
                                <li><a href="#" className="hover:text-orange-600 transition-colors">Pricing</a></li>
                                <li><a href="#" className="hover:text-orange-600 transition-colors">API</a></li>
                                <li><a href="#" className="hover:text-orange-600 transition-colors">Documentation</a></li>
                            </ul>
                        </div>
                        
                        <div>
                            <h5 className="font-bold text-gray-900 mb-4">Support</h5>
                            <ul className="space-y-2 text-gray-600">
                                <li><a href="#" className="hover:text-orange-600 transition-colors">Help Center</a></li>
                                <li><a href="#" className="hover:text-orange-600 transition-colors">Contact</a></li>
                                <li><a href="#" className="hover:text-orange-600 transition-colors">Status</a></li>
                                <li><a href="#" className="hover:text-orange-600 transition-colors">Community</a></li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-8 mt-8 flex items-center justify-between">
                        <p className="text-gray-500 text-sm">
                            © 2025 RNS Hall Planner. All rights reserved.
                        </p>
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <a href="#" className="hover:text-orange-600 transition-colors">Privacy</a>
                            <a href="#" className="hover:text-orange-600 transition-colors">Terms</a>
                            <a href="#" className="hover:text-orange-600 transition-colors">Cookies</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default LandingPage