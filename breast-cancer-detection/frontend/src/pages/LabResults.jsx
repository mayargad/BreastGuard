import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import axios from 'axios';
import './LabResults.css';

const MARKERS = [
  {
    id: 'ca153', name: 'CA 15-3', unit: 'U/mL', normal_max: 31.3,
    label_en: 'CA 15-3 (Cancer Antigen 15-3)',
    label_ar: 'CA 15-3 (مستضد السرطان 15-3)',
    desc_en: 'Primary breast cancer tumor marker. Elevated levels may indicate breast cancer or recurrence.',
    desc_ar: 'المؤشر الرئيسي لسرطان الثدي. قد تشير المستويات المرتفعة إلى الإصابة بسرطان الثدي أو الانتكاس.',
    ref_en: 'Normal: < 31.3 U/mL', ref_ar: 'الطبيعي: أقل من 31.3 U/mL',
  },
  {
    id: 'cea', name: 'CEA', unit: 'ng/mL', normal_max: 5.0,
    label_en: 'CEA (Carcinoembryonic Antigen)',
    label_ar: 'CEA (المستضد المضغوي السرطاني)',
    desc_en: 'General cancer marker. Elevated levels can be associated with breast cancer and others.',
    desc_ar: 'مؤشر عام للسرطان. قد تُرتبط المستويات المرتفعة بسرطان الثدي وأنواع أخرى.',
    ref_en: 'Normal: < 5.0 ng/mL', ref_ar: 'الطبيعي: أقل من 5.0 ng/mL',
  },
  {
    id: 'wbc', name: 'WBC', unit: '× 10³/µL', normal_min: 4.5, normal_max: 11.0,
    label_en: 'WBC (White Blood Cell Count)',
    label_ar: 'WBC (عدد كريات الدم البيضاء)',
    desc_en: 'Part of CBC. Abnormal levels may indicate infection, immune response, or treatment effects.',
    desc_ar: 'جزء من صورة الدم الكاملة. قد تشير المستويات غير الطبيعية إلى عدوى أو استجابة مناعية.',
    ref_en: 'Normal: 4.5–11.0 × 10³/µL', ref_ar: 'الطبيعي: 4.5–11.0 × 10³/µL',
  },
  {
    id: 'rbc', name: 'RBC', unit: '× 10⁶/µL', normal_min: 4.2, normal_max: 5.4,
    label_en: 'RBC (Red Blood Cell Count)',
    label_ar: 'RBC (عدد كريات الدم الحمراء)',
    desc_en: 'Low RBC (anemia) can be associated with cancer and cancer treatments.',
    desc_ar: 'انخفاض RBC (فقر الدم) يمكن أن يرتبط بالسرطان والعلاجات المضادة له.',
    ref_en: 'Normal (female): 4.2–5.4 × 10⁶/µL', ref_ar: 'الطبيعي (إناث): 4.2–5.4 × 10⁶/µL',
  },
  {
    id: 'hgb', name: 'Hemoglobin', unit: 'g/dL', normal_min: 12.0, normal_max: 16.0,
    label_en: 'Hemoglobin (Hgb)',
    label_ar: 'الهيموجلوبين (Hgb)',
    desc_en: 'Low hemoglobin (anemia) is common in cancer patients and may indicate disease progression.',
    desc_ar: 'انخفاض الهيموجلوبين شائع لدى مرضى السرطان وقد يشير إلى تطور المرض.',
    ref_en: 'Normal (female): 12.0–16.0 g/dL', ref_ar: 'الطبيعي (إناث): 12.0–16.0 g/dL',
  },
  {
    id: 'plt', name: 'Platelets', unit: '× 10³/µL', normal_min: 150, normal_max: 400,
    label_en: 'Platelet Count (PLT)',
    label_ar: 'عدد الصفائح الدموية (PLT)',
    desc_en: 'Abnormal platelet levels can be associated with cancer or its treatment.',
    desc_ar: 'قد تُرتبط مستويات الصفائح الدموية غير الطبيعية بالسرطان أو علاجه.',
    ref_en: 'Normal: 150–400 × 10³/µL', ref_ar: 'الطبيعي: 150–400 × 10³/µL',
  },
];

function getStatus(marker, value) {
  if (!value || value === '') return null;
  const v = parseFloat(value);
  if (isNaN(v)) return null;
  if (marker.normal_min !== undefined) {
    if (v < marker.normal_min) return 'low';
    if (v > marker.normal_max) return 'high';
    return 'normal';
  }
  return v > marker.normal_max ? 'high' : 'normal';
}

const STATUS_CONFIG = {
  normal: { label_en: 'Normal', label_ar: 'طبيعي', color: '#2a9d8f', icon: '✅' },
  high:   { label_en: 'High',   label_ar: 'مرتفع', color: '#e63946', icon: '⬆️' },
  low:    { label_en: 'Low',    label_ar: 'منخفض', color: '#f4a261', icon: '⬇️' },
};

export default function LabResults() {
  const { lang, t } = useApp();
  const [values, setValues]           = useState({});
  const [result, setResult]           = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [uploadState, setUploadState] = useState('idle'); // idle|uploading|done|error
  const [uploadMsg, setUploadMsg]     = useState('');
  const [foundCount, setFoundCount]   = useState(0);
  const [dragOver, setDragOver]       = useState(false);
  const fileInputRef = useRef();

  const handleChange = (id, val) => {
    setValues(prev => ({ ...prev, [id]: val }));
    setResult(null);
  };

  const handleFile = async (file) => {
    if (!file) return;
    const name = file.name.toLowerCase();
    if (!name.endsWith('.pdf') && !name.endsWith('.emg') && !name.endsWith('.doc')) {
      setUploadState('error');
      setUploadMsg(t(
        'Unsupported file type. Please upload a PDF or Word (.emg) file.',
        'نوع ملف غير مدعوم. يرجى رفع ملف PDF أو Word (.emg).'
      ));
      return;
    }

    setUploadState('uploading');
    setUploadMsg('');
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/api/parse/extract', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const { markers, found_count, success_en, success_ar, warning_en, warning_ar } = res.data;

      if (found_count > 0) {
        setValues(prev => ({ ...prev, ...markers }));
        setFoundCount(found_count);
        setUploadState('done');
        setUploadMsg(lang === 'ar' ? success_ar : success_en);
      } else {
        setUploadState('error');
        setUploadMsg(lang === 'ar' ? (warning_ar || success_ar) : (warning_en || success_en));
      }
    } catch {
      setUploadState('error');
      setUploadMsg(t(
        'Could not read the file. Make sure it is a valid PDF or Word document.',
        'تعذّر قراءة الملف. تأكد من أنه ملف PDF أو Word صالح.'
      ));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleAnalyze = async () => {
    const filled = Object.keys(values).filter(k => values[k] !== '' && values[k] !== undefined);
    if (filled.length === 0) {
      setError(t('Please enter at least one test value.', 'يرجى إدخال قيمة اختبار واحدة على الأقل.'));
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload = {};
      MARKERS.forEach(m => {
        if (values[m.id] !== undefined && values[m.id] !== '') {
          payload[m.id] = parseFloat(values[m.id]);
        }
      });
      const res = await axios.post('/api/assessment/lab-results', payload);
      setResult(res.data);
    } catch {
      setError(t('Something went wrong. Please try again.', 'حدث خطأ ما. يرجى المحاولة مرة أخرى.'));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setValues({}); setResult(null); setError('');
    setUploadState('idle'); setUploadMsg(''); setFoundCount(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="lab-page">
      {/* Hero */}
      <div className="lab-hero">
        <div className="container">
          <span className="section-tag">{t('Lab Analysis', 'تحليل المختبر')}</span>
          <h1>{t('Blood Test Analysis', 'تحليل نتائج التحاليل')}</h1>
          <p>{t(
            "Upload your lab report (PDF or Word) and we'll fill in the values automatically — or enter them manually.",
            'ارفع تقرير التحاليل (PDF أو Word) وسنملأ القيم تلقائياً — أو أدخلها يدوياً.'
          )}</p>
          <div className="lab-disclaimer">
            ⚕️ {t('For educational awareness only. Not a medical diagnosis.', 'لأغراض التوعية التعليمية فقط. ليس تشخيصًا طبيًا.')}
          </div>
        </div>
      </div>

      <div className="container lab-content">

        {/* ══ Upload Zone ══════════════════════════════════════ */}
        <div
          className={`upload-zone ${dragOver ? 'drag-over' : ''} upload-${uploadState}`}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => uploadState !== 'done' && fileInputRef.current?.click()}
          style={{ cursor: uploadState === 'done' ? 'default' : 'pointer' }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.emg,.doc"
            style={{ display: 'none' }}
            onChange={e => handleFile(e.target.files[0])}
          />

          {uploadState === 'idle' && (<>
            <div className="uz-icon">📋</div>
            <div className="uz-title">{t('Upload Your Lab Report', 'ارفع تقرير التحاليل')}</div>
            <div className="uz-sub">{t('Drag & drop here, or click to browse', 'اسحب وأفلت هنا، أو اضغط للتصفح')}</div>
            <div className="uz-formats">
              <span>PDF</span><span>EMG</span><span>DOC</span>
            </div>
            <div className="uz-hint">
              {t(
                '✨ We\'ll automatically extract CA 15-3, CEA, WBC, RBC, Hemoglobin & Platelets',
                '✨ سنستخرج تلقائياً: CA 15-3 وCEA وكريات الدم والهيموجلوبين والصفائح'
              )}
            </div>
          </>)}

          {uploadState === 'uploading' && (<>
            <div className="uz-icon uz-spin">⚙️</div>
            <div className="uz-title">{t('Reading your file...', 'جارٍ قراءة ملفك...')}</div>
            <div className="uz-sub">{t('Scanning for lab values', 'مسح القيم المخبرية')}</div>
            <div className="uz-progress-bar"><div className="uz-progress-fill" /></div>
          </>)}

          {uploadState === 'done' && (<>
            <div className="uz-icon">🎉</div>
            <div className="uz-title uz-success">{t(`${foundCount} value(s) found & filled!`, `تم ملء ${foundCount} قيمة تلقائياً!`)}</div>
            <div className="uz-sub">{uploadMsg}</div>
            <button className="uz-retry-btn" onClick={e => { e.stopPropagation(); handleReset(); }}>
              {t('↺ Upload a different file', 'رفع ملف مختلف')}
            </button>
          </>)}

          {uploadState === 'error' && (<>
            <div className="uz-icon">⚠️</div>
            <div className="uz-title uz-error">{t('Could not extract values', 'تعذّر استخراج القيم')}</div>
            <div className="uz-sub">{uploadMsg}</div>
            <div className="uz-sub" style={{marginTop:6, opacity:.7}}>
              {t('Please enter values manually below.', 'يمكنك إدخال القيم يدوياً في الأسفل.')}
            </div>
            <button className="uz-retry-btn" onClick={e => { e.stopPropagation(); setUploadState('idle'); }}>
              {t('↺ Try again', 'حاولي مجدداً')}
            </button>
          </>)}
        </div>

        {/* Divider */}
        <div className="lab-divider">
          <span>{t('or enter values manually', 'أو أدخل القيم يدوياً')}</span>
        </div>

        {/* ══ Marker Cards ═════════════════════════════════════ */}
        <div className="markers-grid">
          {MARKERS.map(m => {
            const status = getStatus(m, values[m.id]);
            const cfg    = status ? STATUS_CONFIG[status] : null;
            const isAuto = uploadState === 'done' && !!values[m.id];
            return (
              <div key={m.id} className={`marker-card card ${status || ''}`}>
                <div className="marker-header">
                  <div>
                    <div className="marker-name">
                      {m.name}
                      {isAuto && <span className="auto-pill">✨ {t('Auto', 'تلقائي')}</span>}
                    </div>
                    <div className="marker-label">{t(m.label_en, m.label_ar)}</div>
                  </div>
                  {cfg && (
                    <div className="marker-status" style={{ color: cfg.color, borderColor: cfg.color }}>
                      {cfg.icon} {t(cfg.label_en, cfg.label_ar)}
                    </div>
                  )}
                </div>
                <p className="marker-desc">{t(m.desc_en, m.desc_ar)}</p>
                <div className="marker-ref">{t(m.ref_en, m.ref_ar)}</div>
                <div className="marker-input-row">
                  <input
                    type="number"
                    step="0.01"
                    value={values[m.id] || ''}
                    onChange={e => handleChange(m.id, e.target.value)}
                    placeholder={t('Enter value', 'أدخل القيمة')}
                    className={`marker-input ${isAuto ? 'auto-filled' : ''}`}
                    style={{ borderColor: cfg ? cfg.color : isAuto ? '#2a9d8f' : undefined }}
                  />
                  <span className="marker-unit">{m.unit}</span>
                </div>
                {status && (
                  <div className="marker-bar-wrap">
                    <div className="marker-bar-fill" style={{ background: cfg.color, width: status === 'normal' ? '100%' : '60%' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {error && <div className="lab-error">{error}</div>}

        <div className="lab-submit-row">
          <button className="btn-secondary" onClick={handleReset}>
            {t('↺ Reset', 'إعادة تعيين')}
          </button>
          <button className="btn-primary lab-submit" onClick={handleAnalyze} disabled={loading}>
            {loading ? t('Analyzing...', 'جارٍ التحليل...') : t('🔬 Analyze My Results', '🔬 حلل نتائجي')}
          </button>
        </div>

        {/* ══ Results ══════════════════════════════════════════ */}
        {result && (
          <div className="lab-results-section animate-in">
            <h2>{t('Analysis Summary', 'ملخص التحليل')}</h2>
            <div className="ribbon-bar" />
            <div className="lab-summary-grid">
              <div className="lab-summary-card card">
                <div className="lab-risk-badge" style={{ background: result.color }}>
                  {lang === 'en' ? result.risk_level_label_en : result.risk_level_label_ar}
                </div>
                <div className="lab-score">
                  <span className="lab-score-num">{result.score}</span>
                  <span className="lab-score-of">/100</span>
                </div>
                <p>{t('Combined lab risk score', 'درجة خطر المختبر المجمعة')}</p>
              </div>
              <div className="lab-findings card">
                <h3>{t('Findings', 'النتائج')}</h3>
                <ul>
                  {(lang === 'ar' ? result.findings_ar : result.findings_en).map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="lab-recs card">
              <h3>{t('Recommendations', 'التوصيات')}</h3>
              <ul>
                {(lang === 'ar' ? result.recommendations_ar : result.recommendations_en).map((r, i) => (
                  <li key={i}><span className="rec-dot" style={{ background: result.color }} />{r}</li>
                ))}
              </ul>
            </div>
            <div className="lab-disclaimer-box">
              ⚕️ {lang === 'ar' ? result.disclaimer_ar : result.disclaimer_en}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
