import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F0FAF4] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-9 h-9 bg-[#1B6B3A] rounded-lg flex items-center justify-center">
            <LogIn className="w-5 h-5 text-white" />
          </div>
          <span className="font-['Lora'] text-2xl font-semibold text-[#0D2818]">ClinIntake</span>
        </div>

        <div className="bg-white border border-[#C8E6D4] rounded-xl p-8">
          <h1 className="font-['Lora'] text-xl font-semibold text-[#0D2818] mb-1">Welcome back</h1>
          <p className="text-sm text-[#7A9E87] mb-6">Sign in to your account</p>

          {error && (
            <div className="mb-4 p-3 bg-[#FEF2F2] border border-red-200 rounded-lg text-sm text-[#991B1B]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#3D6B50] mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-[#C8E6D4] rounded-lg px-3 py-2 text-sm text-[#0D2818] focus:outline-none focus:ring-2 focus:ring-[#1B6B3A] focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#3D6B50] mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-[#C8E6D4] rounded-lg px-3 py-2 text-sm text-[#0D2818] focus:outline-none focus:ring-2 focus:ring-[#1B6B3A] focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1B6B3A] hover:bg-[#0F4023] text-white font-semibold rounded-lg py-2.5 text-sm transition-colors disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>


          <p className="text-center text-sm text-[#7A9E87] mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#1B6B3A] font-medium hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
