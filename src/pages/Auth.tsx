import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { PasswordUtils } from '@/lib/crypto';
import { AuthRedirect } from '@/components/auth/AuthRedirect';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register, isLoading, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors([]); // Clear errors when user starts typing
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.email) {
      newErrors.push('Email is required');
    } else if (!PasswordUtils.isValidEmail(formData.email)) {
      newErrors.push('Please enter a valid email address');
    }

    if (!formData.password) {
      newErrors.push('Password is required');
    }

    if (!isLogin) {
      if (!formData.name.trim()) {
        newErrors.push('Name is required');
      }

      const passwordValidation = PasswordUtils.validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.push(...passwordValidation.errors);
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.push('Passwords do not match');
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      let success = false;
      
      if (isLogin) {
        success = await login(formData.email, formData.password);
        if (!success) {
          setErrors(['Invalid email or password']);
        }
      } else {
        success = await register(formData.name, formData.email, formData.password);
        if (!success) {
          setErrors(['Registration failed. Email might already be in use.']);
        }
      }
    } catch (error) {
      setErrors(['An unexpected error occurred. Please try again.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setErrors([]);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const fillDemoCredentials = () => {
    setFormData(prev => ({
      ...prev,
      email: 'demo@chicker.com',
      password: 'password123'
    }));
    setErrors([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <AuthRedirect />
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-2xl">C</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {isLogin ? 'Welcome Back!' : 'Join Chicker'}
          </h1>
          <p className="text-muted-foreground">
            {isLogin ? 'Sign in to your account' : 'Create your account to get started'}
          </p>
        </div>

        {/* Auth Form */}
        <Card className="glass-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">
              {isLogin ? 'Sign In' : 'Create Account'}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? 'Enter your credentials to access your account'
                : 'Fill in your details to create a new account'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Messages */}
              {errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* Name Field (Register only) */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="pl-10"
                      disabled={isSubmitting || isLoading}
                    />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    disabled={isSubmitting || isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 pr-10"
                    disabled={isSubmitting || isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting || isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Confirm Password Field (Register only) */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-10 pr-10"
                      disabled={isSubmitting || isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1 h-8 w-8"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isSubmitting || isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting || isLoading
                  ? 'Loading...'
                  : isLogin
                  ? 'Sign In'
                  : 'Create Account'
                }
              </Button>
            </form>

            {/* Demo Credentials (Login only) */}
            {isLogin && (
              <>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground text-center">
                    Try the demo account:
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={fillDemoCredentials}
                    disabled={isSubmitting || isLoading}
                  >
                    Use Demo Credentials
                  </Button>
                </div>
              </>
            )}

            {/* Toggle Mode */}
            <Separator className="my-4" />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto font-semibold"
                  onClick={toggleMode}
                  disabled={isSubmitting || isLoading}
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;