import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './Results.css';

const FACTOR_LABELS = {
  age: { en: 'Age factor', ar: 'عامل العمر' },
  family_first_degree: { en: 'First-degree family history', ar: 'تاريخ عائلي من الدرجة الأولى' },
  family_second_degree: { en: 'Second-degree family history', ar: 'تاريخ عائلي من الدرجة الثانية' },
  family_bilateral: { en: 'Bilateral family cancer', ar: 'سرطان عائلي في كلا الثديين' },
  previous_breast_issue: { en: 'Previous breast condition', ar: 'حالة سابقة في الثدي' },
  atypical_hyperplasia: { en: 'Atypical hyperplasia', ar: 'فرط التنسج اللانمطي' },
  prior_biopsy: { en: 'Prior breast biopsy', ar: 'خزعة سابقة للثدي' },
  menarche_early: { en: 'Early menstrual onset', ar: 'بداية مبكرة للدورة الشهرية' },
  menopause_late: { en: 'Late menopause', ar: 'سن يأس متأخر' },
  nulliparous: { en: 'Never been pregnant', ar: 'لم تحملي أبدًا' },
  first_birth_late: { en: 'Late first birth (after 30)', ar: 'أول ولادة بعد سن 30' },
  hrt_use: { en: 'Hormone replacement therapy', ar: 'العلاج بالهرمونات البديلة' },
  alcohol_use: { en: 'Alcohol consumption', ar: 'تناول الكحول' },
  overweight_postmeno: { en: 'Overweight (post-menopause)', ar: 'زيادة الوزن بعد انقطاع الطمث' },
  physical_inactivity: { en: 'Physical inactivity', ar: 'قلة النشاط البدني' },
  smoking: { en: 'Smoking history', ar: 'تاريخ التدخين' },
  lump: { en: '⚠️ Breast or underarm lump', ar: '⚠️ كتلة في الثدي أو الإبط' },
  nipple_discharge: { en: '⚠️ Nipple discharge', ar: '⚠️ إفرازات من الحلمة' },
  skin_changes: { en: '⚠️ Skin changes on breast', ar: '⚠️ تغيرات في جلد الثدي' },
  nipple_inversion: { en: '⚠️ Inverted nipple', ar: '⚠️ انقلاب الحلمة' },
  breast_pain_persistent: { en: '⚠️ Persistent breast pain', ar: '⚠️ ألم مستمر في الثدي' },
  armpit_lump: { en: '⚠️ Armpit lump', ar: '⚠️ كتلة في الإبط' },
  size_change: { en: '⚠️ Breast size/shape change', ar: '⚠️ تغير في حجم الثدي أو شكله' },
};

const RISK_CONFIG = {
  low:      { label_en: 'Low Risk',      label_ar: 'خطر منخفض',    emoji: '🟢', bg: '#2a9d8f' },
  moderate: { label_en: 'Moderate Risk', label_ar: 'خطر متوسط',    emoji: '🟡', bg: '#f4a261' },
  high:     { label_en: 'High Risk',     label_ar: 'خطر مرتفع',    emoji: '🔴', bg: '#e63946' },
};

export default function Results({ result, onRestart }) {
  const { lang, t } = useApp();
  const config = RISK_CONFIG[result.risk_level];
  const recs = lang === 'ar' ? result.recommendations_ar : result.recommendations_en;

  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (result.score / 100) * circumference;

  return (
    <div className="results-page">
      <div className="container">
        <div className="results-header animate-in">
          <span className="section-tag">{t('Your Results', 'نتائجكِ')}</span>
          <h1>{t('Risk Assessment Complete', 'اكتمل تقييم المخاطر')}</h1>
        </div>

        {result.urgent && (
          <div className="urgent-banner animate-in">
            🚨 {t(
              'You reported symptoms that require IMMEDIATE medical attention. Please see a doctor as soon as possible.',
              'لقد ذكرت أعراضًا تستوجب مراجعة الطبيب فورًا. يرجى زيارة الطبيب في أقرب وقت ممكن.'
            )}
          </div>
        )}

        <div className="results-grid">
          {/* Score Card */}
          <div className="score-card card animate-in">
            <div className="score-circle-wrap">
              <svg width="140" height="140" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="54" fill="none" stroke="var(--border)" strokeWidth="10" />
                <circle
                  cx="70" cy="70" r="54"
                  fill="none"
                  stroke={config.bg}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  transform="rotate(-90 70 70)"
                  style={{ transition: 'stroke-dashoffset 1.5s ease' }}
                />
              </svg>
              <div className="score-inner">
                <span className="score-num">{result.score}</span>
                <span className="score-of">{t('/100', '/100')}</span>
              </div>
            </div>

            <div className="risk-badge" style={{ background: config.bg }}>
              {config.emoji} {lang === 'ar' ? config.label_ar : config.label_en}
            </div>

            <p className="score-note">
              {t(
                'This score reflects your risk profile based on provided information.',
                'تعكس هذه الدرجة ملف مخاطرك بناءً على المعلومات المقدمة.'
              )}
            </p>
          </div>

          {/* Recommendations */}
          <div className="recs-card card animate-in" style={{ animationDelay: '0.1s' }}>
            <h2>{t('Recommendations', 'التوصيات')}</h2>
            <div className="ribbon-bar" />
            <ul className="recs-list">
              {recs.map((r, i) => (
                <li key={i} className="rec-item">
                  <span className="rec-dot" style={{ background: config.bg }} />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contributing Factors */}
        {result.contributing_factors.length > 0 && (
          <div className="factors-card card animate-in" style={{ animationDelay: '0.2s' }}>
            <h2>{t('Contributing Factors Identified', 'عوامل الخطر المحددة')}</h2>
            <div className="ribbon-bar" />
            <div className="factors-grid">
              {result.contributing_factors.map(f => (
                <div
                  key={f}
                  className={`factor-tag ${result.symptoms_present.includes(f) ? 'urgent' : ''}`}
                >
                  {lang === 'ar'
                    ? (FACTOR_LABELS[f]?.ar || f)
                    : (FACTOR_LABELS[f]?.en || f)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="disclaimer-box animate-in" style={{ animationDelay: '0.3s' }}>
          ⚕️ {lang === 'ar' ? result.disclaimer_ar : result.disclaimer_en}
        </div>

        {/* Actions */}
        <div className="results-actions animate-in" style={{ animationDelay: '0.4s' }}>
          <button className="btn-secondary" onClick={onRestart}>
            {t('← Retake Assessment', 'إعادة التقييم ←')}
          </button>
          <Link to="/self-exam" className="btn-primary">
            {t('Learn Self-Exam →', 'تعلمي الفحص الذاتي ←')}
          </Link>
        </div>
      </div>
    </div>
  );
}
