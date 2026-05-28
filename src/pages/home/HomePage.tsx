import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import heroImg from '../../assets/doctor.png'
import signalImg from '../../assets/signal.png'
import confidentialImg from '../../assets/confidential.png'

import { ArrowRight, Zap, UserCheck, FileText, Stethoscope } from 'lucide-react';
import Button from '../../components/basics/Button'
import { useUserStore } from '../../store/UserStore'

export function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const { t } = useTranslation()
  const user = useUserStore((state) => state.user)
  const actionLink = user ? '/dashboard' : '/login'

  // Safely retrieve the localized FAQ items array
  const faqRaw = t('faq.items', { returnObjects: true })
  const faqItemsList = Array.isArray(faqRaw)
    ? (faqRaw as Array<{ question: string; answer: string }>)
    : []

  return (
    <div>
      <section className="overflow-hidden bg-slate-50 pt-12 pb-20 sm:pt-16 sm:pb-28 text-slate-900 dark:bg-slate-950 dark:text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="flex flex-col items-center text-center space-y-10">
              <div className="flex flex-col items-center gap-10">
                <div className='rounded-full m-2 bg-slate-200 p-2 w-24 h-24 mx-auto flex items-center justify-center dark:bg-slate-200'>
                  <img src={heroImg} alt="DiagnoCare illustration" className="h-14 w-14 object-contain" />
                </div>
                <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl max-w-3xl">
                  {t('hero.title')}<span className='text-primary'>{t('hero.title_highlight')}</span> 
                </h1>
                <p className="max-w-2xl text-base leading-8 text-slate-700 dark:text-slate-300 sm:text-lg mx-auto">
                  {t('hero.description')}
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
                <Link to={actionLink} className="flex items-center">
                  <Button>{t('hero.start_button')} <ArrowRight className="ml-2" /> </Button>  
                </Link>

                <a href="#how-it-works">
                  <Button className="bg-background-200 border-primary text-black hover:bg-primary-100">
                    {t('hero.learn_more')}
                  </Button>  
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-slate-100 dark:bg-slate-900 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">{t('features.category')}</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              {t('features.title')}
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-950">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded bg-sky-100 dark:bg-slate-200">
                <Zap className="h-7 w-7 text-sky-600 dark:text-sky-400" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{t('features.analysis.title')}</h3>
              <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {t('features.analysis.description')}
              </p>
            </article>
            <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-950">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded bg-emerald-100 dark:bg-slate-200">
                <img src={signalImg} alt="Suivi d'évolution" className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{t('features.evolution.title')}</h3>
              <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {t('features.evolution.description')}
              </p>
            </article>
            <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-950">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded bg-violet-100 dark:bg-slate-200">
                <img src={confidentialImg} alt="Confidentialité totale" className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{t('features.confidentiality.title')}</h3>
              <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {t('features.confidentiality.description')}
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-white py-20 sm:py-28 dark:bg-slate-950 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">{t('how_it_works.category')}</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              {t('how_it_works.title')}
            </h2>
          </div>
          <div className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4 isolate">
            {/* Horizontal connection line behind the circles */}
            <div className="absolute top-16 left-[12.5%] right-[12.5%] hidden h-0.5 bg-slate-200 dark:bg-background-800 lg:block -z-10" />

            <article className="p-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white border-4 border-slate-100 dark:border-background-300 dark:bg-background-100">
                <UserCheck className="h-8 w-8 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t('how_it_works.steps.describe.title')}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {t('how_it_works.steps.describe.description')}
              </p>
            </article>
            <article className="p-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white border-4 border-slate-100 dark:border-background-300 dark:bg-background-100">
                <Zap className="h-8 w-8 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t('how_it_works.steps.analyze.title')}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {t('how_it_works.steps.analyze.description')}
              </p>
            </article>
            <article className="p-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white border-4 border-slate-100 dark:border-background-300 dark:bg-background-100">
                <FileText className="h-8 w-8 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t('how_it_works.steps.understand.title')}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {t('how_it_works.steps.understand.description')}
              </p>
            </article>
            <article className="p-8 text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white border-4 border-slate-100 dark:border-background-300 dark:bg-background-100">
                <Stethoscope className="h-8 w-8 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t('how_it_works.steps.consult.title')}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {t('how_it_works.steps.consult.description')}
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="faq" className="bg-slate-100 py-20 sm:py-28 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">{t('faq.category')}</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              {t('faq.title')}
            </h2>
          </div>
          <div className="space-y-4">
            {faqItemsList.map((item, index) => (
              <button
                key={item.question}
                type="button"
                onClick={() => setActiveIndex(activeIndex === index ? -1 : index)}
                className="cursor-pointer w-full rounded-[1.75rem] border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-base font-semibold text-slate-900 dark:text-white">{item.question}</span>
                  <span className="text-slate-500 dark:text-slate-400">{activeIndex === index ? '−' : '+'}</span>
                </div>
                <div
                  className={`grid transition-all duration-200 ease-in-out ${
                    activeIndex === index
                      ? "grid-rows-[1fr] opacity-100 mt-4"
                      : "grid-rows-[0fr] opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-sm leading-7 text-slate-600 dark:text-slate-400">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary py-20 sm:py-28 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-100/80">{t('cta.category')}</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                {t('cta.title')}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-cyan-100/90">
                {t('cta.description')}
              </p>
              <Link
                to={actionLink}
                className="mt-8 inline-flex rounded-full bg-white px-8 py-3 text-sm font-semibold text-primary shadow-lg shadow-slate-950/20 transition hover:bg-slate-100"
              >
                {t('cta.button')}
              </Link>
            </div>
            <div className="rounded-[2rem] bg-slate-950/20 p-8 text-slate-100 shadow-xl shadow-slate-950/30">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-100/80">{t('cta.warning_title')}</p>
              <p className="mt-4 text-sm leading-7 text-cyan-100/90">
                {t('cta.warning_text')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
