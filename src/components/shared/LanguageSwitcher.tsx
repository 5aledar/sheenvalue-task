import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/components/ui/select';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'En' },
  { code: 'ar', label: 'Ar' }
];

export default function LanguageSwitcher() {
  const { i18n: i18nextInstance } = useTranslation();

  const handleChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <Select
      onValueChange={handleChange}
      defaultValue={i18nextInstance.language || 'en'}
    >
      <SelectTrigger className="w-[70px]">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
