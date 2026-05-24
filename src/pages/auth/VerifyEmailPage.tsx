import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/logo-blue.png';
import Button from '../../components/basics/Button';
import { ArrowRight, AlertTriangle, RefreshCw } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useSendOtp, useValidateOtp } from '../../hooks/useAuth';
import { handleApiError } from '../../utils/errorHelper';
import { toast } from 'sonner';

export default function VerifyEmailPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const emailFromUrl = searchParams.get('email') || '';

    const { mutate: validateOtp, isPending: isValidating } = useValidateOtp();
    const { mutate: sendOtp, isPending: isResending } = useSendOtp();

    const { register, handleSubmit, setError, getValues, formState: { errors } } = useForm({
        defaultValues: {
            email: emailFromUrl,
            code: ''
        }
    });

    const [generalError, setGeneralError] = useState<string | null>(null);
    const [resendCooldown, setResendCooldown] = useState(0);

    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const onSubmit = (data: any) => {
        setGeneralError(null);
        validateOtp({ email: data.email, code: data.code }, {
            onSuccess: () => {
                toast.success("Votre compte a été vérifié avec succès ! Vous pouvez maintenant vous connecter.");
                navigate('/login');
            },
            onError: (err: any) => {
                handleApiError(err, setError, setGeneralError, "Le code de vérification est invalide ou a expiré.");
            }
        });
    };

    const handleResend = (email: string) => {
        if (!email) {
            setGeneralError("Veuillez saisir une adresse email pour renvoyer le code.");
            return;
        }

        setGeneralError(null);
        sendOtp({ email }, {
            onSuccess: () => {
                toast.success("Un nouveau code de vérification a été envoyé par email.");
                setResendCooldown(60); // Cooldown of 60 seconds
            },
            onError: (err: any) => {
                handleApiError(err, setError, setGeneralError, "Impossible de renvoyer le code de vérification.");
            }
        });
    };

    return (
        <div className="flex flex-col gap-6 max-w-md mx-auto w-full items-center justify-center min-h-[85vh] px-4 py-8">
            {/* Header / Logo */}
            <div className="gap-3 mb-2 items-center flex flex-col text-center">
                <img src={logo} alt="Verify Email" className="h-16 w-16 drop-shadow-sm" />
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                    Vérifiez votre compte
                </h1>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                    Saisissez le code OTP à 6 chiffres envoyé à votre adresse e-mail.
                </span>
            </div>

            {/* Verification Card */}
            <div className="shadow-xl rounded-xl w-full bg-white p-8 border border-slate-100 dark:border-slate-800/40 dark:bg-slate-900 dark:shadow-slate-950/40">
                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    {generalError && (
                        <div className="flex gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm">
                            <AlertTriangle className="h-5 w-5 shrink-0" />
                            <span>{generalError}</span>
                        </div>
                    )}

                    {/* Email Input */}
                    <div className="space-y-1.5">
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Adresse email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="vous@exemple.com"
                            disabled={isValidating || isResending}
                            className={`w-full rounded-lg border px-3.5 py-2 text-sm placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-500 transition-all duration-150 disabled:opacity-60 ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-slate-200'}`}
                            {...register("email", {
                                required: "L'adresse email est requise.",
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: "Veuillez entrer une adresse e-mail valide."
                                }
                            })}
                        />
                        {errors.email && (
                            <span className="text-red-500 text-xs mt-1 block">
                                {errors.email.message as string}
                            </span>
                        )}
                    </div>

                    {/* OTP Code Input */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-baseline">
                            <label htmlFor="code" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Code de vérification
                            </label>
                            
                            {/* Resend button with countdown */}
                            <button
                                type="button"
                                disabled={resendCooldown > 0 || isResending || isValidating}
                                onClick={() => handleResend(getValues('email'))}
                                className="text-xs text-primary hover:text-primary-dark font-medium transition-colors disabled:text-slate-400 disabled:cursor-not-allowed hover:underline flex items-center gap-1 cursor-pointer"
                            >
                                <RefreshCw className={`h-3 w-3 ${isResending ? 'animate-spin' : ''}`} />
                                {resendCooldown > 0 
                                    ? `Renvoyer (${resendCooldown}s)` 
                                    : "Renvoyer le code"
                                }
                            </button>
                        </div>
                        
                        <input
                            id="code"
                            type="text"
                            placeholder="123456"
                            maxLength={6}
                            autoComplete="one-time-code"
                            disabled={isValidating || isResending}
                            className={`w-full rounded-lg border text-center tracking-[0.2em] font-semibold text-lg px-3.5 py-2 placeholder-slate-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 transition-all duration-150 disabled:opacity-60 ${errors.code ? 'border-red-500 focus:ring-red-200' : 'border-slate-200'}`}
                            {...register("code", {
                                required: "Le code est requis.",
                                pattern: {
                                    value: /^[0-9]{6}$/,
                                    message: "Le code doit être composé de 6 chiffres."
                                }
                            })}
                        />
                        {errors.code && (
                            <span className="text-red-500 text-xs mt-1 block text-left">
                                {errors.code.message as string}
                            </span>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isValidating || isResending}
                        className="bg-primary hover:bg-primary-dark text-white py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer justify-center font-medium mt-2 disabled:opacity-60 disabled:cursor-not-allowed w-full flex items-center gap-2"
                    >
                        <span>{isValidating ? "Validation..." : "Valider le code"}</span>
                        {!isValidating && <ArrowRight className="h-4 w-4" />}
                    </Button>

                    {/* Back link */}
                    <div className="flex flex-col items-center gap-2 pt-2 text-center">
                        <Link to="/login" className="text-sm text-primary hover:underline cursor-pointer font-medium">
                            Retour à la page de connexion
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
