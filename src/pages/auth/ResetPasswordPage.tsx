import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/logo-blue.png';
import Button from '../../components/basics/Button';
import { ArrowRight, AlertTriangle } from 'lucide-react';

export default function ResetPasswordPage() {
    const { t } = useTranslation();

    return ( 
        <div className="flex flex-col gap-6 max-w-md mx-auto w-full items-center justify-center min-h-[85vh] px-4 py-8">
            {/* Header / Logo */}
            <div className="gap-3 mb-2 items-center flex flex-col text-center"> 
                <img src={logo} alt="Reset Password" className="h-16 w-16 drop-shadow-sm" />
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">{t('auth.reset_password.title')}</h1>
                <span className="text-sm text-slate-500 dark:text-slate-400">{t('auth.reset_password.subtitle')}</span>
            </div>

            {/* Reset Card */}
            <div className="shadow-xl rounded-xl w-full bg-white p-8 border border-slate-100 dark:border-slate-800/40 dark:bg-slate-900 dark:shadow-slate-950/40">
                <form className="space-y-5" action="#" method="POST">
                    {/* Email Input */}
                    <div className="space-y-1.5">
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('auth.reset_password.email_label')}</label>
                        <input 
                            id="email" 
                            name="email" 
                            type="email" 
                            placeholder={t('auth.reset_password.email_placeholder')} 
                            autoComplete="email" 
                            required 
                            className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 transition-all duration-150" 
                        />
                    </div>

                    {/* Submit Button */}
                    <Button className="bg-primary hover:bg-primary-dark text-white py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer justify-center font-medium mt-2" >
                        <span>{t('auth.reset_password.submit_button')}</span>
                        <ArrowRight className="h-4 w-4" />
                    </Button>

                    {/* Links */}
                    <div className="flex flex-col items-center gap-2 pt-2 text-center">
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                            <Link to="/login" className="text-primary hover:underline cursor-pointer font-medium">{t('auth.reset_password.back_to_login')}</Link>
                        </span>
                    </div>
                </form>
            </div>

            {/* Disclaimer / Warning Banner at the bottom */}
            <div className="w-full p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100/80 dark:border-amber-900/20 flex gap-3 text-left">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs md:text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                    <strong className="font-semibold text-amber-900 dark:text-amber-200">{t('cta.warning_title')}</strong>{" "}
                    {t('cta.warning_text')}
                </p>
            </div>
        </div>
    )
}
