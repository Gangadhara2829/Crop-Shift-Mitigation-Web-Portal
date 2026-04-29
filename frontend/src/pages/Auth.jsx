import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, User, MapPin, Ruler, Mail, Lock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import api from '../api';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', location: '', land_size: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin ? { email: formData.email, password: formData.password } : formData;
      const res = await api.post(endpoint, payload);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      let errorMsg = 'Authentication failed';
      if (err.response && err.response.data) {
          errorMsg = err.response.data.error || (typeof err.response.data === 'string' ? err.response.data : errorMsg);
      } else if (err.message) {
          errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 min-h-[calc(100vh-72px)] flex items-stretch relative overflow-hidden bg-white animate-fade-in">
      {/* Visual Identity Section */}
      <div className="hidden lg:flex w-1/2 relative bg-nature-950 flex-col justify-between overflow-hidden">
        {/* Abstract Background Design */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#40926c 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-nature-600 rounded-full blur-[120px] opacity-30 -mr-48 -mt-48 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold-600 rounded-full blur-[100px] opacity-20 -ml-24 -mb-24 pointer-events-none"></div>

        <div className="p-16 relative z-10 h-full flex flex-col justify-center">
           <div className="space-y-6 max-w-lg">
              <h1 className="text-5xl font-extrabold text-white tracking-tight leading-tight">Optimize Yield. <br/><span className="text-nature-400">Maximize Profits.</span></h1>
              <p className="text-nature-200 text-lg leading-relaxed font-light">Join thousands of progressive farmers leveraging our predictive Machine Learning engine to transition into high-yield oilseed farming seamlessly.</p>
           </div>
           
           <div className="mt-16 space-y-4">
              <div className="flex items-center gap-3 text-nature-100 bg-white/5 py-3 px-5 rounded-2xl w-max border border-white/10 backdrop-blur-md">
                 <CheckCircle2 className="w-5 h-5 text-gold-400" /> <span className="font-medium flex items-center gap-2">96% Prediction Accuracy</span>
              </div>
              <div className="flex items-center gap-3 text-nature-100 bg-white/5 py-3 px-5 rounded-2xl w-max border border-white/10 backdrop-blur-md">
                 <CheckCircle2 className="w-5 h-5 text-gold-400" /> <span className="font-medium flex items-center gap-2">Direct APMC Rates Integration</span>
              </div>
              <div className="flex items-center gap-3 text-nature-100 bg-white/5 py-3 px-5 rounded-2xl w-max border border-white/10 backdrop-blur-md">
                 <CheckCircle2 className="w-5 h-5 text-gold-400" /> <span className="font-medium flex items-center gap-2">NMEO-OS Scheme Compliant</span>
              </div>
           </div>
        </div>
      </div>
      
      {/* Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative bg-[#F4F8F6]">
         <div className="w-full max-w-md animate-slide-up">
            <div className="text-center lg:text-left mb-10">
               <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
                 {isLogin ? 'Welcome back' : 'Create Account'}
               </h2>
               <p className="text-gray-500 text-lg">
                 {isLogin ? 'Securely sign in to your dashboard.' : 'Enter your details to get started.'}
               </p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm flex items-start gap-3">
                 <ShieldCheck className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                 <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><User className="w-5 h-5" /></div>
                    <input required type="text" placeholder="John Doe" className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-nature-500/50 focus:border-nature-500 transition-all font-medium text-gray-900" 
                      onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Email Address</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><Mail className="w-5 h-5" /></div>
                    <input required type="email" placeholder="you@farmer.com" className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-nature-500/50 focus:border-nature-500 transition-all font-medium text-gray-900"
                      onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Secure Password</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><Lock className="w-5 h-5" /></div>
                    <input required type="password" placeholder="••••••••" className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-nature-500/50 focus:border-nature-500 transition-all font-medium text-gray-900"
                      onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
              </div>

              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">City/District</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><MapPin className="w-4 h-4" /></div>
                        <input required type="text" placeholder="Bangalore" className="w-full pl-9 pr-3 py-3.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-nature-500/50 focus:border-nature-500 transition-all font-medium text-gray-900"
                          onChange={e => setFormData({...formData, location: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Land Size</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><Ruler className="w-4 h-4" /></div>
                        <input required type="number" step="0.1" placeholder="Acres" className="w-full pl-9 pr-3 py-3.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-nature-500/50 focus:border-nature-500 transition-all font-medium text-gray-900"
                          onChange={e => setFormData({...formData, land_size: e.target.value})} />
                    </div>
                  </div>
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full bg-nature-900 hover:bg-nature-950 text-white font-bold py-4 rounded-xl shadow-lg shadow-nature-900/20 transition-all flex items-center justify-center gap-2 group mt-8">
                {loading ? 'Authenticating...' : (isLogin ? 'Sign In Securely' : 'Create Free Account')}
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <button onClick={() => { setIsLogin(!isLogin); setError(''); }} className="text-gray-500 hover:text-nature-700 font-semibold text-sm transition-colors py-2 px-4 rounded-lg hover:bg-white">
                {isLogin ? "Don't have an account yet? " : 'Already registered? '} 
                <span className="text-nature-600 underline decoration-nature-300 underline-offset-4">{isLogin ? 'Sign up' : 'Sign in'}</span>
              </button>
            </div>
         </div>
      </div>
    </div>
  );
}
