import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock, Database, UserCheck, Globe, Trash2, ShieldCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
    const { t } = useTranslation();

    const sections = [
        {
            icon: <Database className="h-5 w-5" />,
            titleKey: 'legal.privacy.sections.data_collection.title',
            contentKey: 'legal.privacy.sections.data_collection.content',
        },
        {
            icon: <Lock className="h-5 w-5" />,
            titleKey: 'legal.privacy.sections.data_usage.title',
            contentKey: 'legal.privacy.sections.data_usage.content',
        },
        {
            icon: <ShieldCheck className="h-5 w-5" />,
            titleKey: 'legal.privacy.sections.data_protection.title',
            contentKey: 'legal.privacy.sections.data_protection.content',
        },
        {
            icon: <Globe className="h-5 w-5" />,
            titleKey: 'legal.privacy.sections.data_sharing.title',
            contentKey: 'legal.privacy.sections.data_sharing.content',
        },
        {
            icon: <UserCheck className="h-5 w-5" />,
            titleKey: 'legal.privacy.sections.your_rights.title',
            contentKey: 'legal.privacy.sections.your_rights.content',
        },
        {
            icon: <Trash2 className="h-5 w-5" />,
            titleKey: 'legal.privacy.sections.data_retention.title',
            contentKey: 'legal.privacy.sections.data_retention.content',
        },
    ];

    return (
        <div className="min-h-[80vh] py-12 px-4">
            <div className="mx-auto max-w-3xl">
                {/* Back link */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors mb-8 group"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    {t('legal.back_to_home')}
                </Link>

                {/* Header */}
                <div className="mb-10">
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-4">
                        <Lock className="h-3.5 w-3.5" />
                        {t('legal.privacy.badge')}
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                        {t('legal.privacy.title')}
                    </h1>
                    <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm">
                        {t('legal.privacy.last_updated', { date: '27/05/2026' })}
                    </p>
                </div>

                {/* Introduction */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 mb-6 shadow-sm">
                    <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
                        {t('legal.privacy.introduction')}
                    </p>
                </div>

                {/* Sections */}
                <div className="space-y-4">
                    {sections.map((section, index) => (
                        <div
                            key={index}
                            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm transition-all hover:shadow-md"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                    {section.icon}
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
                                        {t(section.titleKey)}
                                    </h2>
                                    <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
                                        {t(section.contentKey)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact section */}
                <div className="mt-8 rounded-xl border border-emerald-200/50 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-950/10 p-6">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        {t('legal.privacy.contact.title')}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        {t('legal.privacy.contact.content')}
                    </p>
                </div>
            </div>
        </div>
    );
}
