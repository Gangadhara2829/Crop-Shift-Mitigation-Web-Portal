import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, Map, Sun, Sprout, Activity, CheckCircle2, CloudRain, ShieldCheck } from 'lucide-react';
import api from '../api';

export default function Dashboard() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  
  const [formData, setFormData] = useState({
    crop: 'Paddy',
    land_size: user.land_size || 1,
    rainfall: 800,
    soil_type: 'Clay'
  });

  const [prediction, setPrediction] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const crops = ['Paddy', 'Groundnut', 'Sunflower'];
  const soils = ['Clay', 'Sandy Loam', 'Loam', 'Sandy'];

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      const res = await api.get('/prices');
      setPrices(res.data);
    } catch (err) {
      console.error("Failed to load prices", err);
    }
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const predRes = await api.post('/predict', {
        ...formData,
        user_id: user.id
      });
      setPrediction(predRes.data);

      const compRes = await api.post('/compare', {
        crops: crops,
        land_size: formData.land_size,
        rainfall: formData.rainfall,
        soil_type: formData.soil_type
      });
      setComparison(compRes.data);

    } catch (err) {
      setError(err.response?.data?.error || 'Failed to predict yield');
    } finally {
      setLoading(false);
    }
  };

  // Prepare radar data if comparison exists
  const getRadarData = () => {
    if (!comparison) return [];
    return comparison.comparison.map(c => ({
      subject: c.crop,
      Profit: c.profit,
      Yield: c.total_yield,
      fullMark: Math.max(...comparison.comparison.map(x => x.profit)) * 1.2
    }));
  };

  return (
    <div className="min-h-screen bg-[#F4F8F6] pb-16">
      <div className="bg-nature-900 py-12 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <p className="text-nature-300 font-medium mb-2 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-gold-400" /> Premium Analytics Interface
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Agricultural Command Center</h1>
              <p className="text-nature-200 mt-3 text-lg max-w-2xl">Leverage real-time market data and local environmental conditions to maximize your crop yields and profitability margins.</p>
            </div>
            <div className="flex flex-wrap gap-4">
               <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20">
                  <p className="text-nature-200 text-sm font-medium uppercase tracking-widest mb-1">Active Model</p>
                  <p className="text-white font-bold text-xl flex items-center gap-2"><Activity className="w-5 h-5 text-green-400" /> RandomForest v2.4</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 animate-fade-in">
        {error && <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-xl shadow-lg flex items-center gap-3"><Activity className="w-5 h-5"/>{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Analysis Form Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl shadow-xl shadow-nature-900/5 border border-nature-100 p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Farm Parameters</h2>
                <div className="p-2 bg-nature-50 rounded-xl"><Sprout className="w-6 h-6 text-nature-600" /></div>
              </div>
              
              <form onSubmit={handlePredict} className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Sprout className="w-4 h-4 text-nature-500" /> Primary Crop Target
                  </label>
                  <select 
                    className="w-full border-gray-200 rounded-xl shadow-sm focus:ring-nature-500 focus:border-nature-500 px-4 py-3 border bg-gray-50/50 hover:bg-white transition-colors cursor-pointer"
                    value={formData.crop}
                    onChange={(e) => setFormData({...formData, crop: e.target.value})}
                  >
                    {crops.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <Map className="w-4 h-4 text-nature-500" /> Usable Land Area
                    </label>
                    <div className="relative">
                      <input 
                        type="number" step="0.1" required
                        className="w-full border-gray-200 rounded-xl shadow-sm focus:ring-nature-500 focus:border-nature-500 pl-4 pr-16 py-3 border bg-gray-50/50 hover:bg-white transition-colors"
                        value={formData.land_size}
                        onChange={(e) => setFormData({...formData, land_size: e.target.value})}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">Acres</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <CloudRain className="w-4 h-4 text-blue-500" /> Expected Rainfall Period
                  </label>
                  <div className="relative">
                    <input 
                      type="number" required
                      className="w-full border-gray-200 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 pl-4 pr-16 py-3 border bg-gray-50/50 hover:bg-white transition-colors"
                      value={formData.rainfall}
                      onChange={(e) => setFormData({...formData, rainfall: e.target.value})}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">mm</span>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Sun className="w-4 h-4 text-orange-500" /> Dominant Soil Profile
                  </label>
                  <select 
                    className="w-full border-gray-200 rounded-xl shadow-sm focus:ring-orange-500 focus:border-orange-500 px-4 py-3 border bg-gray-50/50 hover:bg-white transition-colors cursor-pointer"
                    value={formData.soil_type}
                    onChange={(e) => setFormData({...formData, soil_type: e.target.value})}
                  >
                    {soils.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <button type="submit" disabled={loading} className="w-full relative group overflow-hidden bg-nature-900 text-white font-bold text-lg rounded-xl py-4 shadow-lg shadow-nature-900/30 transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]">
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                  {loading ? 'Initializing Engine...' : 'Run Analysis Engine'}
                </button>
              </form>
            </div>

            {/* Live Market Ticker */}
            <div className="bg-gradient-to-br from-gold-500 to-gold-600 rounded-3xl shadow-xl shadow-gold-500/20 p-8 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-white"/> Current APMC Market Index
              </h3>
              <div className="space-y-4">
                {prices.map(p => (
                  <div key={p.name} className="flex justify-between items-center bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20">
                    <span className="font-semibold text-orange-50">{p.name}</span>
                    <span className="font-bold text-xl tracking-tight">₹{p.market_price}<span className="text-sm font-normal text-gold-200">/kg</span></span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Core Results Dashboard */}
          <div className="lg:col-span-8 space-y-8 animate-slide-up animation-delay-100">
            {prediction ? (
              <div className="space-y-8">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative overflow-hidden bg-white rounded-3xl shadow-xl shadow-nature-900/5 border border-nature-100 p-8">
                    <div className="absolute top-0 right-0 p-4"><div className="w-16 h-16 bg-nature-50 rounded-full flex items-center justify-center"><Sprout className="w-8 h-8 text-nature-600"/></div></div>
                    <p className="text-nature-500 font-semibold uppercase tracking-wider text-sm mb-4">Total Predicted Yield</p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-5xl font-extrabold text-gray-900 tracking-tighter">{prediction.total_yield.toLocaleString()}</h3>
                      <span className="text-xl font-bold text-gray-400">kg</span>
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-sm text-nature-700 bg-nature-50 px-4 py-2 rounded-lg font-medium w-max border border-nature-100/50">
                      <Activity className="w-4 h-4"/> {prediction.yield_per_acre.toLocaleString()} kg/acre efficiency
                    </div>
                  </div>
                  
                  <div className="relative overflow-hidden bg-gradient-to-br from-nature-800 to-nature-950 rounded-3xl shadow-xl shadow-nature-900/20 p-8 text-white">
                     <div className="absolute top-0 right-0 p-4"><div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md"><TrendingUp className="w-8 h-8 text-gold-400"/></div></div>
                    <p className="text-nature-300 font-semibold uppercase tracking-wider text-sm mb-4">Estimated Net Profit</p>
                    <div className="flex items-baseline gap-2">
                       <h3 className="text-5xl font-extrabold tracking-tighter text-white border-b-2 border-gold-400/30 pb-1">₹{prediction.profit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-sm text-nature-100 bg-white/10 px-4 py-2 rounded-lg font-medium border border-white/10 w-max">
                      Cost basis: ₹{prediction.estimated_cost.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Advanced Comparison Area */}
                {comparison && (
                  <div className="bg-white rounded-3xl shadow-xl shadow-nature-900/5 border border-nature-100 overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">Crop Viability Matrix</h3>
                        <p className="text-gray-500 text-sm mt-1">Cross-analyzing multiple variants for given soil and geometry</p>
                      </div>
                      {comparison.best_recommendation && (
                        <div className="bg-green-100 text-green-800 px-5 py-2.5 rounded-xl text-sm font-bold border border-green-200 shadow-sm flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5"/> AI Pick: {comparison.best_recommendation.crop}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-8 grid grid-cols-1 xl:grid-cols-3 gap-8">
                       <div className="xl:col-span-2 h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={comparison.comparison} margin={{ top: 20, right: 0, left: -10, bottom: 0 }} barGap={12}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="crop" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontWeight: 600, fontSize: 13}} dy={15} />
                            <YAxis yAxisId="left" orientation="left" stroke="#64af8b" axisLine={false} tickLine={false} tickFormatter={(val) => `${val/1000}k`} tick={{fontSize: 12}} />
                            <YAxis yAxisId="right" orientation="right" stroke="#eab308" axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} tick={{fontSize: 12}} />
                            <Tooltip 
                              cursor={{fill: '#f8fafc'}}
                              contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px', fontWeight: '500' }}
                            />
                            <Legend wrapperStyle={{paddingTop: '20px'}} />
                            <Bar yAxisId="left" dataKey="total_yield" name="Yield (kg)" fill="#40926c" radius={[8, 8, 8, 8]} barSize={25} />
                            <Bar yAxisId="right" dataKey="profit" name="Est. Profit (₹)" fill="#eab308" radius={[8, 8, 8, 8]} barSize={25} />
                          </BarChart>
                        </ResponsiveContainer>
                       </div>
                       
                       <div className="xl:col-span-1 border-t xl:border-t-0 xl:border-l border-gray-100 pt-8 xl:pt-0 xl:pl-8 flex flex-col justify-center">
                          <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2 text-center">Performance Radar</h4>
                          <div className="h-[250px] w-full">
                             <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="65%" data={getRadarData()}>
                                  <PolarGrid stroke="#e5e7eb" />
                                  <PolarAngleAxis dataKey="subject" tick={{fill: '#1f2937', fontSize: 13, fontWeight: 700}} />
                                  <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={false} axisLine={false} />
                                  <Radar name="Profitability Score" dataKey="Profit" stroke="#ca8a04" fill="#facc15" fillOpacity={0.4} />
                                </RadarChart>
                             </ResponsiveContainer>
                          </div>
                          
                          <div className="mt-4 grid gap-3">
                             {comparison.comparison.map(c => (
                                <div key={c.crop} className="flex justify-between items-center text-sm">
                                   <span className="font-semibold text-gray-700">{c.crop}</span>
                                   <span className="text-nature-700 font-bold bg-nature-50 px-2 py-1 rounded">₹{(c.profit/1000).toFixed(1)}k</span>
                                </div>
                             ))}
                          </div>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full min-h-[600px] flex items-center justify-center rounded-3xl bg-white border border-gray-100 shadow-xl shadow-nature-900/5 relative overflow-hidden group">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#40926c 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
                
                <div className="text-center p-10 max-w-md relative z-10">
                  <div className="w-24 h-24 bg-nature-50 rounded-3xl mx-auto flex items-center justify-center rotate-3 transform transition-transform group-hover:rotate-6 mb-8 border border-nature-100 shadow-sm relative">
                    <div className="absolute inset-0 bg-nature-400 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <Activity className="w-12 h-12 text-nature-600 relative z-10" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">System Ready</h3>
                  <p className="text-gray-500 text-lg leading-relaxed">Enter your precise farm conditions in the parameters panel and deploy the analysis engine to unlock deep actionable insights.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
