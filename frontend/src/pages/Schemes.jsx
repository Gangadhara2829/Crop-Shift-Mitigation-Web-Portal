import { ShieldCheck, ArrowRight, TreePine, Droplet } from 'lucide-react';

export default function Schemes() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full animate-fade-in">
        <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Government Schemes</h1>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                Discover incentives and programs designed to help you transition to oilseed farming and maximize your yield organically.
            </p>
        </div>

        <div className="glass-card p-8 md:p-12 mb-12 relative overflow-hidden border-nature-200">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-green-100 rounded-full opacity-50"></div>
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-nature-100 text-nature-600 rounded-xl">
                            <ShieldCheck className="h-8 w-8" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">NMEO-OS</h2>
                    </div>
                    <h3 className="text-lg font-medium text-nature-700 mb-6">National Mission on Edible Oils - Oilseeds</h3>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        The NMEO-OS aims to augment the availability of edible oils and reduce the import burden by increasing the area and productivity of oilseeds. The government is heavily incentivizing farmers to shift from water-intensive crops like Paddy to Oilseeds like Groundnut, Mustard, and Sunflower.
                    </p>
                    
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-start">
                             <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                <span className="text-nature-600 text-sm">✓</span>
                             </div>
                             <span className="text-gray-700">Financial assistance for quality seeds and farm implements</span>
                        </li>
                        <li className="flex items-start">
                             <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                <span className="text-nature-600 text-sm">✓</span>
                             </div>
                             <span className="text-gray-700">Subsidies on micro-irrigation systems</span>
                        </li>
                        <li className="flex items-start">
                             <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                <span className="text-nature-600 text-sm">✓</span>
                             </div>
                             <span className="text-gray-700">Assured procurement at Minimum Support Price (MSP)</span>
                        </li>
                    </ul>
                    
                    <button className="btn-primary flex items-center gap-2">
                        Apply for Scheme <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
                
                <div className="w-full md:w-1/3 grid grid-cols-1 gap-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="bg-blue-50 p-3 rounded-full text-blue-500">
                            <Droplet className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Water Saved</p>
                            <p className="text-xl font-bold text-gray-900">Up to 60%</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="bg-yellow-50 p-3 rounded-full text-gold-500">
                            <TreePine className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Soil Health</p>
                            <p className="text-xl font-bold text-gray-900">Improved</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
