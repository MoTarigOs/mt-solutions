'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import SUSTLOGO from '@assets/images/sust_logo.png';

// ============================================================================
// 1. EDITABLE RESEARCH DATA OBJECT
// Update advisor name, group members, media links, and figures here.
// ============================================================================
const RESEARCH_DATA = {
  meta: {
    title: "Human-Aware Electrical Shock Prevention System",
    subtitle: "Reducing The Risk Of Electrical Shock.",
    institution: "Sudan University of Science and Technology",
    institutionArabic: "جامعة السودان للعلوم والتكنولوجيا",
    college: "College of Engineering",
    department: "Department of Electronic Engineering",
    degree: "B.Sc. (Honours) in Electronic Engineering",
    academicYear: "2025 – 2026",
    status: "Bench Prototype Validated",

    // --- ADVISOR & GROUP MEMBERS ---
    advisor: {
      title: "Supervised by",
      name: "Dr. Mohamed Alnour", // Replace with your Advisor's name
      role: "",
      email: ""
    },
    members: [
      { name: "Mohamed Tarig", id: "2018-11481409", role: "Hardware & Circuit Design" },
      // { name: "Member 2 Name", id: "18-05-12346", role: "Testing & Data Analysis" },
      // { name: "Member 3 Name", id: "18-05-12347", role: "Testing & Data Analysis" },
      // { name: "Member 4 Name", id: "18-05-12348", role: "Testing & Data Analysis" },
      // { name: "Member 4 Name", id: "18-05-12348", role: "Testing & Data Analysis" },
    ],

    // System Specs
    carrierFrequency: "500 kHz",
    avgResponseTime: "5-21 ms",
    isolationType: "Solid-State Relay (G3M-203P-4)",
    microcontroller: "ATmega328P (8-bit AVR)"
  },

  // Video Demonstration Items
  videos: [
    {
      id: "vid-1",
      title: "Bench Experiment 1",
      category: "Contacts situations",
      duration: "5:07",
      videoUrl: "https://www.motarig.com/videos/shock_prevention_sys_part1.mp4", // Replace with your video URL
      posterUrl: "https://www.motarig.com/experiment_poster.png",
      description: "Tests touch detection with different contact situations.",
      metrics: { latency: "5-21 ms", outcome: "Pass (Capacitive Trigger)" }
    },
    {
      id: "vid-2",
      title: "Bench Experiment 2",
      category: "More Details",
      duration: "4:24",
      videoUrl: "https://www.motarig.com/videos/shock_prevention_sys_part2.mp4", // Replace with your video URL
      posterUrl: "https://www.motarig.com/experiment_poster.png",
      description: "Explain in details how we acheived the final results.",
      metrics: { latency: "N/A", outcome: "Pass" }
    }
  ],

  // Image Gallery Items
  images: [
    {
      id: "img-0",
      title: "Final Circuit Design",
      figure: "Figure 3.6",
      category: "Schematics",
      imageUrl: "http://localhost:3000/images/circuit_design.jpg",
      caption: "Circuit schematic showing the Final Design that we will turn into physical bench test."
    },
  ],

  // Source Code Snippets
  codeFiles: [
    {
      id: "code-1",
      filename: "arduino_code.hex",
      language: "cpp",
      description: "Arduino IDE Code, for ATmega328P firmware implementing ADC sample smoothing, adaptive drift tracking, and latching SSR trip logic.",
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
          Serial.println(F("\n============================================="));
          Serial.println(F("     ASYMMETRICAL SENSOR SYSTEM CALIBRATION   "));
          Serial.println(F("============================================="));
          
          // STAGE 1: LIVE CLOSED-STATE CALIBRATION 
          Serial.println(F("\n[STAGE 1] Calibrating CLOSED State (Relay is ON/LOW)..."));
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
          
          Serial.println(F("\n[STAGE 2] Calibrating OPEN State (Relay is OFF/HIGH)..."));
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
      
          Serial.println(F("\n--- CALIBRATION PROFILES SET ---"));
          Serial.print(F("Closed Base: ")); Serial.print(baselineClosed); 
          Serial.print(F(" | Alarm At: ")); Serial.print(thresholdAlarm);
          Serial.print(F(" | Cutoff At: ")); Serial.println(thresholdOpenIt);
          Serial.print(F("Open Base:   ")); Serial.print(baselineOpen);   
          Serial.print(F(" | Reconnect At: ")); Serial.println(thresholdCloseIt);
          Serial.println(F("================================\n"));
      
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

  // Downloads (paths are relative to the public/ folder)
  downloads: [
    // { name: "Proteus VSM Circuit Simulation (.pdsprj)", size: "2.4 MB", type: "Simulation", link: "/files/proteus_sim.pdsprj" },
    // { name: "Full ATmega328P Firmware Source Code (.ino)", size: "14 KB", type: "Source Code", link: "/files/arduino_code.ino" },
    // { name: "Timing & Oscilloscope Dataset (.csv)", size: "580 KB", type: "Data", link: "/files/timing_dataset.csv" },
    { name: "Complete Research Thesis PDF (SUST Standard)", size: "4.5 MB", type: "Document", link: "http://www.motarig.com/files/human_aware_shock_prevention_sys.pdf" }
  ]
};

// ============================================================================
// 2. SUST LOGO COMPONENT (Inline SVG Emblem)
// ============================================================================
function SustLogo({ size = 52 }) {
  return (
    <Image src={SUSTLOGO} alt='Sudan University of Science and Technology Logo' 
      width={size} height={size}/>
  );
}

// ============================================================================
// 3. LIGHT MODE STYLES DICTIONARY
// ============================================================================
const LIGHT_STYLES = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#F8FAFC',
    color: '#0F172A',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    paddingBottom: '3rem',
    boxSizing: 'border-box'
  },
  // Header & Branding
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
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: '#0284C7',
    margin: '0.1rem 0 0 0',
    direction: 'rtl'
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
  // Navigation Tabs
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
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1.5rem'
  },
  // Hero Project Banner
  heroCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '0.875rem',
    padding: '1.75rem',
    marginBottom: '2rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
    borderLeft: '5px solid #1E3A8A'
  },
  heroTitle: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#0F172A',
    margin: '0 0 0.5rem 0',
    lineHeight: 1.25
  },
  heroSub: {
    fontSize: '0.875rem',
    color: '#475569',
    margin: 0
  },
  // Metrics Grid
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
    textTransform: 'uppercase',
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
  // Layout Grids & Cards
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
    lineHeight: 1.65,
    margin: '0 0 1rem 0'
  },
  // Team & People Styling
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
  // Video Tab
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
  // Gallery
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
    left: '0.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    color: '#1E3A8A',
    fontSize: '0.6875rem',
    fontWeight: 700,
    padding: '0.2rem 0.525rem',
    borderRadius: '0.25rem',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    fontFamily: 'monospace'
  },
  // Modal
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
  // Code Editor Window (High-contrast Dark Editor inside Light Page)
  codeContainer: {
    backgroundColor: '#0F172A',
    border: '1px solid #1E293B',
    borderRadius: '0.875rem',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
  },
  codeHeader: {
    backgroundColor: '#1E293B',
    padding: '0.75rem 1.25rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  // Downloads
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
// 4. MAIN REACT COMPONENT
// ============================================================================
export default function ResearchShowcase() {
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

  // Download a file from the public folder (or any public URL)
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
    <div style={LIGHT_STYLES.container}>
      {/* Header & Institutional Branding */}
      <header style={LIGHT_STYLES.header}>
        <div style={LIGHT_STYLES.headerInner}>
          <div style={LIGHT_STYLES.brandingBox}>
            <SustLogo size={54} />
            <div>
              <h1 style={LIGHT_STYLES.instEnglish}>{RESEARCH_DATA.meta.institution}</h1>
              <h2 style={LIGHT_STYLES.instArabic}>{RESEARCH_DATA.meta.institutionArabic}</h2>
              <p style={LIGHT_STYLES.deptText}>
                {RESEARCH_DATA.meta.college} • {RESEARCH_DATA.meta.department}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={LIGHT_STYLES.badge}>{RESEARCH_DATA.meta.status}</span>
              <a
                href="/academic/ar"
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
                العربية / AR
              </a>
            </div>
            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500 }}>
              Session: {RESEARCH_DATA.meta.academicYear}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={LIGHT_STYLES.tabsRow}>
          {[
            { id: 'overview', label: 'Overview & Team' },
            { id: 'videos', label: 'Experimental Videos' },
            { id: 'gallery', label: 'Hardware Gallery' },
            { id: 'code', label: 'Source Code' },
            { id: 'downloads', label: 'Downloads & Specs' }
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

      {/* Main Content Body */}
      <main style={LIGHT_STYLES.main}>

        {/* Project Header Card */}
        <div style={LIGHT_STYLES.heroCard}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {RESEARCH_DATA.meta.degree}
          </span>
          <h1 style={LIGHT_STYLES.heroTitle}>{RESEARCH_DATA.meta.title}</h1>
          <p style={LIGHT_STYLES.heroSub}>{RESEARCH_DATA.meta.subtitle}</p>
        </div>

        {/* ================= TAB 1: OVERVIEW & TEAM ================= */}
        {activeTab === 'overview' && (
          <div>
            {/* Quick Specs Cards */}
            <div style={LIGHT_STYLES.metricsGrid}>
              {[
                { label: "Carrier Frequency", value: RESEARCH_DATA.meta.carrierFrequency, sub: "High-Pass Isolated" },
                { label: "Avg Response Time", value: RESEARCH_DATA.meta.avgResponseTime, sub: "Sense to Disconnect" },
                { label: "Isolation Device", value: "Solid-State Relay", sub: "Optically Isolated" },
                { label: "Controller Core", value: RESEARCH_DATA.meta.microcontroller, sub: "8-bit AVR Engine" }
              ].map((m, idx) => (
                <div key={idx} style={LIGHT_STYLES.metricCard}>
                  <span style={LIGHT_STYLES.metricLabel}>{m.label}</span>
                  <span style={LIGHT_STYLES.metricVal}>{m.value}</span>
                  <span style={LIGHT_STYLES.metricSub}>{m.sub}</span>
                </div>
              ))}
            </div>

            {/* Content Columns: Abstract & Team Members */}
            <div style={LIGHT_STYLES.contentGrid}>
              {/* Abstract */}
              <div style={{ ...LIGHT_STYLES.card, gridColumn: 'span 2' }}>
                <h2 style={LIGHT_STYLES.cardTitle}>Research Abstract & Operating Principle</h2>
                <p style={LIGHT_STYLES.text}>
                  This study presents the design and evaluation of a human-aware electrical
                  shock prevention system intended to detect a person's approach to, or contact with, an
                  energized conductor and isolate the circuit before harmful current can persist. The
                  work addresses a limitation of conventional protection devices such as
                  residual-current devices, which primarily respond after an electrical fault or leakage
                  condition has already developed. The proposed approach combines capacitive
                  proximity sensing with fast electronic isolation and adaptive decision logic. A 500
                  kHz low-voltage carrier is superimposed on a simulated 220 V/50 Hz supply, and the
                  change produced by human-body capacitive coupling is detected through a two-stage
                  RC high-pass filtering and clamping stage. An ATmega328P-based controller
                  samples the filtered signal, establishes an initial baseline, tracks slow environmental
                  drift, and uses an adaptive threshold with latched output control to distinguish a
                  significant approach or contact event from ordinary variation. A solid-state relay
                  provides the isolation stage. The system was developed using a simulation-first
                  methodology in Proteus VSM, followed by assembly and bench testing of a physical
                  prototype. Testing covered no-contact operation, direct contact, sustained contact,
                  release, liquid-mediated contact, and simulated socket/plug contact. The sensing
                  principle and adaptive decision logic were demonstrated successfully across these
                  conditions. The firmware contribution to the sense-to-disconnect time averaged about
                  5 ms, while the relay introduced an additional approximately 1–11 ms depending on
                  the AC phase, giving an estimated total of about 5–21 ms with an average near 10.5
                  ms. Thus, the sensing and decision stages met the intended speed requirement on their
                  own, while the triac-based relay's zero-crossing behavior limited the complete system
                  from consistently remaining below 10 ms. The study therefore demonstrates a
                  working proof of concept for proactive, human-aware electrical protection and
                  identifies back-to-back MOSFET isolation and a faster microcontroller as the main
                  directions for further improvement. Testing was performed at a
                  transformer-stepped-down experimental voltage, and full mains-voltage validation
                  remains outside the demonstrated scope.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.25rem' }}>
                  {['Superposition Theorem', 'Capacitive Proximity', 'Asymmetric Filter', 'SUST Engineering'].map((t, i) => (
                    <span key={i} style={{ padding: '0.25rem 0.65rem', fontSize: '0.75rem', backgroundColor: '#F1F5F9', color: '#334155', borderRadius: '0.375rem', border: '1px solid #CBD5E1', fontWeight: 500 }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* People Section: Advisor & Research Team */}
              <div style={LIGHT_STYLES.card}>
                <h3 style={{ ...LIGHT_STYLES.cardTitle, fontSize: '1rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.5rem' }}>
                  Academic Supervision
                </h3>
                
                {/* Advisor Box */}
                <div style={{ ...LIGHT_STYLES.personCard, backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }}>
                  <div style={{ ...LIGHT_STYLES.avatarCircle, backgroundColor: '#1E3A8A', color: '#FFFFFF' }}>
                    Dr
                  </div>
                  <div>
                    <span style={{ fontSize: '0.6875rem', color: '#1E40AF', fontWeight: 600, textTransform: 'uppercase' }}>
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
                  {/* Research Team Members */}
                </h3>

                {/* Student Members List */}
                {RESEARCH_DATA.meta.members.map((member, i) => (
                  <div key={i} style={LIGHT_STYLES.personCard}>
                    <div style={LIGHT_STYLES.avatarCircle}>
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                        {member.name}
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>
                        ID: {member.id} • <span style={{ color: '#0284C7' }}>{member.role}</span>
                      </p>
                    </div>
                  </div>
                ))}

                <button onClick={() => setActiveTab('videos')} style={LIGHT_STYLES.btnPrimary}>
                  Explore Video Evidence →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: VIDEOS ================= */}
        {activeTab === 'videos' && (
          <div>
            <div style={LIGHT_STYLES.videoPlayerContainer}>
              <div style={LIGHT_STYLES.videoWrapper}>
                <video key={selectedVideo.id} controls poster={selectedVideo.posterUrl} style={{ width: '100%', height: '100%', objectFit: 'contain' }}>
                  <source src={selectedVideo.videoUrl} type="video/mp4" />
                </video>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.6875rem', padding: '0.2rem 0.5rem', backgroundColor: '#DBEAFE', color: '#1E40AF', borderRadius: '4px', fontWeight: 600 }}>
                    {selectedVideo.category}
                  </span>
                  <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0F172A', margin: '0.4rem 0 0.25rem 0' }}>{selectedVideo.title}</h2>
                  <p style={{ fontSize: '0.8125rem', color: '#475569', margin: 0 }}>{selectedVideo.description}</p>
                </div>

                <div style={{ backgroundColor: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0', minWidth: '180px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Measured Latency: <strong style={{ color: '#15803D', fontFamily: 'monospace' }}>{selectedVideo.metrics.latency}</strong></div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>Trial Outcome: <strong style={{ color: '#0F172A' }}>{selectedVideo.metrics.outcome}</strong></div>
                </div>
              </div>
            </div>

            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
              Select Experimental Trial
            </h3>
            <div style={LIGHT_STYLES.videoGrid}>
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
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>Experimental Schematics & Waveforms</h2>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Click figure to enlarge</span>
            </div>

            <div style={LIGHT_STYLES.imageGrid}>
              {RESEARCH_DATA.images.map((img) => (
                <div key={img.id} onClick={() => setActiveImageModal(img)} style={LIGHT_STYLES.imageCard}>
                  <div style={{ width: '100%', height: '170px', backgroundColor: '#F1F5F9', position: 'relative', overflow: 'hidden' }}>
                    <img src={img.imageUrl} alt={img.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={LIGHT_STYLES.figureBadge}>{img.figure}</span>
                  </div>
                  <div style={{ padding: '0.875rem' }}>
                    <span style={{ fontSize: '0.6875rem', color: '#0284C7', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>{img.category}</span>
                    <h3 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A', margin: '0.25rem 0' }}>{img.title}</h3>
                    <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0, lineHeight: 1.4 }}>{img.caption}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Lightbox */}
            {activeImageModal && (
              <div style={LIGHT_STYLES.modalBackdrop} onClick={() => setActiveImageModal(null)}>
                <div style={LIGHT_STYLES.modalContent} onClick={(e) => e.stopPropagation()}>
                  <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#0284C7', fontWeight: 700 }}>{activeImageModal.figure}</span>
                      <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>{activeImageModal.title}</h3>
                    </div>
                    <button onClick={() => setActiveImageModal(null)} style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '1.25rem', cursor: 'pointer' }}>✕</button>
                  </div>
                  <div style={{ backgroundColor: '#0F172A', padding: '1rem', display: 'flex', justifyContent: 'center' }}>
                    <img src={activeImageModal.imageUrl} alt={activeImageModal.title} style={{ maxHeight: '60vh', maxWidth: '100%', objectFit: 'contain' }} />
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
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>Firmware & DSP Code</h2>
                <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>Inspect the microcontroller firmware and algorithm implementations.</p>
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
              <div style={LIGHT_STYLES.codeHeader}>
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
                  {copiedCode ? '✓ Copied' : 'Copy Code'}
                </button>
              </div>

              <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid #1E293B', fontSize: '0.75rem', color: '#94A3B8', backgroundColor: '#0F172A' }}>
                {RESEARCH_DATA.codeFiles[selectedCodeIndex].description}
              </div>

              <div style={{ padding: '1.25rem', overflowX: 'auto', fontFamily: 'ui-monospace, SFMono-Regular, Monaco, Consolas, monospace', fontSize: '0.8125rem', lineHeight: '1.6', color: '#E2E8F0' }}>
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
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0F172A', margin: '0 0 0.25rem 0' }}>Download Supplementary Files</h2>
            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0 0 1.5rem 0' }}>Access simulation project files, firmware, and thesis documentation.</p>

            <div style={LIGHT_STYLES.downloadGrid}>
              {RESEARCH_DATA.downloads.map((item, idx) => (
                <div key={idx} style={LIGHT_STYLES.downloadCard}>
                  <div>
                    <span style={{ fontSize: '0.6875rem', color: '#0284C7', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>{item.type}</span>
                    <h3 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0F172A', margin: '0.25rem 0' }}>{item.name}</h3>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Size: {item.size}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDownload(item.link, item.name)}
                    style={{ padding: '0.5rem 0.85rem', backgroundColor: '#F1F5F9', color: '#1E3A8A', border: '1px solid #CBD5E1', borderRadius: '0.5rem', fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Download ↓
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #E2E8F0', marginTop: '4rem', paddingTop: '2rem', textAlign: 'center', fontSize: '0.75rem', color: '#64748B' }}>
        <p style={{ fontWeight: 700, color: '#1E3A8A', margin: 0 }}>{RESEARCH_DATA.meta.institution} ({RESEARCH_DATA.meta.institutionArabic})</p>
        <p style={{ margin: '0.25rem 0 0 0' }}>{RESEARCH_DATA.meta.college} — {RESEARCH_DATA.meta.department}</p>
        <p style={{ margin: '0.25rem 0 0 0', color: '#94A3B8' }}>B.Sc. Graduation Research Project • {RESEARCH_DATA.meta.academicYear}</p>
      </footer>
    </div>
  );
}