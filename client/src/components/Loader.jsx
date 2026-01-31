
import { Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Loader = ({ text }) => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-green-50/50 rounded-xl">
      <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-green-600 animate-spin mb-3" />
      <span className="text-green-800 font-medium text-sm md:text-base animate-pulse">
        {text || t('common.loading')}
      </span>
    </div>
  );
};

export default Loader;
