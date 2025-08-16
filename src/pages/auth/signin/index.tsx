import UserAuthForm from './components/user-auth-form';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignInPage() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('res_token');

    if (token) {
      navigate('/');
    }
  }, [navigate]);
  return (
    <div className="flex h-screen w-full items-center justify-center ">
      <div className="m-auto flex w-[50%] max-w-[500px] flex-col justify-center space-y-6 rounded-xl bg-white    p-10 shadow-md ">
        <div className="flex w-full flex-col items-center justify-center space-y-2 text-center">
          <div className="w-22 h-22 mb-5 rounded-3xl bg-gradient-to-r from-[#F35827]  to-[#F9972F]">
            <img src="/images/logo.png" width={70} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to access your dashboard
          </p>
        </div>
        <UserAuthForm />
      </div>
    </div>
  );
}
