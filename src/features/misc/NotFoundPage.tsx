import { useNavigate } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';
import { Button } from '@/components/ui';

export function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="flex h-full flex-col items-center justify-center p-10 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-500">
        <Compass className="h-8 w-8" strokeWidth={1.6} />
      </div>
      <p className="text-4xl font-bold text-slate-800">404</p>
      <h1 className="mt-1 text-lg font-semibold text-slate-700">העמוד לא נמצא</h1>
      <p className="mt-1 max-w-sm text-sm text-slate-500">ייתכן שהעמוד הוסר, שמו שונה או שאינו זמין כרגע.</p>
      <Button className="mt-5" icon={<Home className="h-4 w-4" />} onClick={() => navigate('/dashboard')}>
        חזרה לעמוד הראשי
      </Button>
    </div>
  );
}
