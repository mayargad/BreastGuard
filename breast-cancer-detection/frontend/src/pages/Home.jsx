import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Home.css';

const stats = [
  { num: '2.3M', label_en: 'New cases yearly', label_ar: 'حالة جديدة سنويًا' },
  { num: '99%', label_en: 'Survival if caught early', label_ar: 'نسبة النجاة إذا اكتُشف مبكرًا' },
  { num: '1 in 8', label_en: 'Women affected globally', label_ar: 'من كل 8 نساء حول العالم' },
];

const features = [
  {
    icon: '📋',
    title_en: 'Risk Assessment',
    title_ar: 'تقييم المخاطر',
    desc_en: 'Answer a few simple questions about your health history and lifestyle to get your personalized risk profile.',
    desc_ar: 'أجب على بعض الأسئلة البسيطة حول تاريخك الصحي ونمط حياتك للحصول على ملفك الشخصي لتقييم المخاطر.',
    link: '/assessment',
  },
  {
    icon: '🔍',
    title_en: 'Learn the Signs',
    title_ar: 'تعرف على العلامات',
    desc_en: 'Understand the warning signs and symptoms of breast cancer that you should never ignore.',
    desc_ar: 'تعرف على علامات وأعراض سرطان الثدي التحذيرية التي لا يجب تجاهلها أبدًا.',
    link: '/about',
  },
  {
    icon: '🖐️',
    title_en: 'Self-Exam Guide',
    title_ar: 'دليل الفحص الذاتي',
    desc_en: 'Learn how to perform a proper breast self-examination in 5 easy steps.',
    desc_ar: 'تعلم كيفية إجراء الفحص الذاتي للثدي بشكل صحيح في 5 خطوات سهلة.',
    link: '/self-exam',
  },
];

export default function Home() {
  const { t } = useApp();

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg-decoration" aria-hidden="true">
          <div className="dec-circle dec-1" />
          <div className="dec-circle dec-2" />
          <div className="dec-circle dec-3" />
        </div>

        <div className="container hero-content">
          <div className="hero-badge animate-in">
            🎀 {t('Breast Cancer Awareness', 'التوعية بسرطان الثدي')}
          </div>
          <h1 className="hero-title animate-in" style={{ animationDelay: '0.1s' }}>
            {t(
              <>Early Detection<br /><em>Saves Lives</em></>,
              <>الاكتشاف المبكر<br /><em>ينقذ الأرواح</em></>
            )}
          </h1>
          <p className="hero-subtitle animate-in" style={{ animationDelay: '0.2s' }}>
            {t(
              'Take our free, confidential breast cancer risk assessment. Get personalized information based on your health profile — in under 5 minutes.',
              'أجري تقييمنا المجاني والسري لخطر الإصابة بسرطان الثدي. احصل على معلومات مخصصة بناءً على ملفك الصحي — في أقل من 5 دقائق.'
            )}
          </p>
          <div className="hero-actions animate-in" style={{ animationDelay: '0.3s' }}>
            <Link to="/assessment" className="btn-primary hero-cta">
              {t('Start Assessment →', 'ابدأ التقييم ←')}
            </Link>
            <Link to="/about" className="btn-secondary">
              {t('Learn More', 'اعرف أكثر')}
            </Link>
          </div>
          <p className="hero-disclaimer animate-in" style={{ animationDelay: '0.4s' }}>
            🔒 {t('100% Private · Not a medical diagnosis', 'خاص 100% · ليس تشخيصًا طبيًا')}
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((s, i) => (
              <div className="stat-card" key={i}>
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{t(s.label_en, s.label_ar)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">{t('What We Offer', 'ما نقدمه')}</span>
            <h2>{t('Your Complete Awareness Hub', 'مركزك الشامل للتوعية')}</h2>
            <p>
              {t(
                'Everything you need to stay informed, aware, and proactive about breast health.',
                'كل ما تحتاجه لتظلي على علم ووعي وتحرك بشكل استباقي بشأن صحة الثدي.'
              )}
            </p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <Link to={f.link} className="feature-card card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="feature-icon">{f.icon}</div>
                <div className="ribbon-bar" style={{ width: '40px' }} />
                <h3>{t(f.title_en, f.title_ar)}</h3>
                <p>{t(f.desc_en, f.desc_ar)}</p>
                <span className="feature-arrow">{t('Learn more →', 'اعرف أكثر ←')}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-inner card">
            <div className="cta-icon">🎀</div>
            <h2>{t("Don't Wait. Your Health Matters.", 'لا تنتظر. صحتك تهم.')}</h2>
            <p>
              {t(
                'Early detection can increase survival rates to nearly 99%. Take the first step today.',
                'يمكن للاكتشاف المبكر أن يرفع معدلات النجاة إلى ما يقارب 99%. اتخذ الخطوة الأولى اليوم.'
              )}
            </p>
            <Link to="/assessment" className="btn-primary">
              {t('Take Free Assessment', 'أجري التقييم المجاني')}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>
            ⚕️ {t(
              'This website is for educational awareness only and does not constitute medical advice. Always consult a qualified healthcare professional.',
              'هذا الموقع لأغراض التوعية التعليمية فقط ولا يُعدّ نصيحة طبية. استشير دائمًا متخصصًا في الرعاية الصحية المؤهلًا.'
            )}
          </p>
          <p style={{ marginTop: '8px', opacity: 0.5 }}>
            🎀 BreastGuard {new Date().getFullYear()} · {t('Awareness Project', 'مشروع التوعية')}
          </p>
        </div>
      </footer>
    </div>
  );
}
