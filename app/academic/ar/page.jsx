'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import SUSTLOGO from '@assets/images/sust_logo.png';
import Header from '@sections/Header';

// ============================================================================
// 1. EDITABLE RESEARCH DATA OBJECT (Arabic)
// ============================================================================
const RESEARCH_DATA = {
  meta: {
    title: "نظام الوقاية من الصعق الكهربائي القائم على استشعار الإنسان",
    subtitle: "تقليل خطر الصعق الكهربائي قبل حدوثه.",
    institution: "Sudan University of Science and Technology",
    institutionArabic: "جامعة السودان للعلوم والتكنولوجيا",
    college: "كلية الهندسة",
    department: "قسم الهندسة الإلكترونية",
    degree: "بكالوريوس العلوم (مع مرتبة الشرف) في الهندسة الإلكترونية",
    academicYear: "2025 – 2026",
    status: "نموذج أولي مختبري مُتحقق منه",

    advisor: {
      title: "بإشراف",
      name: "د. محمد النور",
      role: "",
      email: ""
    },
    members: [
      { name: "محمد طارق", id: "2018-11481409", role: "تصميم العتاد والدوائر" },
      // { name: "اسم العضو 2", id: "18-05-12346", role: "الاختبار وتحليل البيانات" },
    ],

    carrierFrequency: "500 كيلو هرتز",
    avgResponseTime: "5-21 مللي ثانية",
    isolationType: "مرحل حالة صلبة (G3M-203P-4)",
    microcontroller: "ATmega328P (8-bit AVR)"
  },

  videos: [
    {
      id: "vid-1",
      title: "التجربة الجزء الأول",
      category: "حالات التلامس",
      duration: "5:07",
      videoUrl: "https://sust-motarig-research-files.s3.eu-central-003.backblazeb2.com/shock_prevention_sys_part1.mp4",
      posterUrl: "https://www.motarig.com/experiment_poster.png",
      description: "اختبار اللمس في أوضاع تلامس مختلفة.",
      metrics: { latency: "5-21 مللي ثانية", outcome: "نجح (رد فعل جيد للمس)" }
    },
    {
      id: "vid-2",
      title: "التجربة الجزء الثاني",
      category: "تفاصيل إضافية",
      duration: "4:24",
      videoUrl: "https://sust-motarig-research-files.s3.eu-central-003.backblazeb2.com/shock_prevention_sys_part2.mp4",
      posterUrl: "https://www.motarig.com/experiment_poster.png",
      description: "شرح مفصل لكيفية الوصول إلى النتائج النهائية.",
      metrics: { latency: "غير متاح", outcome: "نجح" }
    }
  ],

  images: [
    {
      id: "img-0",
      title: "التصميم النهائي للدائرة",
      figure: "الشكل 3.6",
      category: "مخططات",
      imageUrl: "https://www.motarig.com/images/circuit_design.jpg",
      caption: "المخطط النهائي للدائرة الذي تم تحويله لاحقاً إلى نموذج فعلي."
    },
  ],

  codeFiles: [
    {
      id: "code-1",
      filename: "arduino_code.hex",
      language: "cpp",
      description: "شيفرة Arduino لشريحة ATmega328P: تنعيم عينات ADC، تتبع الانجراف التكيفي، ومنطق فصل المرحل.",
      code: `const byte SENSOR_PIN = A0;     // Analog read pin for high-pass filter signal
      const byte RELAY_PIN = 13;      // Control Pin: LOW = Closed (Normal), HIGH = Open (Cutoff)
      const byte GENERATOR_PIN = 11;  // Carrier wave output (Timer 2)
      const byte STAGE_PIN = 9;       // Input pin to advance calibration stages (INPUT_PULLUP)
      const byte ALARM_PIN = 8;       // Proximity early-warning alarm output pin
      
      // ─── ASYMMETRICAL FILTER CONFIGURATION ───
      float smoothedAmp = 0;
      const float SMOOTH_DOWN = 0.88; // Faster tracking when value drops (hand approaching)
      const float SMOOTH_UP = 0.15;   // Slower tracking when value rises (hand retreating)
      
      // ─── CALIBRATION VARIABLES & SENSITIVITY TWEAKS ───
      unsigned long baselineClosed = 0;
      unsigned long thresholdOpenIt = 0;   
      unsigned long thresholdAlarm = 0;    
      unsigned long baselineOpen = 0;
      unsigned long thresholdCloseIt = 0;  
      
      // Sensitivity percentages
      const float CUTOFF_SENSITIVITY = 0.055; 
      const float ALARM_SENSITIVITY = 0.025;  
      const float RECONNECT_SENSITIVITY = 0.025;  
      
      // Dynamic Adaptive Drift 
      const float DRIFT_SLOW_PCT = 0.003;        // 0.3% small drift threshold
      const float DRIFT_FAST_PCT = 0.030;        // 3.0% large drift threshold
      
      // Drift Variables when Circuit Closed 
      const unsigned long CLOSED_DRIFT_SLOW_TIME = 500;   // 500ms for small drift when closed
      const unsigned long CLOSED_DRIFT_FAST_TIME = 2000;  // 2000ms (2s) for big drift (< cutoff) when closed
      
      // Drift Variables when Circuit Opened
      const unsigned long OPEN_DRIFT_SLOW_TIME   = 1000;  // 1000ms (1s) for small drift when open
      const unsigned long OPEN_DRIFT_FAST_TIME   = 30000; // 30000ms (30s) for big drift when open
      
      // Dynamic drift tracking timers
      unsigned long slowDriftStartTime = 0;
      unsigned long fastDriftStartTime = 0;
      float currentDriftRatio = 1.0;             
      
      bool circuitIsClosed = true;        
      unsigned long lastSerialTime = 0;
      
      // RECONNECT TIMER VARIABLES 
      unsigned long clearStartTime = 0;
      const unsigned long RECONNECT_DELAY = 3000; // 3000ms = 3 seconds
      
      int absMax = 0;
      int absMin = 1023;
      
      // Helper function to recalculate closed state thresholds 
      void updateClosedThresholds(unsigned long newBase) {
          baselineClosed = (SMOOTH_DOWN * newBase) + ((1.0 - SMOOTH_DOWN) * newBase);
          thresholdAlarm = baselineClosed - (baselineClosed * ALARM_SENSITIVITY);
          thresholdOpenIt = baselineClosed - (baselineClosed * CUTOFF_SENSITIVITY);
      }
      
      // Helper function to recalculate open state thresholds
      void updateOpenThresholds(unsigned long newBase) {
          baselineOpen = newBase;
          thresholdCloseIt = baselineOpen - (baselineOpen * RECONNECT_SENSITIVITY);
      }
      
      // Wait a bit for calibration
      void waitForStageAdvance() {
          while (digitalRead(STAGE_PIN) == HIGH) {
              delay(1); 
          }
          delay(50); // Debounce
          
          while (digitalRead(STAGE_PIN) == LOW) {
              delay(1);
          }
          delay(50); // Debounce
      }
      
      void setup() {
          pinMode(RELAY_PIN, OUTPUT);
          digitalWrite(RELAY_PIN, LOW); // Inverted logic: LOW = CLOSED (Normal operation)
          circuitIsClosed = true;
      
          pinMode(ALARM_PIN, OUTPUT);
          digitalWrite(ALARM_PIN, LOW); // Initialize alarm to OFF
      
          pinMode(GENERATOR_PIN, OUTPUT);
          pinMode(STAGE_PIN, INPUT_PULLUP); 
      
          // TIMER 2 SQUARE WAVE GENERATION
          TCCR2A = _BV(COM2A0) | _BV(WGM21); 
          TCCR2B = _BV(CS20); // No prescaling (N=1)
          OCR2A = 7;          // 1MHz square signal
      
          Serial.begin(115200);
      
          // Overclock ADC prescaler to 32 for fast loop cycles
          ADCSRA = (ADCSRA & 0xF8) | 0x05;
      
          delay(800); 
          Serial.println(F("\\n============================================="));
          Serial.println(F("     ASYMMETRICAL SENSOR SYSTEM CALIBRATION   "));
          Serial.println(F("============================================="));
          
          // STAGE 1: LIVE CLOSED-STATE CALIBRATION 
          Serial.println(F("\\n[STAGE 1] Calibrating CLOSED State (Relay is ON/LOW)..."));
          Serial.println(F("-> Leave hands clear or mimic normal running noise."));
          Serial.println(F("-> Ground Pin 9 to lock baselines and proceed."));
          
          int calMinClosed = 1023;
          int calMaxClosed = 0;
          unsigned long localSerialTime = 0;
          unsigned long autoCalibration = millis();
          unsigned long autoCalibrationTime = 2000;
      
          while (digitalRead(STAGE_PIN) == HIGH && millis() - autoCalibration < autoCalibrationTime) {
              int sample = analogRead(SENSOR_PIN);
              if (sample < calMinClosed) calMinClosed = sample;
              if (sample > calMaxClosed) calMaxClosed = sample;
              
              if (millis() - localSerialTime >= 150) {
                  localSerialTime = millis();
                  Serial.print(F("Live ADC: ")); Serial.print(sample);
                  Serial.print(F(" | Min: ")); Serial.print(calMinClosed);
                  Serial.print(F(" | Max: ")); Serial.println(calMaxClosed);
              }
          }
          
          unsigned long openxvalue = (calMaxClosed + calMinClosed) / 2;
          updateClosedThresholds(openxvalue);
          
          Serial.println(F(">> STAGE 1 LOCKED. Release Pin 9 wire..."));
          // waitForStageAdvance(); 
      
          // STAGE 2: LIVE OPEN-STATE CALIBRATION 
          digitalWrite(RELAY_PIN, HIGH); // Open the relay circuit
          delay(1000);                    // Let power rail voltage stabilize
          
          Serial.println(F("\\n[STAGE 2] Calibrating OPEN State (Relay is OFF/HIGH)..."));
          Serial.println(F("-> Ground Pin 9 when finished tracking open-state noise."));
          
          int calMinOpen = 1023;
          int calMaxOpen = 0;
          localSerialTime = 0;
          autoCalibration = millis();
      
          while (digitalRead(STAGE_PIN) == HIGH && millis() - autoCalibration < autoCalibrationTime) {
              int sample = analogRead(SENSOR_PIN);
              if (sample < calMinOpen) calMinOpen = sample;
              if (sample > calMaxOpen) calMaxOpen = sample;
              
              if (millis() - localSerialTime >= 150) {
                  localSerialTime = millis();
                  Serial.print(F("Live Sag ADC: ")); Serial.print(sample);
                  Serial.print(F(" | Min: ")); Serial.print(calMinOpen);
                  Serial.print(F(" | Max: ")); Serial.println(calMaxOpen);
              }
          }
          
          unsigned long closexvalue = (calMinOpen + calMaxOpen) / 2;
          updateOpenThresholds(closexvalue);
          
          Serial.println(F(">> STAGE 2 LOCKED. Release Pin 9 wire..."));
          // waitForStageAdvance(); 
      
          // RESUME NORMAL RUNTIME OPERATION
          digitalWrite(RELAY_PIN, LOW); // Re-close the relay to start safe
          circuitIsClosed = true;
          smoothedAmp = baselineClosed; 
          delay(1000);
      
          Serial.println(F("\\n--- CALIBRATION PROFILES SET ---"));
          Serial.print(F("Closed Base: ")); Serial.print(baselineClosed); 
          Serial.print(F(" | Alarm At: ")); Serial.print(thresholdAlarm);
          Serial.print(F(" | Cutoff At: ")); Serial.println(thresholdOpenIt);
          Serial.print(F("Open Base:   ")); Serial.print(baselineOpen);   
          Serial.print(F(" | Reconnect At: ")); Serial.println(thresholdCloseIt);
          Serial.println(F("================================\\n"));
      
          delay(1500);
      
          absMax = 0;
          absMin = 1023;
      }
      
      // Function to calculate Peak-to-Peak amplitude while discarding rogue spikes
      int readCleanRawAmp(byte pin) {
          const int SAMPLE_COUNT = 64;
          int samples[SAMPLE_COUNT];
          long sum = 0;
      
          for (int i = 0; i < SAMPLE_COUNT; i++) {
              samples[i] = analogRead(pin);
              sum += samples[i];
          }
          float roughMean = (float)sum / SAMPLE_COUNT;
      
          float weightedSum = 0;
          float totalWeight = 0;
          const float k = 2.5; 
      
          for (int i = 0; i < SAMPLE_COUNT; i++) {
              float distance = (samples[i] - roughMean) / k;
              float weight = 1.0 / (1.0 + (distance * distance));
              
              weightedSum += samples[i] * weight;
              totalWeight += weight;
          }
      
          return (int)(weightedSum / totalWeight);
      }
      
      void loop() {
          int rawAmp = readCleanRawAmp(SENSOR_PIN);
      
          // 1. Asymmetrical Filtering Processing
          if (rawAmp < smoothedAmp) {
              smoothedAmp = (SMOOTH_DOWN * rawAmp) + ((1.0 - SMOOTH_DOWN) * smoothedAmp);
          } else {
              smoothedAmp = (SMOOTH_UP * rawAmp) + ((1.0 - SMOOTH_UP) * smoothedAmp);
          }
      
          // 2. Active State Baseline Drift Analysis
          unsigned long activeBase = circuitIsClosed ? baselineClosed : baselineOpen;
          if (activeBase > 0) {
              currentDriftRatio = smoothedAmp / (float)activeBase;
          } else {
              currentDriftRatio = 1.0;
          }
      
          float absDriftDev = fabs(currentDriftRatio - 1.0); // Absolute drift percentage from 1.000
      
          // Select state-specific target delay values
          unsigned long targetSlowTime = circuitIsClosed ? CLOSED_DRIFT_SLOW_TIME : OPEN_DRIFT_SLOW_TIME;
          unsigned long targetFastTime = circuitIsClosed ? CLOSED_DRIFT_FAST_TIME : OPEN_DRIFT_FAST_TIME;
      
          // Check if within safe limits to drift (does NOT trigger cutoff in CLOSED, or reconnect in OPEN)
          bool withinSafeLimits = circuitIsClosed ? (smoothedAmp >= thresholdOpenIt) : (smoothedAmp <= thresholdCloseIt);
      
          if (withinSafeLimits) {
              // SMALL/SLOW DRIFT (0.1% to 3.0%)
              if (absDriftDev >= DRIFT_SLOW_PCT && absDriftDev < DRIFT_FAST_PCT) {
                  fastDriftStartTime = 0; // Cancel fast/large drift counter
                  
                  if (slowDriftStartTime == 0) {
                      slowDriftStartTime = millis();
                  } else if (millis() - slowDriftStartTime >= targetSlowTime) {
                      // Adapt baseline and recalculate thresholds for active state
                      unsigned long newBase = (unsigned long)(smoothedAmp + 0.5);
                      if (circuitIsClosed) {
                          updateClosedThresholds(newBase);
                      } else {
                          updateOpenThresholds(newBase);
                      }
                      slowDriftStartTime = 0;
                  }
              } 
              // LARGE/FAST DRIFT (>= 3.0%)
              else if (absDriftDev >= DRIFT_FAST_PCT) {
                  slowDriftStartTime = 0; // Cancel small drift counter
                  
                  if (fastDriftStartTime == 0) {
                      fastDriftStartTime = millis();
                  } else if (millis() - fastDriftStartTime >= targetFastTime) {
                      // Signal sustained at shifted level -> accept as new base
                      unsigned long newBase = (unsigned long)(smoothedAmp + 0.5);
                      if (circuitIsClosed) {
                          updateClosedThresholds(newBase);
                      } else {
                          updateOpenThresholds(newBase);
                      }
                      fastDriftStartTime = 0;
                  }
              } 
              else {
                  // Signal is stable around baseline (< 0.1% drift) -> reset timers
                  slowDriftStartTime = 0;
                  fastDriftStartTime = 0;
              }
          } else {
              // Cutoff or reconnect limit reached -> pause drift tracking
              slowDriftStartTime = 0;
              fastDriftStartTime = 0;
          }
      
          // 3. Dual-State System Control Machine
          if (circuitIsClosed) {
              // CIRCUIT CLOSED MODE (Normal Working State) 
              
              // Handle Early Warning Proximity Alarm
              if (smoothedAmp < thresholdAlarm) {
                  digitalWrite(ALARM_PIN, HIGH);
              } else {
                  digitalWrite(ALARM_PIN, LOW);
              }
      
              // Handle Main Safety Trip 
              if (smoothedAmp < thresholdOpenIt) {
                  circuitIsClosed = false;
                  digitalWrite(RELAY_PIN, HIGH); // HIGH opens relay
                  digitalWrite(ALARM_PIN, LOW);
                  smoothedAmp = baselineOpen;
                  clearStartTime = 0;
                  slowDriftStartTime = 0;
                  fastDriftStartTime = 0;
                  absMax = 0;
                  absMin = 1023;
              }
          } 
          else {
              // CIRCUIT OPEN MODE (Tripped/Safe State)
              digitalWrite(ALARM_PIN, LOW);
      
              if (smoothedAmp > thresholdCloseIt) {
                  if (clearStartTime == 0) {
                      clearStartTime = millis();
                  }
      
                  if (millis() - clearStartTime >= RECONNECT_DELAY) {
                      circuitIsClosed = true;
                      digitalWrite(RELAY_PIN, LOW); // LOW closes relay
                      smoothedAmp = baselineClosed;
                      clearStartTime = 0;
                      slowDriftStartTime = 0;
                      fastDriftStartTime = 0;
                      absMax = 0;
                      absMin = 1023;
                  }
              } 
              else {
                  clearStartTime = 0;
              }
          }
      
          // 4. Formatted Telemetry Reporting (Every 120ms)
          if (millis() - lastSerialTime >= 120) {
              lastSerialTime = millis();
      
              unsigned long activeTarget = circuitIsClosed ? thresholdOpenIt : thresholdCloseIt;
      
              Serial.print(F("R_Min: "));         Serial.print(absMin);
              Serial.print(F(" | R_Max: "));      Serial.print(absMax);
              Serial.print(F(" | Smooth: "));     Serial.print(smoothedAmp, 1);
              Serial.print(F(" | DriftRatio: ")); Serial.print(currentDriftRatio, 3);
              Serial.print(F(" | TargetThresh: ")); Serial.print(activeTarget);
              Serial.print(F(" | ALARM: "));      Serial.print(thresholdAlarm);
              
              // Reconnect Timer Telemetry
              Serial.print(F(" | Timer: "));
              if (!circuitIsClosed && clearStartTime > 0) {
                  float secondsLeft = (RECONNECT_DELAY - (millis() - clearStartTime)) / 1000.0;
                  Serial.print(secondsLeft, 1); Serial.print(F("s"));
              } else if (!circuitIsClosed) {
                  Serial.print(F("Hand Near"));
              } else {
                  Serial.print(F("OFF"));
              }
      
              Serial.print(F(" | State: "));      Serial.println(circuitIsClosed ? F("CLOSED") : F("OPEN"));
          }
      }`
    }
  ],

  downloads: [
    { name: "ملف المشروع كامل", size: "4.5 MB", type: "مستند", link: "http://www.motarig.com/files/human_aware_shock_prevention_sys.pdf" },
    { name: "الكود المصدري", size: "45.2 KB", type: "مستند", link: "http://www.motarig.com/files/source_code.pdf" },
    { name: "فيديو التجربة - الجزء الأول", size: "143 MB", type: "فيديو", link: "https://sust-motarig-research-files.s3.eu-central-003.backblazeb2.com/shock_prevention_sys_part1.mp4" },
    { name: "فيديو التجربة - الجزء الثاني", size: "84.4 MB", type: "فيديو", link: "https://sust-motarig-research-files.s3.eu-central-003.backblazeb2.com/shock_prevention_sys_part2.mp4" },
  ]
};

// ============================================================================
// 2. SUST LOGO COMPONENT
// ============================================================================
function SustLogo({ size = 52 }) {
  return (
    <Image src={SUSTLOGO} alt='شعار جامعة السودان للعلوم والتكنولوجيا' 
      width={size} height={size}/>
  );
}

// ============================================================================
// 3. LIGHT MODE STYLES (same structure, RTL-friendly where needed)
// ============================================================================
const LIGHT_STYLES = {
  container: {
    width: '100%',
    minWidth: 0,
    minHeight: '100vh',
    backgroundColor: '#F8FAFC',
    color: '#0F172A',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans Arabic", sans-serif',
    paddingBottom: '3rem',
    boxSizing: 'border-box',
    direction: 'rtl'
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E2E8F0',
    position: 'sticky',
    top: 0,
    zIndex: 40,
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
  },
  headerInner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1.25rem 1.5rem',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1.25rem'
  },
  brandingBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  },
  instEnglish: {
    fontSize: '0.875rem',
    fontWeight: 700,
    color: '#1E3A8A',
    letterSpacing: '-0.01em',
    margin: 0
  },
  instArabic: {
    fontSize: '0.9375rem',
    fontWeight: 700,
    color: '#0284C7',
    margin: '0.1rem 0 0 0'
  },
  deptText: {
    fontSize: '0.75rem',
    color: '#64748B',
    margin: '0.2rem 0 0 0'
  },
  badge: {
    padding: '0.35rem 0.85rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: 600,
    backgroundColor: '#F0FDF4',
    color: '#166534',
    border: '1px solid #BBF7D0',
    boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
  },
  tabsRow: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0.25rem 1.5rem 0 1.5rem',
    display: 'flex',
    gap: '0.5rem',
    overflowX: 'auto',
    borderTop: '1px solid #F1F5F9'
  },
  tabBtn: (isActive) => ({
    padding: '0.65rem 1.1rem',
    fontSize: '0.8125rem',
    fontWeight: isActive ? 600 : 500,
    borderRadius: '0.5rem 0.5rem 0 0',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: isActive ? '#F8FAFC' : 'transparent',
    color: isActive ? '#1E3A8A' : '#64748B',
    borderBottom: isActive ? '3px solid #1E3A8A' : '3px solid transparent',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap'
  }),
  main: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1.5rem',
    boxSizing: 'border-box',
    minWidth: 0
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '0.875rem',
    padding: '1.75rem',
    marginBottom: '2rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
    borderRight: '5px solid #1E3A8A'
  },
  heroTitle: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#0F172A',
    margin: '0 0 0.5rem 0',
    lineHeight: 1.35
  },
  heroSub: {
    fontSize: '0.875rem',
    color: '#475569',
    margin: 0
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem'
  },
  metricCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    padding: '1.25rem',
    borderRadius: '0.75rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
  },
  metricLabel: {
    fontSize: '0.75rem',
    color: '#64748B',
    fontWeight: 600,
    letterSpacing: '0.025em',
    display: 'block'
  },
  metricVal: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#1E3A8A',
    marginTop: '0.35rem',
    display: 'block'
  },
  metricSub: {
    fontSize: '0.75rem',
    color: '#0284C7',
    marginTop: '0.25rem',
    display: 'block',
    fontWeight: 500
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.5rem'
  },
  card: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '0.875rem',
    padding: '1.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
  },
  cardTitle: {
    fontSize: '1.05rem',
    fontWeight: 700,
    color: '#0F172A',
    marginTop: 0,
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  text: {
    fontSize: '0.875rem',
    color: '#334155',
    lineHeight: 1.8,
    margin: '0 0 1rem 0',
    textAlign: 'justify'
  },
  personCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem',
    backgroundColor: '#F8FAFC',
    borderRadius: '0.5rem',
    border: '1px solid #E2E8F0',
    marginBottom: '0.5rem'
  },
  avatarCircle: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    backgroundColor: '#DBEAFE',
    color: '#1E3A8A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '0.875rem',
    flexShrink: 0
  },
  btnPrimary: {
    display: 'inline-block',
    width: '100%',
    padding: '0.75rem 1rem',
    backgroundColor: '#1E3A8A',
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 600,
    fontSize: '0.875rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    marginTop: '1rem',
    boxShadow: '0 2px 4px rgba(30, 58, 138, 0.2)',
    boxSizing: 'border-box'
  },
  videoPlayerContainer: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '1rem',
    padding: '1.25rem',
    marginBottom: '2rem',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
  },
  videoWrapper: {
    width: '100%',
    aspectRatio: '16/9',
    backgroundColor: '#0F172A',
    borderRadius: '0.75rem',
    overflow: 'hidden'
  },
  videoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '1rem'
  },
  videoCard: (isSelected) => ({
    backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
    border: isSelected ? '2px solid #2563EB' : '1px solid #E2E8F0',
    borderRadius: '0.75rem',
    padding: '0.75rem',
    cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
  }),
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.25rem'
  },
  imageCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '0.75rem',
    overflow: 'hidden',
    cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
  },
  figureBadge: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    color: '#1E3A8A',
    fontSize: '0.6875rem',
    fontWeight: 700,
    padding: '0.2rem 0.525rem',
    borderRadius: '0.25rem',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    fontFamily: 'monospace'
  },
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    backdropFilter: 'blur(4px)',
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem'
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: '1rem',
    maxWidth: '800px',
    width: '100%',
    overflow: 'hidden',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
  },
  codeContainer: {
    backgroundColor: '#0F172A',
    border: '1px solid #1E293B',
    borderRadius: '0.875rem',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    direction: 'ltr'
  },
  codeHeader: {
    backgroundColor: '#1E293B',
    padding: '0.75rem 1.25rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  downloadGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1rem'
  },
  downloadCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '0.75rem',
    padding: '1.25rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
  }
};

// ============================================================================
// 4. RESPONSIVE CSS — desktop, tablet, mobile and very small watch screens
// ============================================================================
const RESPONSIVE_CSS = `
  .research-page,
  .research-page * {
    box-sizing: border-box;
  }

  .research-page {
    width: 100%;
    min-width: 0;
    max-width: 100vw;
    overflow-x: hidden;
  }

  .research-page img,
  .research-page video {
    max-width: 100%;
  }

  .research-header-inner,
  .research-branding,
  .research-header-actions,
  .research-tabs,
  .research-main,
  .research-content-grid > *,
  .research-metrics > *,
  .research-video-grid > *,
  .research-image-grid > *,
  .research-download-grid > *,
  .research-person-card {
    min-width: 0;
  }

  .research-header-inner {
    width: 100%;
  }

  .research-branding {
    flex: 1 1 520px;
  }

  .research-header-actions {
    flex: 0 1 auto;
    max-width: 100%;
  }

  .research-header-actions > div {
    max-width: 100%;
  }

  .research-tabs {
    scrollbar-width: thin;
    -webkit-overflow-scrolling: touch;
  }

  .research-tabs::-webkit-scrollbar {
    height: 4px;
  }

  .research-main {
    width: 100%;
  }

  .research-content-grid,
  .research-metrics,
  .research-video-grid,
  .research-image-grid,
  .research-download-grid {
    width: 100%;
    min-width: 0;
  }

  .research-content-grid > *,
  .research-metrics > *,
  .research-video-grid > *,
  .research-image-grid > *,
  .research-download-grid > * {
    min-width: 0;
    max-width: 100%;
  }

  .research-page p,
  .research-page h1,
  .research-page h2,
  .research-page h3,
  .research-page h4,
  .research-page span {
    overflow-wrap: anywhere;
  }

  .research-video-metrics {
    min-width: 0 !important;
    max-width: 100%;
    flex: 0 1 auto;
  }

  .research-code-scroll {
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
  }

  .research-code-scroll pre {
    width: max-content;
    min-width: 100%;
  }

  .research-modal-content {
    max-width: min(800px, 100%);
    max-height: calc(100vh - 2rem);
    overflow: auto;
  }

  .research-modal-image {
    max-width: 100%;
    max-height: 60vh;
  }

  @media (max-width: 900px) {
    .research-header-inner {
      padding: 1rem;
      gap: 0.9rem;
    }

    .research-main {
      padding: 1.35rem 1rem;
    }

    .research-content-grid {
      grid-template-columns: minmax(0, 1fr) !important;
    }

    .research-content-grid > * {
      grid-column: auto !important;
    }

    .research-metrics {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }

    .research-video-grid,
    .research-image-grid,
    .research-download-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    }
  }

  @media (max-width: 640px) {
    .research-header-inner {
      flex-direction: column;
      align-items: stretch;
      padding: 0.75rem;
      gap: 0.7rem;
    }

    .research-branding {
      width: 100%;
      flex: none;
      gap: 0.7rem;
    }

    .research-branding img {
      width: 44px !important;
      height: 44px !important;
      flex: 0 0 44px;
    }

    .research-header-actions {
      width: 100%;
      flex: none;
      align-items: stretch !important;
    }

    .research-header-actions > div {
      width: 100%;
      flex-wrap: wrap;
      align-items: center;
    }

    .research-tabs {
      padding: 0.15rem 0.65rem 0;
      gap: 0.25rem;
    }

    .research-main {
      padding: 1rem 0.65rem;
    }

    .research-hero {
      padding: 1.1rem !important;
      margin-bottom: 1.1rem !important;
    }

    .research-metrics,
    .research-video-grid,
    .research-image-grid,
    .research-download-grid {
      grid-template-columns: minmax(0, 1fr) !important;
    }

    .research-metric-card,
    .research-card {
      padding: 1rem !important;
    }

    .research-video-player {
      padding: 0.75rem !important;
      margin-bottom: 1.1rem !important;
    }

    .research-video-info {
      flex-direction: column;
      align-items: stretch !important;
    }

    .research-video-metrics {
      width: 100%;
    }

    .research-image-preview {
      height: auto !important;
      aspect-ratio: 16 / 10;
    }

    .research-download-card {
      flex-direction: column;
      align-items: stretch !important;
      gap: 0.75rem;
    }

    .research-download-card > button {
      width: 100%;
    }

    .research-code-header {
      flex-wrap: wrap;
      gap: 0.6rem;
      align-items: flex-start !important;
    }

    .research-code-header > div:first-child {
      min-width: 0;
      max-width: 100%;
    }

    .research-code-description {
      overflow-wrap: anywhere;
      line-height: 1.6;
    }

    .research-code-scroll {
      padding: 0.7rem !important;
      font-size: 0.72rem !important;
    }

    .research-code-scroll span {
      font-size: 0.68rem !important;
    }

    .research-modal-backdrop {
      padding: 0.5rem !important;
    }

    .research-modal-content {
      border-radius: 0.7rem !important;
      max-height: calc(100vh - 1rem);
    }

    .research-modal-image {
      max-height: 50vh;
    }
  }

  @media (max-width: 480px) {
    .research-branding {
      align-items: flex-start;
    }

    .research-branding img {
      width: 38px !important;
      height: 38px !important;
      flex-basis: 38px;
    }

    .research-branding h1 {
      font-size: 0.78rem !important;
      line-height: 1.35;
    }

    .research-branding h2 {
      font-size: 0.7rem !important;
      line-height: 1.35;
    }

    .research-branding p {
      font-size: 0.62rem !important;
      line-height: 1.4;
    }

    .research-header-actions > div {
      gap: 0.35rem !important;
    }

    .research-header-actions span,
    .research-header-actions a {
      font-size: 0.62rem !important;
    }

    .research-header-actions a {
      padding: 0.3rem 0.55rem !important;
    }

    .research-tabs button {
      padding: 0.5rem 0.65rem !important;
      font-size: 0.68rem !important;
    }

    .research-main {
      padding: 0.7rem 0.4rem;
    }

    .research-hero {
      padding: 0.8rem !important;
      border-right-width: 3px !important;
      border-radius: 0.65rem !important;
    }

    .research-hero > span {
      font-size: 0.62rem !important;
    }

    .research-hero h1 {
      font-size: 1rem !important;
      line-height: 1.45;
    }

    .research-hero p {
      font-size: 0.7rem !important;
      line-height: 1.55;
    }

    .research-metric-card,
    .research-card {
      padding: 0.75rem !important;
      border-radius: 0.65rem !important;
    }

    .research-metric-card span {
      font-size: 0.68rem !important;
    }

    .research-metric-card span:nth-child(2) {
      font-size: 1.05rem !important;
    }

    .research-card h2,
    .research-card h3 {
      font-size: 0.9rem !important;
    }

    .research-card p {
      font-size: 0.7rem !important;
      line-height: 1.7;
      text-align: right !important;
    }

    .research-person-card {
      padding: 0.55rem !important;
      gap: 0.5rem !important;
      align-items: flex-start !important;
    }

    .research-person-card .research-avatar {
      width: 32px !important;
      height: 32px !important;
      font-size: 0.72rem !important;
    }

    .research-person-card p,
    .research-person-card h4,
    .research-person-card span {
      font-size: 0.65rem !important;
      line-height: 1.5;
    }

    .research-video-player {
      padding: 0.5rem !important;
      border-radius: 0.7rem !important;
    }

    .research-video-info h2 {
      font-size: 0.9rem !important;
    }

    .research-video-info p,
    .research-video-info span,
    .research-video-metrics div {
      font-size: 0.65rem !important;
      line-height: 1.55;
    }

    .research-video-metrics {
      padding: 0.6rem !important;
    }

    .research-image-preview {
      aspect-ratio: 4 / 3;
    }

    .research-image-card > div:last-child {
      padding: 0.65rem !important;
    }

    .research-image-card h3 {
      font-size: 0.7rem !important;
    }

    .research-image-card p {
      font-size: 0.64rem !important;
    }

    .research-code-toolbar button {
      font-size: 0.62rem !important;
      padding: 0.35rem 0.55rem !important;
      max-width: 100%;
    }

    .research-code-header {
      padding: 0.55rem 0.65rem !important;
    }

    .research-code-header > button {
      width: 100%;
    }

    .research-code-description {
      padding: 0.6rem 0.65rem !important;
      font-size: 0.64rem !important;
    }

    .research-code-scroll {
      padding: 0.55rem !important;
      font-size: 0.65rem !important;
      line-height: 1.5 !important;
    }

    .research-download-card {
      padding: 0.75rem !important;
    }

    .research-download-card h3 {
      font-size: 0.7rem !important;
    }

    .research-download-card span,
    .research-download-card button {
      font-size: 0.63rem !important;
    }

    .research-page footer {
      margin-top: 2rem !important;
      padding: 1rem 0.5rem 0 !important;
      font-size: 0.62rem !important;
    }
  }

  @media (max-width: 360px) {
    .research-header-inner {
      padding: 0.55rem;
    }

    .research-branding {
      gap: 0.5rem;
    }

    .research-branding img {
      width: 32px !important;
      height: 32px !important;
      flex-basis: 32px;
    }

    .research-branding h1 {
      font-size: 0.68rem !important;
    }

    .research-branding h2 {
      font-size: 0.61rem !important;
    }

    .research-branding p {
      font-size: 0.55rem !important;
    }

    .research-tabs {
      padding-left: 0.35rem;
      padding-right: 0.35rem;
    }

    .research-tabs button {
      padding: 0.42rem 0.5rem !important;
      font-size: 0.6rem !important;
    }

    .research-main {
      padding: 0.5rem 0.3rem;
    }

    .research-hero {
      padding: 0.65rem !important;
    }

    .research-hero h1 {
      font-size: 0.88rem !important;
    }

    .research-card p {
      font-size: 0.66rem !important;
    }

    .research-metric-card span:nth-child(2) {
      font-size: 0.95rem !important;
    }

    .research-code-scroll {
      font-size: 0.6rem !important;
    }

    .research-code-scroll span {
      font-size: 0.57rem !important;
    }
  }

  @media (max-width: 260px) {
    .research-header-actions > div {
      flex-direction: column;
      align-items: stretch !important;
    }

    .research-header-actions a,
    .research-header-actions span {
      width: 100%;
      text-align: center;
    }

    .research-main {
      padding: 0.35rem 0.2rem;
    }

    .research-hero,
    .research-card,
    .research-metric-card,
    .research-video-player,
    .research-download-card {
      padding: 0.5rem !important;
    }

    .research-hero h1 {
      font-size: 0.8rem !important;
    }

    .research-hero p,
    .research-card p {
      font-size: 0.6rem !important;
    }

    .research-tabs button {
      font-size: 0.55rem !important;
      padding: 0.35rem 0.42rem !important;
    }

    .research-code-scroll {
      font-size: 0.55rem !important;
      padding: 0.4rem !important;
    }
  }
`;


// ============================================================================
// 5. MAIN REACT COMPONENT (Arabic)
// ============================================================================
export default function ResearchShowcaseAr() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedVideo, setSelectedVideo] = useState(RESEARCH_DATA.videos[0]);
  const [selectedCodeIndex, setSelectedCodeIndex] = useState(0);
  const [activeImageModal, setActiveImageModal] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = (codeText) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownload = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || url.split('/').pop() || 'download';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <style jsx global>{RESPONSIVE_CSS}</style>
      <div className="research-page" style={LIGHT_STYLES.container}>
      {/* Header */}
      <Header isArabic/>
      <header style={LIGHT_STYLES.header}>
        <div className="research-header-inner" style={LIGHT_STYLES.headerInner}>
          <div className="research-branding" style={LIGHT_STYLES.brandingBox}>
            <SustLogo size={54} />
            <div>
              <h1 style={LIGHT_STYLES.instArabic}>{RESEARCH_DATA.meta.institutionArabic}</h1>
              <h2 style={LIGHT_STYLES.instEnglish}>{RESEARCH_DATA.meta.institution}</h2>
              <p style={LIGHT_STYLES.deptText}>
                {RESEARCH_DATA.meta.college} • {RESEARCH_DATA.meta.department}
              </p>
            </div>
          </div>
          <div className="research-header-actions" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={LIGHT_STYLES.badge}>{RESEARCH_DATA.meta.status}</span>
              <a
                href="/academic/en"
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: '#EFF6FF',
                  color: '#1E3A8A',
                  border: '1px solid #BFDBFE',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                English / EN
              </a>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>
              العام الدراسي: {RESEARCH_DATA.meta.academicYear}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="research-tabs" style={LIGHT_STYLES.tabsRow}>
          {[
            { id: 'overview', label: 'نظرة عامة والفريق' },
            { id: 'videos', label: 'فيديوهات التجارب' },
            { id: 'gallery', label: 'معرض الصور' },
            { id: 'code', label: 'الكود المصدري' },
            { id: 'downloads', label: 'التنزيلات' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={LIGHT_STYLES.tabBtn(activeTab === tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="research-main" style={LIGHT_STYLES.main}>

        {/* Hero */}
        <div className="research-hero" style={LIGHT_STYLES.heroCard}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284C7', letterSpacing: '0.05em' }}>
            {RESEARCH_DATA.meta.degree}
          </span>
          <h1 style={LIGHT_STYLES.heroTitle}>{RESEARCH_DATA.meta.title}</h1>
          <p style={LIGHT_STYLES.heroSub}>{RESEARCH_DATA.meta.subtitle}</p>
        </div>

        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div>
            <div className="research-metrics" style={LIGHT_STYLES.metricsGrid}>
              {[
                { label: "تردد الاشارة", value: RESEARCH_DATA.meta.carrierFrequency, sub: "مع فلتر تمرير عالي" },
                { label: "متوسط زمن الاستجابة", value: RESEARCH_DATA.meta.avgResponseTime, sub: "من الاستشعار إلى الفصل" },
                { label: "جهاز العزل", value: "SSR", sub: "عزل ضوئي" },
                { label: "المعالج", value: RESEARCH_DATA.meta.microcontroller, sub: "معالج AVR 8 بت" }
              ].map((m, idx) => (
                <div key={idx} className="research-metric-card" style={LIGHT_STYLES.metricCard}>
                  <span style={LIGHT_STYLES.metricLabel}>{m.label}</span>
                  <span style={LIGHT_STYLES.metricVal}>{m.value}</span>
                  <span style={LIGHT_STYLES.metricSub}>{m.sub}</span>
                </div>
              ))}
            </div>

            <div className="research-content-grid" style={LIGHT_STYLES.contentGrid}>
              <div className="research-card" style={{ ...LIGHT_STYLES.card, gridColumn: 'span 2' }}>
                <h2 style={LIGHT_STYLES.cardTitle}>مستخلص البحث ومبدأ العمل</h2>
                <p style={LIGHT_STYLES.text}>
                  يقدم هذا البحث تصميم وتقييم نظام للوقاية من الصعق الكهربائي يعتمد على استشعار وجود الإنسان، بحيث يكتشف اقتراب الشخص أو ملامسته لموصل مكهرب ويعزل الدائرة قبل أن يستمر التيار الضار. يعالج العمل قصوراً في أجهزة الحماية التقليدية مثل أجهزة التيار المتبقي، التي تستجيب عادة بعد حدوث العطل أو التسرب. يجمع النهج المقترح بين الاستشعار السعوي للقرب والعزل الإلكتروني السريع ومنطق قرار تكيفي. يُركَّب حامل منخفض الجهد بتردد 500 كيلو هرتز على تغذية محاكاة 220 فولت / 50 هرتز، ويُكشف التغير الناتج عن الاقتران السعوي لجسم الإنسان عبر مرحلتين من الترشيح عالي التمرير والتثبيت. يقرأ متحكم ATmega328P الإشارة المصفاة، يحدد خط الأساس الأولي، يتتبع الانجراف البيئي البطيء، ويستخدم عتبة تكيفية مع خرج مُثبَّت للتمييز بين حدث اقتراب أو تلامس حقيقي والتغيرات العادية. يوفر مرحل الحالة الصلبة مرحلة العزل. طُوِّر النظام بمنهجية المحاكاة أولاً في Proteus VSM، ثم جُمِّع واختُبر كنموذج أولي مختبري. شملت الاختبارات التشغيل بدون تلامس، والتلامس المباشر، والتلامس المستمر، والإفلات، والتلامس عبر سائل، ومحاكاة تلامس مقبس/قابس. أثبت مبدأ الاستشعار ومنطق القرار التكيفي نجاحه في هذه الحالات. ساهم البرنامج الثابت في زمن الاستشعار إلى الفصل بحوالي 5 مللي ثانية في المتوسط، بينما أضاف المرحل حوالي 1–11 مللي ثانية حسب طور التيار المتردد، ليصل الإجمالي إلى نحو 5–21 مللي ثانية بمتوسط قريب من 10.5 مللي ثانية. بذلك حققت مرحلتا الاستشعار والقرار السرعة المطلوبة بمفردهما، بينما حدّ سلوك عبور الصفر في المرحل القائم على الترياك من بقاء النظام كاملاً تحت 10 مللي ثانية باستمرار. يُظهر البحث إثبات مفهوم عملي للحماية الاستباقية المدركة للإنسان، ويحدد العزل بترانزستورات MOSFET متقابلة والمعالج الأسرع كاتجاهين رئيسيين للتحسين. أُجريت الاختبارات بجهد مخفّض عبر محول، ولا يزال التحقق عند جهد الشبكة الكامل خارج نطاق ما تم إثباته.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.25rem' }}>
                  {['نظرية التراكب', 'الاستشعار السعوي', 'مرشح غير متماثل', 'هندسة جامعة السودان'].map((t, i) => (
                    <span key={i} style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', backgroundColor: '#F1F5F9', color: '#334155', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontWeight: 500 }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="research-card" style={LIGHT_STYLES.card}>
                <h3 style={{ ...LIGHT_STYLES.cardTitle, fontSize: '1rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.5rem' }}>
                  الإشراف الأكاديمي
                </h3>
                
                <div className="research-person-card" style={{ ...LIGHT_STYLES.personCard, backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }}>
                  <div className="research-avatar" style={{ ...LIGHT_STYLES.avatarCircle, backgroundColor: '#1E3A8A', color: '#FFFFFF' }}>
                    د
                  </div>
                  <div>
                    <span style={{ fontSize: '0.6875rem', color: '#1E40AF', fontWeight: 600 }}>
                      {RESEARCH_DATA.meta.advisor.title}
                    </span>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                      {RESEARCH_DATA.meta.advisor.name}
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: '#475569', margin: 0 }}>
                      {RESEARCH_DATA.meta.advisor.role}
                    </p>
                  </div>
                </div>

                <h3 style={{ ...LIGHT_STYLES.cardTitle, fontSize: '1rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.5rem', marginTop: '1.5rem' }}>
                  فريق البحث
                </h3>

                {RESEARCH_DATA.meta.members.map((member, i) => (
                  <div key={i} style={LIGHT_STYLES.personCard}>
                    <div className="research-avatar" style={LIGHT_STYLES.avatarCircle}>
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                        {member.name}
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>
                        الرقم الجامعي: {member.id} • <span style={{ color: '#0284C7' }}>{member.role}</span>
                      </p>
                    </div>
                  </div>
                ))}

                <button onClick={() => setActiveTab('videos')} style={LIGHT_STYLES.btnPrimary}>
                  استعرض فيديوهات التجارب ←
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: VIDEOS ================= */}
        {activeTab === 'videos' && (
          <div>
            <div className="research-video-player" style={LIGHT_STYLES.videoPlayerContainer}>
              <div style={LIGHT_STYLES.videoWrapper}>
                <video key={selectedVideo.id} controls poster={selectedVideo.posterUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }}>
                  <source src={selectedVideo.videoUrl} type="video/mp4" />
                </video>
              </div>

              <div className="research-video-info" style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.6875rem', padding: '0.2rem 0.5rem', backgroundColor: '#DBEAFE', color: '#1E40AF', borderRadius: '4px', fontWeight: 600 }}>
                    {selectedVideo.category}
                  </span>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0F172A', margin: '0.4rem 0 0.25rem 0' }}>{selectedVideo.title}</h2>
                  <p style={{ fontSize: '0.8125rem', color: '#475569', margin: 0 }}>{selectedVideo.description}</p>
                </div>

                <div className="research-video-metrics" style={{ backgroundColor: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0', minWidth: '180px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>زمن الاستجابة المقاس: <strong style={{ color: '#15803D', fontFamily: 'monospace' }}>{selectedVideo.metrics.latency}</strong></div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>نتيجة التجربة: <strong style={{ color: '#0F172A' }}>{selectedVideo.metrics.outcome}</strong></div>
                </div>
              </div>
            </div>

            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#475569', marginBottom: '1rem' }}>
              اختر التجربة
            </h3>
            <div className="research-video-grid" style={LIGHT_STYLES.videoGrid}>
              {RESEARCH_DATA.videos.map((vid) => (
                <div key={vid.id} onClick={() => setSelectedVideo(vid)} style={LIGHT_STYLES.videoCard(selectedVideo.id === vid.id)}>
                  <div style={{ width: '100%', aspectRatio: '16/9', backgroundColor: '#0F172A', borderRadius: '0.5rem', overflow: 'hidden', position: 'relative', marginBottom: '0.5rem' }}>
                    <img src={vid.posterUrl} alt={vid.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: '36px', height: '36px', backgroundColor: '#1E3A8A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontSize: '0.875rem', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                        ▶
                      </div>
                    </div>
                  </div>
                  <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>{vid.title}</h4>
                  <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>{vid.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: GALLERY ================= */}
        {activeTab === 'gallery' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>المخططات والأشكال الموجية</h2>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>انقر على الشكل للتكبير</span>
            </div>

            <div className="research-image-grid" style={LIGHT_STYLES.imageGrid}>
              {RESEARCH_DATA.images.map((img) => (
                <div key={img.id} onClick={() => setActiveImageModal(img)} className="research-image-card" style={LIGHT_STYLES.imageCard}>
                  <div className="research-image-preview" style={{ width: '100%', height: '170px', backgroundColor: '#F1F5F9', position: 'relative', overflow: 'hidden' }}>
                    <img src={img.imageUrl} alt={img.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={LIGHT_STYLES.figureBadge}>{img.figure}</span>
                  </div>
                  <div style={{ padding: '0.875rem' }}>
                    <span style={{ fontSize: '0.6875rem', color: '#0284C7', fontWeight: 600, display: 'block' }}>{img.category}</span>
                    <h3 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A', margin: '0.25rem 0' }}>{img.title}</h3>
                    <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0, lineHeight: 1.4 }}>{img.caption}</p>
                  </div>
                </div>
              ))}
            </div>

            {activeImageModal && (
              <div className="research-modal-backdrop" style={LIGHT_STYLES.modalBackdrop} onClick={() => setActiveImageModal(null)}>
                <div className="research-modal-content" style={LIGHT_STYLES.modalContent} onClick={(e) => e.stopPropagation()}>
                  <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#0284C7', fontWeight: 700 }}>{activeImageModal.figure}</span>
                      <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>{activeImageModal.title}</h3>
                    </div>
                    <button onClick={() => setActiveImageModal(null)} style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '1.25rem', cursor: 'pointer' }}>✕</button>
                  </div>
                  <div style={{ backgroundColor: '#0F172A', padding: '1rem', display: 'flex', justifyContent: 'center' }}>
                    <img className="research-modal-image" src={activeImageModal.imageUrl} alt={activeImageModal.title} style={{ maxHeight: '60vh', maxWidth: '100%', objectFit: 'contain' }} />
                  </div>
                  <div style={{ padding: '1rem', fontSize: '0.8125rem', color: '#334155', backgroundColor: '#FFFFFF' }}>
                    {activeImageModal.caption}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: SOURCE CODE ================= */}
        {activeTab === 'code' && (
          <div>
            <div className="research-code-toolbar" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>الكود</h2>
                <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>اطّلع على كود البرنامج وتطبيقات الخوارزميات.</p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {RESEARCH_DATA.codeFiles.map((f, idx) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedCodeIndex(idx)}
                    style={{
                      padding: '0.4rem 0.85rem',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      borderRadius: '0.375rem',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: selectedCodeIndex === idx ? '#1E3A8A' : '#FFFFFF',
                      color: selectedCodeIndex === idx ? '#FFFFFF' : '#475569',
                      boxShadow: selectedCodeIndex === idx ? '0 2px 4px rgba(30,58,138,0.2)' : '0 1px 2px rgba(0,0,0,0.05)',
                      border: selectedCodeIndex === idx ? 'none' : '1px solid #CBD5E1'
                    }}
                  >
                    {f.filename}
                  </button>
                ))}
              </div>
            </div>

            <div style={LIGHT_STYLES.codeContainer}>
              <div className="research-code-header" style={LIGHT_STYLES.codeHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#EF4444' }}></span>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#F59E0B' }}></span>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10B981' }}></span>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#94A3B8', marginLeft: '0.5rem' }}>
                    {RESEARCH_DATA.codeFiles[selectedCodeIndex].filename}
                  </span>
                </div>
                <button
                  onClick={() => handleCopyCode(RESEARCH_DATA.codeFiles[selectedCodeIndex].code)}
                  style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', fontFamily: 'monospace', backgroundColor: '#334155', color: '#F1F5F9', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}
                >
                  {copiedCode ? '✓ تم النسخ' : 'نسخ الشيفرة'}
                </button>
              </div>

              <div className="research-code-description" style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid #1E293B', fontSize: '0.75rem', color: '#94A3B8', backgroundColor: '#0F172A' }}>
                {RESEARCH_DATA.codeFiles[selectedCodeIndex].description}
              </div>

              <div className="research-code-scroll" style={{ padding: '1.25rem', overflowX: 'auto', fontFamily: 'ui-monospace, SFMono-Regular, Monaco, Consolas, monospace', fontSize: '0.8125rem', lineHeight: '1.6', color: '#E2E8F0' }}>
                <pre style={{ margin: 0 }}>
                  <code>
                    {RESEARCH_DATA.codeFiles[selectedCodeIndex].code
                      .split('\n')
                      .map((line, i) => (
                        <div key={i} style={{ display: 'table-row' }}>
                          <span style={{ display: 'table-cell', userSelect: 'none', paddingRight: '1.25rem', color: '#475569', textAlign: 'right', fontSize: '0.75rem' }}>
                            {i + 1}
                          </span>
                          <span style={{ display: 'table-cell', whiteSpace: 'pre' }}>{line}</span>
                        </div>
                      ))}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: DOWNLOADS ================= */}
        {activeTab === 'downloads' && (
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0F172A', margin: '0 0 0.25rem 0' }}>تحميل الملفات</h2>
            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0 0 1.5rem 0' }}>ملفات المشروع، الكود المصدري، وملحقات اخرى.</p>

            <div className="research-download-grid" style={LIGHT_STYLES.downloadGrid}>
              {RESEARCH_DATA.downloads.map((item, idx) => (
                <div key={idx} className="research-download-card" style={LIGHT_STYLES.downloadCard}>
                  <div>
                    <span style={{ fontSize: '0.6875rem', color: '#0284C7', fontWeight: 700, display: 'block' }}>{item.type}</span>
                    <h3 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A', margin: '0.25rem 0' }}>{item.name}</h3>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>الحجم: {item.size}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDownload(item.link, item.name)}
                    style={{ padding: '0.5rem 0.85rem', backgroundColor: '#F1F5F9', color: '#1E3A8A', border: '1px solid #CBD5E1', borderRadius: '0.5rem', fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, cursor: 'pointer' }}
                  >
                    تحميل ↓ 
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      <footer style={{ borderTop: '1px solid #E2E8F0', marginTop: '4rem', paddingTop: '2rem', textAlign: 'center', fontSize: '0.75rem', color: '#64748B' }}>
        <p style={{ fontWeight: 700, color: '#1E3A8A', margin: 0 }}>{RESEARCH_DATA.meta.institutionArabic} ({RESEARCH_DATA.meta.institution})</p>
        <p style={{ margin: '0.25rem 0 0 0' }}>{RESEARCH_DATA.meta.college} — {RESEARCH_DATA.meta.department}</p>
        <p style={{ margin: '0.25rem 0 0 0', color: '#94A3B8' }}>مشروع تخرج بكالوريوس • {RESEARCH_DATA.meta.academicYear}</p>
      </footer>
    </div>
    </>
  );
}