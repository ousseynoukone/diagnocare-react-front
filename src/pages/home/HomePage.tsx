import { useState } from 'react'
import heroImg from '../../assets/hero.png'
import fastImg from '../../assets/fast.png'
import signalImg from '../../assets/signal.png'
import fileImg from '../../assets/file.png'
import confidentialImg from '../../assets/confidential.png'
import doctorImg from '../../assets/doctor.png'
import humanValidatedImg from '../../assets/human-validated.png'
import { faqItems } from '../../utils/FaqItems'



export function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="space-y-24">
      <section className="overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 rounded-full bg-sky-100 px-4 py-2 text-sm text-sky-700 ring-1 ring-slate-900/10 dark:bg-white/10 dark:text-sky-200 dark:ring-slate-100/10">
                <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
                Technologie médicale avancée
              </div>
              <div className="space-y-6">
                <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                  Votre santé, éclairée par l'intelligence artificielle
                </h1>
                <p className="max-w-2xl text-base leading-8 text-slate-700 dark:text-slate-300 sm:text-lg">
                  Une analyse de symptômes rapide, précise et confidentielle pour vous guider vers les bons soins. Technologie médicale avancée, interface simplifiée pour tous.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <a
                  href="/login"
                  className="inline-flex justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-sky-500"
                >
                  Commencer une évaluation
                </a>
                <a
                  href="#how-it-works"
                  className="inline-flex justify-center rounded-full border border-slate-300 bg-white px-8 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                >
                  En savoir plus
                </a>
              </div>
            </div>

            <div className="relative mx-auto max-w-xl overflow-hidden rounded-[2.5rem] bg-slate-100 p-8 shadow-2xl shadow-slate-200/50 ring-1 ring-slate-200/40 transition dark:bg-slate-950 dark:shadow-slate-950/40 dark:ring-slate-700/50 sm:p-10">
              <div className="absolute -left-8 top-8 h-28 w-28 rounded-full bg-sky-500/20 blur-3xl" />
              <div className="absolute -right-10 bottom-10 h-32 w-32 rounded-full bg-indigo-500/15 blur-3xl" />
              <img src={heroImg} alt="DiagnoCare illustration" className="relative mx-auto h-[360px] w-full object-contain" />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-slate-100 py-20 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Pourquoi choisir DiagnoCare ?</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Une approche médicale rigoureuse alliée à la puissance de l’IA.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-950">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-sky-50 dark:bg-slate-800">
                <img src={fastImg} alt="Analyse intelligente" className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Analyse intelligente</h3>
              <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Nos algorithmes sont entraînés sur des millions de cas cliniques validés pour offrir une précision maximale dans l’identification des pathologies.
              </p>
            </article>
            <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-950">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-50 dark:bg-slate-800">
                <img src={signalImg} alt="Suivi d'évolution" className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Suivi d’évolution</h3>
              <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Ne restez pas seul face à vos symptômes. DiagnoCare assure un suivi régulier pour détecter toute aggravation ou complication.
              </p>
            </article>
            <article className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-950">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-violet-50 dark:bg-slate-800">
                <img src={confidentialImg} alt="Confidentialité totale" className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Confidentialité totale</h3>
              <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Vos données de santé sont chiffrées de bout en bout. Elles ne quittent jamais votre appareil sans votre consentement explicite.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-white py-20 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Comment ça marche ?</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Un parcours simple en 4 étapes pour prendre soin de vous.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <article className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-sm dark:bg-slate-800">
                <img src={fileImg} alt="Décrivez" className="h-10 w-10" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">1. Décrivez</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Saisissez vos symptômes en langage naturel ou via notre liste guidée.
              </p>
            </article>
            <article className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-sm dark:bg-slate-800">
                <img src={fastImg} alt="Analysez" className="h-10 w-10" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">2. Analysez</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Notre IA compare votre profil à des milliers de cas similaires instantanément.
              </p>
            </article>
            <article className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-sm dark:bg-slate-800">
                <img src={humanValidatedImg} alt="Comprenez" className="h-10 w-10" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">3. Comprenez</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Recevez un rapport détaillé avec les causes probables et conseils.
              </p>
            </article>
            <article className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-700 dark:bg-slate-900">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-sm dark:bg-slate-800">
                <img src={doctorImg} alt="Consultez" className="h-10 w-10" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">4. Consultez</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Soyez orienté vers le bon spécialiste avec un résumé médical prêt.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="faq" className="bg-slate-100 py-20 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Questions fréquentes</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Tout ce qu’il faut savoir avant de commencer.
            </h2>
          </div>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <button
                key={item.question}
                type="button"
                onClick={() => setActiveIndex(activeIndex === index ? -1 : index)}
                className="w-full rounded-[1.75rem] border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-base font-semibold text-slate-900 dark:text-white">{item.question}</span>
                  <span className="text-slate-500 dark:text-slate-400">{activeIndex === index ? '−' : '+'}</span>
                </div>
                {activeIndex === index ? (
                  <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-400">{item.answer}</p>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-100/80">Prêt à prendre votre santé en main ?</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Rejoignez les milliers de patients qui utilisent DiagnoCare.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-cyan-100/90">
                Améliorez votre compréhension des symptômes et obtenez des recommandations personnalisées dès aujourd’hui.
              </p>
              <a
                href="/login"
                className="mt-8 inline-flex rounded-full bg-white px-8 py-3 text-sm font-semibold text-primary shadow-lg shadow-slate-950/20 transition hover:bg-slate-100"
              >
                Lancer une analyse gratuite
              </a>
            </div>
            <div className="rounded-[2rem] bg-slate-950/20 p-8 text-slate-100 shadow-xl shadow-slate-950/30">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-100/80">Avertissement important :</p>
              <p className="mt-4 text-sm leading-7 text-cyan-100/90">
                DiagnoCare est un outil d’aide à la décision et ne remplace pas un avis médical professionnel. Ceci n’est pas un diagnostic médical. En cas d’urgence, contactez immédiatement le 15 ou rendez-vous aux urgences.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
