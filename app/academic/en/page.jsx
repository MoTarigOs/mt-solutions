'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import SUSTLOGO from '@assets/images/sust_logo.png';

// ============================================================================
// 1. EDITABLE RESEARCH DATA
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

    advisor: {
      title: "Supervised by",
      name: "Dr. Mohamed Alnour",
      role: "",
      email: ""
    },

    members: [
      {
        name: "Mohamed Tarig",
        id: "2018-11481409",
        role: "Hardware & Circuit Design"
      }
    ],

    carrierFrequency: "500 kHz",
    avgResponseTime: "5-21 ms",
    isolationType: "Solid-State Relay (G3M-203P-4)",
    microcontroller: "ATmega328P (8-bit AVR)"
  },

  videos: [
    {
      id: "vid-1",
      title: "Bench Experiment 1",
      category: "Contacts situations",
      duration: "5:07",
      videoUrl:
        "https://sust-motarig-research-files.s3.eu-central-003.backblazeb2.com/shock_prevention_sys_part1.mp4",
      posterUrl:
        "https://www.motarig.com/experiment_poster.png",
      description:
        "Tests touch detection with different contact situations.",
      metrics: {
        latency: "5-21 ms",
        outcome: "Pass (Capacitive Trigger)"
      }
    },
    {
      id: "vid-2",
      title: "Bench Experiment 2",
      category: "More Details",
      duration: "4:24",
      videoUrl:
        "https://sust-motarig-research-files.s3.eu-central-003.backblazeb2.com/shock_prevention_sys_part2.mp4",
      posterUrl:
        "https://www.motarig.com/experiment_poster.png",
      description:
        "Explain in details how we acheived the final results.",
      metrics: {
        latency: "N/A",
        outcome: "Pass"
      }
    }
  ],

  images: [
    {
      id: "img-0",
      title: "Final Circuit Design",
      figure: "Figure 3.6",
      category: "Schematics",
      imageUrl: "/images/circuit_design.jpg",
      caption:
        "Circuit schematic showing the Final Design that we will turn into physical bench test."
    }
  ],

  codeFiles: [
    {
      id: "code-1",
      filename: "arduino_code.hex",
      language: "cpp",
      description:
        "Arduino IDE Code, for ATmega328P firmware implementing ADC sample smoothing, adaptive drift tracking, and latching SSR trip logic.",
      code: `const byte SENSOR_PIN = A0;
const byte RELAY_PIN = 13;
const byte GENERATOR_PIN = 11;
const byte STAGE_PIN = 9;
const byte ALARM_PIN = 8;

// ASYMMETRICAL FILTER CONFIGURATION
float smoothedAmp = 0;

const float SMOOTH_DOWN = 0.88;
const float SMOOTH_UP = 0.15;

// CALIBRATION VARIABLES
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
const float DRIFT_SLOW_PCT = 0.003;
const float DRIFT_FAST_PCT = 0.030;

// Drift Variables
const unsigned long CLOSED_DRIFT_SLOW_TIME = 500;
const unsigned long CLOSED_DRIFT_FAST_TIME = 2000;

const unsigned long OPEN_DRIFT_SLOW_TIME = 1000;
const unsigned long OPEN_DRIFT_FAST_TIME = 30000;

// Timers
unsigned long slowDriftStartTime = 0;
unsigned long fastDriftStartTime = 0;

float currentDriftRatio = 1.0;

bool circuitIsClosed = true;

unsigned long lastSerialTime = 0;

unsigned long clearStartTime = 0;

const unsigned long RECONNECT_DELAY = 3000;

int absMax = 0;
int absMin = 1023;

// --------------------------------------------------
// CLOSED STATE THRESHOLDS
// --------------------------------------------------

void updateClosedThresholds(unsigned long newBase) {

    baselineClosed =
        (SMOOTH_DOWN * newBase) +
        ((1.0 - SMOOTH_DOWN) * newBase);

    thresholdAlarm =
        baselineClosed -
        (baselineClosed * ALARM_SENSITIVITY);

    thresholdOpenIt =
        baselineClosed -
        (baselineClosed * CUTOFF_SENSITIVITY);
}

// --------------------------------------------------
// OPEN STATE THRESHOLDS
// --------------------------------------------------

void updateOpenThresholds(unsigned long newBase) {

    baselineOpen = newBase;

    thresholdCloseIt =
        baselineOpen -
        (baselineOpen * RECONNECT_SENSITIVITY);
}

// --------------------------------------------------
// SETUP
// --------------------------------------------------

void setup() {

    pinMode(RELAY_PIN, OUTPUT);

    digitalWrite(RELAY_PIN, LOW);

    circuitIsClosed = true;

    pinMode(ALARM_PIN, OUTPUT);

    digitalWrite(ALARM_PIN, LOW);

    pinMode(GENERATOR_PIN, OUTPUT);

    pinMode(STAGE_PIN, INPUT_PULLUP);

    // TIMER 2 SQUARE WAVE GENERATION

    TCCR2A =
        _BV(COM2A0) |
        _BV(WGM21);

    TCCR2B = _BV(CS20);

    OCR2A = 7;

    Serial.begin(115200);

    // ADC prescaler

    ADCSRA =
        (ADCSRA & 0xF8) |
        0x05;

    delay(800);

    // Additional calibration and control logic
    // omitted here for display purposes.
}

// --------------------------------------------------
// LOOP
// --------------------------------------------------

void loop() {

    // Sensor acquisition

    int rawAmp = analogRead(SENSOR_PIN);

    // Asymmetrical filtering

    if (rawAmp < smoothedAmp) {

        smoothedAmp =
            (SMOOTH_DOWN * rawAmp) +
            ((1.0 - SMOOTH_DOWN) * smoothedAmp);

    } else {

        smoothedAmp =
            (SMOOTH_UP * rawAmp) +
            ((1.0 - SMOOTH_UP) * smoothedAmp);
    }

    // Main safety logic

    if (circuitIsClosed) {

        if (smoothedAmp < thresholdAlarm) {

            digitalWrite(ALARM_PIN, HIGH);

        } else {

            digitalWrite(ALARM_PIN, LOW);
        }

        if (smoothedAmp < thresholdOpenIt) {

            circuitIsClosed = false;

            digitalWrite(RELAY_PIN, HIGH);

            digitalWrite(ALARM_PIN, LOW);

            clearStartTime = 0;
        }

    } else {

        digitalWrite(ALARM_PIN, LOW);

        if (smoothedAmp > thresholdCloseIt) {

            if (clearStartTime == 0) {
                clearStartTime = millis();
            }

            if (
                millis() - clearStartTime >=
                RECONNECT_DELAY
            ) {

                circuitIsClosed = true;

                digitalWrite(RELAY_PIN, LOW);

                clearStartTime = 0;
            }

        } else {

            clearStartTime = 0;
        }
    }

    // Telemetry

    if (millis() - lastSerialTime >= 120) {

        lastSerialTime = millis();

        Serial.print("Smooth: ");
        Serial.print(smoothedAmp);

        Serial.print(" | State: ");

        Serial.println(
            circuitIsClosed
                ? "CLOSED"
                : "OPEN"
        );
    }
}`
    }
  ],

  downloads: [
    {
      name: "Complete Research Thesis PDF (SUST Standard)",
      size: "4.5 MB",
      type: "Document",
      link:
        "https://www.motarig.com/files/human_aware_shock_prevention_sys.pdf"
    }
  ]
};


// ============================================================================
// 2. LOGO
// ============================================================================
function SustLogo({ size = 52 }) {
  return (
    <Image
      src={SUSTLOGO}
      alt="Sudan University of Science and Technology Logo"
      width={size}
      height={size}
      priority
    />
  );
}


// ============================================================================
// 3. MAIN COMPONENT
// ============================================================================
export default function ResearchShowcase() {

  const [activeTab, setActiveTab] = useState('overview');

  const [selectedVideo, setSelectedVideo] = useState(
    RESEARCH_DATA.videos[0]
  );

  const [selectedCodeIndex, setSelectedCodeIndex] = useState(0);

  const [activeImageModal, setActiveImageModal] =
    useState(null);

  const [copiedCode, setCopiedCode] =
    useState(false);


  // ==========================================================================
  // COPY CODE
  // ==========================================================================
  const handleCopyCode = async (codeText) => {

    try {

      await navigator.clipboard.writeText(codeText);

      setCopiedCode(true);

      setTimeout(() => {
        setCopiedCode(false);
      }, 2000);

    } catch (error) {

      console.error(
        'Could not copy code:',
        error
      );

    }
  };


  // ==========================================================================
  // DOWNLOAD
  // ==========================================================================
  const handleDownload = (url, filename) => {

    const link =
      document.createElement('a');

    link.href = url;

    link.download =
      filename ||
      url.split('/').pop() ||
      'download';

    link.rel = 'noopener noreferrer';

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };


  // ==========================================================================
  // RESPONSIVE CSS
  // ==========================================================================
  const responsiveCSS = `

    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    html,
    body {
      margin: 0;
      padding: 0;
      width: 100%;
      max-width: 100%;
      overflow-x: hidden;
    }

    body {
      -webkit-text-size-adjust: 100%;
      text-size-adjust: 100%;
    }

    button,
    a,
    input,
    select,
    textarea {
      font: inherit;
    }

    button {
      touch-action: manipulation;
    }


    /* ==========================================================
       PAGE
       ========================================================== */

    .research-page {
      width: 100%;
      min-width: 0;
      overflow-x: hidden;
    }


    /* ==========================================================
       HEADER
       ========================================================== */

    .research-header {
      width: 100%;
    }

    .research-header-inner {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;

      padding:
        clamp(0.75rem, 3vw, 1.25rem)
        clamp(0.75rem, 3vw, 1.5rem);

      display: flex;
      flex-wrap: wrap;

      justify-content: space-between;
      align-items: center;

      gap: clamp(0.75rem, 2vw, 1.25rem);
    }

    .research-branding {
      display: flex;
      align-items: center;

      gap: clamp(0.6rem, 2vw, 1rem);

      min-width: 0;
      flex: 1 1 500px;
    }

    .research-branding-text {
      min-width: 0;
      max-width: 100%;
    }

    .research-branding-text h1,
    .research-branding-text h2,
    .research-branding-text p {
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .research-header-actions {
      min-width: 0;

      display: flex;
      flex-direction: column;

      align-items: flex-end;
      justify-content: center;

      gap: 0.5rem;

      flex: 0 1 auto;
    }


    /* ==========================================================
       NAVIGATION
       ========================================================== */

    .research-tabs {
      width: 100%;
      max-width: 1200px;

      margin: 0 auto;

      padding:
        0.25rem
        clamp(0.5rem, 3vw, 1.5rem)
        0;

      display: flex;

      gap: 0.35rem;

      overflow-x: auto;
      overflow-y: hidden;

      scrollbar-width: thin;

      -webkit-overflow-scrolling: touch;

      overscroll-behavior-x: contain;
    }

    .research-tabs::-webkit-scrollbar {
      height: 4px;
    }

    .research-tabs button {
      flex: 0 0 auto;
      white-space: nowrap;

      min-height: 42px;
    }


    /* ==========================================================
       MAIN
       ========================================================== */

    .research-main {
      width: 100%;
      max-width: 1200px;

      margin: 0 auto;

      padding:
        clamp(1rem, 4vw, 2rem)
        clamp(0.75rem, 3vw, 1.5rem);
    }


    /* ==========================================================
       HERO
       ========================================================== */

    .research-hero {
      width: 100%;
      min-width: 0;

      overflow: hidden;
    }

    .research-hero h1 {
      overflow-wrap: anywhere;
      word-break: break-word;
    }


    /* ==========================================================
       METRICS
       ========================================================== */

    .research-metrics {
      width: 100%;
      min-width: 0;

      display: grid;

      grid-template-columns:
        repeat(4, minmax(0, 1fr)) !important;

      gap: 1rem;
    }

    .research-metric {
      min-width: 0;
      overflow: hidden;
    }

    .research-metric-value {
      display: block;

      overflow-wrap: anywhere;
      word-break: break-word;
    }


    /* ==========================================================
       CONTENT GRID
       ========================================================== */

    .research-content-grid {
      width: 100%;
      min-width: 0;

      display: grid;

      grid-template-columns:
        minmax(0, 2fr)
        minmax(280px, 1fr) !important;

      gap: 1.5rem;

      align-items: start;
    }

    .research-card {
      min-width: 0;
      overflow: hidden;
    }

    .research-card-wide {
      grid-column: auto !important;
    }


    /* ==========================================================
       TEAM
       ========================================================== */

    .research-person {
      min-width: 0;
    }

    .research-person-info {
      min-width: 0;
      flex: 1;
    }

    .research-person-info h4,
    .research-person-info p {
      overflow-wrap: anywhere;
      word-break: break-word;
    }


    /* ==========================================================
       VIDEO
       ========================================================== */

    .research-video-container {
      width: 100%;
      min-width: 0;
    }

    .research-video-wrapper {
      width: 100%;

      aspect-ratio: 16 / 9;

      min-height: 0;

      overflow: hidden;
    }

    .research-video-wrapper video {
      display: block;

      width: 100%;
      height: 100%;

      max-width: 100%;
    }

    .research-video-info-row {
      width: 100%;
      min-width: 0;
    }

    .research-video-info {
      min-width: 0;
      flex: 1 1 300px;
    }

    .research-video-metrics {
      min-width: 0;
      flex: 0 1 220px;
    }

    .research-video-grid {
      display: grid;

      grid-template-columns:
        repeat(2, minmax(0, 1fr)) !important;

      gap: 1rem;
    }

    .research-video-card {
      min-width: 0;
      overflow: hidden;
    }

    .research-video-card h4,
    .research-video-card p {
      overflow-wrap: anywhere;
      word-break: break-word;
    }


    /* ==========================================================
       GALLERY
       ========================================================== */

    .research-gallery-header {
      min-width: 0;
    }

    .research-gallery-grid {
      display: grid;

      grid-template-columns:
        repeat(3, minmax(0, 1fr)) !important;

      gap: 1.25rem;
    }

    .research-image-card {
      min-width: 0;
      overflow: hidden;
    }

    .research-image-card img {
      display: block;

      max-width: 100%;
    }


    /* ==========================================================
       MODAL
       ========================================================== */

    .research-modal {
      padding: clamp(0.5rem, 3vw, 1rem);
    }

    .research-modal-content {
      width: min(800px, 100%);

      max-height:
        calc(100dvh - 1rem);

      overflow-y: auto;
    }

    .research-modal-image-container {
      max-height: 65dvh;
      overflow: auto;
    }

    .research-modal-image {
      display: block;

      width: auto;
      height: auto;

      max-width: 100%;
      max-height: 60dvh;
    }


    /* ==========================================================
       CODE
       ========================================================== */

    .research-code-toolbar {
      width: 100%;
      min-width: 0;
    }

    .research-code-buttons {
      max-width: 100%;

      display: flex;

      overflow-x: auto;

      padding-bottom: 2px;

      scrollbar-width: thin;

      -webkit-overflow-scrolling: touch;
    }

    .research-code-container {
      width: 100%;
      min-width: 0;

      overflow: hidden;
    }

    .research-code-scroll {
      width: 100%;
      max-width: 100%;

      overflow-x: auto;
      overflow-y: hidden;

      -webkit-overflow-scrolling: touch;
    }

    .research-code {
      min-width: max-content;
      width: max-content;
    }


    /* ==========================================================
       DOWNLOADS
       ========================================================== */

    .research-download-grid {
      display: grid;

      grid-template-columns:
        repeat(2, minmax(0, 1fr)) !important;

      gap: 1rem;
    }

    .research-download-card {
      min-width: 0;
    }

    .research-download-info {
      min-width: 0;
      flex: 1;
    }

    .research-download-info h3 {
      overflow-wrap: anywhere;
      word-break: break-word;
    }


    /* ==========================================================
       FOOTER
       ========================================================== */

    .research-footer {
      width: 100%;

      padding-left:
        clamp(0.75rem, 3vw, 1.5rem);

      padding-right:
        clamp(0.75rem, 3vw, 1.5rem);

      overflow-wrap: anywhere;
    }


    /* ==========================================================
       TABLETS
       ========================================================== */

    @media (max-width: 900px) {

      .research-header-actions {
        width: 100%;

        flex-direction: row !important;

        justify-content: space-between !important;

        align-items: center !important;
      }

      .research-metrics {
        grid-template-columns:
          repeat(2, minmax(0, 1fr)) !important;
      }

      .research-content-grid {
        grid-template-columns: 1fr !important;
      }

      .research-card-wide {
        grid-column: auto !important;
      }

      .research-gallery-grid {
        grid-template-columns:
          repeat(2, minmax(0, 1fr)) !important;
      }
    }


    /* ==========================================================
       MOBILE
       ========================================================== */

    @media (max-width: 640px) {

      .research-header-inner {
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
      }

      .research-branding {
        width: 100%;
        flex-basis: 100%;
      }

      .research-branding img {
        width: 42px !important;
        height: 42px !important;
      }

      .research-branding-text h1 {
        font-size: 0.75rem !important;
        line-height: 1.3 !important;
      }

      .research-branding-text h2 {
        font-size: 0.7rem !important;
        line-height: 1.3 !important;
      }

      .research-branding-text p {
        font-size: 0.65rem !important;
        line-height: 1.3 !important;
      }

      .research-header-actions {
        width: 100%;

        flex-direction: row !important;

        justify-content: space-between !important;

        align-items: center !important;
      }

      .research-header-actions span,
      .research-header-actions a {
        font-size: 0.65rem !important;
      }


      /* NAV */

      .research-tabs {
        gap: 0.25rem;
      }

      .research-tabs button {
        padding: 0.55rem 0.7rem !important;
        font-size: 0.7rem !important;

        min-height: 40px;
      }


      /* MAIN */

      .research-main {
        padding-top: 1rem;
      }


      /* HERO */

      .research-hero {
        padding: 1rem !important;

        margin-bottom: 1rem !important;

        border-left-width: 4px !important;
      }

      .research-hero h1 {
        font-size:
          clamp(1.05rem, 5vw, 1.35rem) !important;

        line-height: 1.3 !important;
      }

      .research-hero > span {
        font-size: 0.65rem !important;
      }

      .research-hero p {
        font-size: 0.75rem !important;
      }


      /* METRICS */

      .research-metrics {
        grid-template-columns:
          repeat(2, minmax(0, 1fr)) !important;

        gap: 0.6rem;

        margin-bottom: 1rem !important;
      }

      .research-metric {
        padding: 0.85rem !important;
      }

      .research-metric-label {
        font-size: 0.62rem !important;
      }

      .research-metric-value {
        font-size:
          clamp(0.95rem, 4vw, 1.25rem) !important;

        line-height: 1.2 !important;
      }

      .research-metric-sub {
        font-size: 0.62rem !important;
      }


      /* CARDS */

      .research-content-grid {
        gap: 1rem !important;
      }

      .research-card {
        padding: 1rem !important;

        border-radius: 0.7rem !important;
      }

      .research-card h2,
      .research-card h3 {
        font-size: 0.95rem !important;
      }

      .research-card p {
        font-size: 0.78rem !important;
        line-height: 1.6 !important;
      }


      /* PEOPLE */

      .research-person {
        padding: 0.65rem !important;
      }

      .research-person-info h4 {
        font-size: 0.75rem !important;
      }

      .research-person-info p {
        font-size: 0.65rem !important;
      }


      /* VIDEO */

      .research-video-container {
        padding: 0.75rem !important;

        border-radius: 0.75rem !important;
      }

      .research-video-info-row {
        flex-direction: column !important;
      }

      .research-video-info {
        width: 100%;
        flex-basis: auto !important;
      }

      .research-video-metrics {
        width: 100%;

        flex-basis: auto !important;
      }

      .research-video-grid {
        grid-template-columns: 1fr !important;
      }

      .research-video-card {
        padding: 0.6rem !important;
      }


      /* GALLERY */

      .research-gallery-header {
        flex-direction: column !important;

        align-items: flex-start !important;
      }

      .research-gallery-grid {
        grid-template-columns: 1fr !important;
      }


      /* MODAL */

      .research-modal {
        padding: 0.5rem !important;
      }

      .research-modal-content {
        border-radius: 0.75rem !important;

        max-height:
          calc(100dvh - 1rem);
      }

      .research-modal-image-container {
        padding: 0.5rem !important;
      }

      .research-modal-image {
        max-height: 55dvh !important;
      }


      /* CODE */

      .research-code-toolbar {
        flex-direction: column !important;

        align-items: flex-start !important;
      }

      .research-code-buttons {
        width: 100%;
      }

      .research-code-container {
        border-radius: 0.7rem !important;
      }

      .research-code-scroll {
        font-size: 0.68rem !important;
      }


      /* DOWNLOADS */

      .research-download-grid {
        grid-template-columns: 1fr !important;
      }

      .research-download-card {
        padding: 0.9rem !important;
        gap: 0.75rem;
      }

      .research-download-card button {
        flex-shrink: 0;
      }


      /* FOOTER */

      .research-footer {
        margin-top: 2rem !important;

        padding-top: 1.25rem !important;
        padding-bottom: 1rem !important;
      }
    }


    /* ==========================================================
       VERY SMALL PHONES
       ========================================================== */

    @media (max-width: 380px) {

      .research-header-inner,
      .research-tabs,
      .research-main {
        padding-left: 0.6rem !important;
        padding-right: 0.6rem !important;
      }

      .research-metrics {
        grid-template-columns: 1fr !important;
      }

      .research-header-actions {
        align-items: flex-start !important;
      }

      .research-header-actions > div {
        flex-wrap: wrap;
      }

      .research-person {
        align-items: flex-start !important;
      }

      .research-download-card {
        flex-direction: column !important;

        align-items: stretch !important;
      }

      .research-download-card button {
        width: 100%;
      }
    }


    /* ==========================================================
       LARGE MONITORS
       ========================================================== */

    @media (min-width: 1600px) {

      .research-header-inner,
      .research-tabs,
      .research-main {
        max-width: 1400px;
      }

      .research-main {
        padding-left: 2rem;
        padding-right: 2rem;
      }
    }


    /* ==========================================================
       ACCESSIBILITY
       ========================================================== */

    @media (prefers-reduced-motion: reduce) {

      *,
      *::before,
      *::after {
        scroll-behavior: auto !important;
        transition: none !important;
        animation: none !important;
      }
    }
  `;


  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <div
      className="research-page"
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#F8FAFC',
        color: '#0F172A',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
        paddingBottom: '3rem'
      }}
    >

      <style jsx global>
        {responsiveCSS}
      </style>


      {/* ================================================================
          HEADER
          ================================================================ */}

      <header
        className="research-header"
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow:
            '0 1px 3px rgba(0,0,0,0.05)'
        }}
      >

        <div className="research-header-inner">

          <div className="research-branding">

            <SustLogo size={54} />

            <div className="research-branding-text">

              <h1
                style={{
                  fontSize: 'clamp(0.75rem, 2vw, 0.875rem)',
                  fontWeight: 700,
                  color: '#1E3A8A',
                  letterSpacing: '-0.01em',
                  margin: 0
                }}
              >
                {RESEARCH_DATA.meta.institution}
              </h1>

              <h2
                style={{
                  fontSize: 'clamp(0.7rem, 2vw, 0.8125rem)',
                  fontWeight: 600,
                  color: '#0284C7',
                  margin: '0.1rem 0 0',
                  direction: 'rtl'
                }}
              >
                {RESEARCH_DATA.meta.institutionArabic}
              </h2>

              <p
                style={{
                  fontSize: 'clamp(0.65rem, 1.8vw, 0.75rem)',
                  color: '#64748B',
                  margin: '0.2rem 0 0'
                }}
              >
                {RESEARCH_DATA.meta.college}
                {' • '}
                {RESEARCH_DATA.meta.department}
              </p>

            </div>

          </div>


          <div
            className="research-header-actions"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '0.5rem'
            }}
          >

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                flexWrap: 'wrap',
                justifyContent: 'flex-end'
              }}
            >

              <span
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  backgroundColor: '#F0FDF4',
                  color: '#166534',
                  border: '1px solid #BBF7D0'
                }}
              >
                {RESEARCH_DATA.meta.status}
              </span>

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

            <span
              style={{
                fontSize: '0.75rem',
                color: '#64748B',
                fontWeight: 500
              }}
            >
              Session: {RESEARCH_DATA.meta.academicYear}
            </span>

          </div>

        </div>


        {/* ==============================================================
            TABS
            ============================================================== */}

        <div className="research-tabs">

          {[
            {
              id: 'overview',
              label: 'Overview & Team'
            },
            {
              id: 'videos',
              label: 'Experimental Videos'
            },
            {
              id: 'gallery',
              label: 'Hardware Gallery'
            },
            {
              id: 'code',
              label: 'Source Code'
            },
            {
              id: 'downloads',
              label: 'Downloads & Specs'
            }
          ].map((tab) => (

            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(tab.id)
              }
              style={{
                padding:
                  '0.65rem 1rem',

                fontSize:
                  'clamp(0.7rem, 1.5vw, 0.8125rem)',

                fontWeight:
                  activeTab === tab.id
                    ? 600
                    : 500,

                borderRadius:
                  '0.5rem 0.5rem 0 0',

                cursor: 'pointer',

                border: 'none',

                backgroundColor:
                  activeTab === tab.id
                    ? '#F8FAFC'
                    : 'transparent',

                color:
                  activeTab === tab.id
                    ? '#1E3A8A'
                    : '#64748B',

                borderBottom:
                  activeTab === tab.id
                    ? '3px solid #1E3A8A'
                    : '3px solid transparent',

                whiteSpace: 'nowrap',

                transition:
                  'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>

          ))}

        </div>

      </header>


      {/* ================================================================
          MAIN
          ================================================================ */}

      <main className="research-main">


        {/* ==============================================================
            HERO
            ============================================================== */}

        <div
          className="research-hero"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '0.875rem',
            padding:
              'clamp(1rem, 4vw, 1.75rem)',
            marginBottom: '2rem',
            boxShadow:
              '0 4px 6px rgba(0,0,0,0.03)',
            borderLeft:
              '5px solid #1E3A8A'
          }}
        >

          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#0284C7',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            {RESEARCH_DATA.meta.degree}
          </span>

          <h1
            style={{
              fontSize:
                'clamp(1.1rem, 3vw, 1.5rem)',
              fontWeight: 800,
              color: '#0F172A',
              margin:
                '0.5rem 0',
              lineHeight: 1.25
            }}
          >
            {RESEARCH_DATA.meta.title}
          </h1>

          <p
            style={{
              fontSize:
                'clamp(0.75rem, 2vw, 0.875rem)',
              color: '#475569',
              margin: 0
            }}
          >
            {RESEARCH_DATA.meta.subtitle}
          </p>

        </div>


        {/* ==============================================================
            OVERVIEW
            ============================================================== */}

        {activeTab === 'overview' && (

          <div>


            {/* METRICS */}

            <div
              className="research-metrics"
              style={{
                marginBottom: '2rem'
              }}
            >

              {[
                {
                  label: 'Carrier Frequency',
                  value:
                    RESEARCH_DATA.meta.carrierFrequency,
                  sub: 'High-Pass Isolated'
                },
                {
                  label: 'Avg Response Time',
                  value:
                    RESEARCH_DATA.meta.avgResponseTime,
                  sub: 'Sense to Disconnect'
                },
                {
                  label: 'Isolation Device',
                  value: 'Solid-State Relay',
                  sub: 'Optically Isolated'
                },
                {
                  label: 'Controller Core',
                  value:
                    RESEARCH_DATA.meta.microcontroller,
                  sub: '8-bit AVR Engine'
                }
              ].map((metric, index) => (

                <div
                  key={index}
                  className="research-metric"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border:
                      '1px solid #E2E8F0',
                    padding:
                      'clamp(0.85rem, 3vw, 1.25rem)',
                    borderRadius: '0.75rem',
                    boxShadow:
                      '0 1px 3px rgba(0,0,0,0.03)'
                  }}
                >

                  <span
                    className="research-metric-label"
                    style={{
                      fontSize: '0.75rem',
                      color: '#64748B',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.025em'
                    }}
                  >
                    {metric.label}
                  </span>

                  <span
                    className="research-metric-value"
                    style={{
                      fontSize:
                        'clamp(1rem, 3vw, 1.5rem)',
                      fontWeight: 800,
                      color: '#1E3A8A',
                      marginTop: '0.35rem'
                    }}
                  >
                    {metric.value}
                  </span>

                  <span
                    className="research-metric-sub"
                    style={{
                      fontSize: '0.75rem',
                      color: '#0284C7',
                      marginTop: '0.25rem',
                      display: 'block',
                      fontWeight: 500
                    }}
                  >
                    {metric.sub}
                  </span>

                </div>

              ))}

            </div>


            {/* CONTENT */}

            <div
              className="research-content-grid"
            >


              {/* ABSTRACT */}

              <div
                className="research-card research-card-wide"
                style={{
                  backgroundColor: '#FFFFFF',
                  border:
                    '1px solid #E2E8F0',
                  borderRadius: '0.875rem',
                  padding:
                    'clamp(1rem, 3vw, 1.5rem)',
                  boxShadow:
                    '0 1px 3px rgba(0,0,0,0.04)'
                }}
              >

                <h2
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: '#0F172A',
                    marginTop: 0,
                    marginBottom: '1rem'
                  }}
                >
                  Research Abstract & Operating Principle
                </h2>

                <p
                  style={{
                    fontSize:
                      'clamp(0.78rem, 1.5vw, 0.875rem)',
                    color: '#334155',
                    lineHeight: 1.65,
                    margin: 0
                  }}
                >
                  This study presents the design and evaluation of a human-aware electrical
                  shock prevention system intended to detect a person's approach to, or contact
                  with, an energized conductor and isolate the circuit before harmful current can
                  persist. The work addresses a limitation of conventional protection devices
                  such as residual-current devices, which primarily respond after an electrical
                  fault or leakage condition has already developed. The proposed approach combines
                  capacitive proximity sensing with fast electronic isolation and adaptive decision
                  logic. A 500 kHz low-voltage carrier is superimposed on a simulated 220 V/50 Hz
                  supply, and the change produced by human-body capacitive coupling is detected
                  through a two-stage RC high-pass filtering and clamping stage. An ATmega328P-based
                  controller samples the filtered signal, establishes an initial baseline, tracks
                  slow environmental drift, and uses an adaptive threshold with latched output
                  control to distinguish a significant approach or contact event from ordinary
                  variation. A solid-state relay provides the isolation stage. The system was
                  developed using a simulation-first methodology in Proteus VSM, followed by
                  assembly and bench testing of a physical prototype. Testing covered no-contact
                  operation, direct contact, sustained contact, release, liquid-mediated contact,
                  and simulated socket/plug contact. The sensing principle and adaptive decision
                  logic were demonstrated successfully across these conditions. The firmware
                  contribution to the sense-to-disconnect time averaged about 5 ms, while the
                  relay introduced an additional approximately 1–11 ms depending on the AC phase,
                  giving an estimated total of about 5–21 ms with an average near 10.5 ms.
                  Thus, the sensing and decision stages met the intended speed requirement on
                  their own, while the triac-based relay's zero-crossing behavior limited the
                  complete system from consistently remaining below 10 ms. The study therefore
                  demonstrates a working proof of concept for proactive, human-aware electrical
                  protection and identifies back-to-back MOSFET isolation and a faster
                  microcontroller as the main directions for further improvement. Testing was
                  performed at a transformer-stepped-down experimental voltage, and full
                  mains-voltage validation remains outside the demonstrated scope.
                </p>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    marginTop: '1.25rem'
                  }}
                >

                  {[
                    'Superposition Theorem',
                    'Capacitive Proximity',
                    'Asymmetric Filter',
                    'SUST Engineering'
                  ].map((tag, index) => (

                    <span
                      key={index}
                      style={{
                        padding:
                          '0.25rem 0.65rem',
                        fontSize: '0.75rem',
                        backgroundColor: '#F1F5F9',
                        color: '#334155',
                        borderRadius: '0.375rem',
                        border:
                          '1px solid #CBD5E1',
                        fontWeight: 500
                      }}
                    >
                      {tag}
                    </span>

                  ))}

                </div>

              </div>


              {/* TEAM */}

              <div
                className="research-card"
                style={{
                  backgroundColor: '#FFFFFF',
                  border:
                    '1px solid #E2E8F0',
                  borderRadius: '0.875rem',
                  padding:
                    'clamp(1rem, 3vw, 1.5rem)',
                  boxShadow:
                    '0 1px 3px rgba(0,0,0,0.04)'
                }}
              >

                <h3
                  style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: '#0F172A',
                    marginTop: 0,
                    marginBottom: '1rem',
                    paddingBottom: '0.5rem',
                    borderBottom:
                      '1px solid #F1F5F9'
                  }}
                >
                  Academic Supervision
                </h3>


                {/* ADVISOR */}

                <div
                  className="research-person"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    backgroundColor: '#EFF6FF',
                    borderRadius: '0.5rem',
                    border:
                      '1px solid #BFDBFE',
                    marginBottom: '0.5rem'
                  }}
                >

                  <div
                    style={{
                      width: 38,
                      height: 38,
                      minWidth: 38,
                      borderRadius: '50%',
                      backgroundColor: '#1E3A8A',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.75rem'
                    }}
                  >
                    Dr
                  </div>

                  <div className="research-person-info">

                    <span
                      style={{
                        fontSize: '0.6875rem',
                        color: '#1E40AF',
                        fontWeight: 600,
                        textTransform: 'uppercase'
                      }}
                    >
                      {RESEARCH_DATA.meta.advisor.title}
                    </span>

                    <h4
                      style={{
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: '#0F172A',
                        margin: 0
                      }}
                    >
                      {RESEARCH_DATA.meta.advisor.name}
                    </h4>

                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: '#475569',
                        margin: 0
                      }}
                    >
                      {RESEARCH_DATA.meta.advisor.role}
                    </p>

                  </div>

                </div>


                {/* MEMBERS */}

                {RESEARCH_DATA.meta.members.map(
                  (member, index) => (

                    <div
                      key={index}
                      className="research-person"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem',
                        backgroundColor: '#F8FAFC',
                        borderRadius: '0.5rem',
                        border:
                          '1px solid #E2E8F0',
                        marginBottom: '0.5rem'
                      }}
                    >

                      <div
                        style={{
                          width: 38,
                          height: 38,
                          minWidth: 38,
                          borderRadius: '50%',
                          backgroundColor: '#DBEAFE',
                          color: '#1E3A8A',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700
                        }}
                      >
                        {member.name.charAt(0)}
                      </div>

                      <div className="research-person-info">

                        <h4
                          style={{
                            fontSize: '0.8125rem',
                            fontWeight: 700,
                            color: '#0F172A',
                            margin: 0
                          }}
                        >
                          {member.name}
                        </h4>

                        <p
                          style={{
                            fontSize: '0.75rem',
                            color: '#64748B',
                            margin: 0
                          }}
                        >
                          ID: {member.id}
                          {' • '}
                          <span
                            style={{
                              color: '#0284C7'
                            }}
                          >
                            {member.role}
                          </span>
                        </p>

                      </div>

                    </div>

                  )
                )}


                <button
                  onClick={() =>
                    setActiveTab('videos')
                  }
                  style={{
                    display: 'block',
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
                    marginTop: '1rem'
                  }}
                >
                  Explore Video Evidence →
                </button>

              </div>

            </div>

          </div>

        )}


        {/* ==============================================================
            VIDEOS
            ============================================================== */}

        {activeTab === 'videos' && (

          <div>

            <div
              className="research-video-container"
              style={{
                backgroundColor: '#FFFFFF',
                border:
                  '1px solid #E2E8F0',
                borderRadius: '1rem',
                padding:
                  'clamp(0.75rem, 3vw, 1.25rem)',
                marginBottom: '2rem',
                boxShadow:
                  '0 4px 6px rgba(0,0,0,0.05)'
              }}
            >

              <div
                className="research-video-wrapper"
                style={{
                  backgroundColor: '#0F172A',
                  borderRadius: '0.75rem'
                }}
              >

                <video
                  key={selectedVideo.id}
                  controls
                  poster={selectedVideo.posterUrl}
                  playsInline
                  preload="metadata"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                >
                  <source
                    src={selectedVideo.videoUrl}
                    type="video/mp4"
                  />
                </video>

              </div>


              <div
                className="research-video-info-row"
                style={{
                  marginTop: '1rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '1rem'
                }}
              >

                <div
                  className="research-video-info"
                >

                  <span
                    style={{
                      fontSize: '0.6875rem',
                      padding:
                        '0.2rem 0.5rem',
                      backgroundColor: '#DBEAFE',
                      color: '#1E40AF',
                      borderRadius: 4,
                      fontWeight: 600
                    }}
                  >
                    {selectedVideo.category}
                  </span>

                  <h2
                    style={{
                      fontSize:
                        'clamp(1rem, 3vw, 1.125rem)',
                      fontWeight: 700,
                      color: '#0F172A',
                      margin:
                        '0.4rem 0 0.25rem'
                    }}
                  >
                    {selectedVideo.title}
                  </h2>

                  <p
                    style={{
                      fontSize: '0.8125rem',
                      color: '#475569',
                      margin: 0,
                      lineHeight: 1.5
                    }}
                  >
                    {selectedVideo.description}
                  </p>

                </div>


                <div
                  className="research-video-metrics"
                  style={{
                    backgroundColor: '#F8FAFC',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    border:
                      '1px solid #E2E8F0'
                  }}
                >

                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#64748B'
                    }}
                  >
                    Measured Latency:{' '}

                    <strong
                      style={{
                        color: '#15803D',
                        fontFamily: 'monospace'
                      }}
                    >
                      {selectedVideo.metrics.latency}
                    </strong>

                  </div>

                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#64748B',
                      marginTop: '0.25rem'
                    }}
                  >
                    Trial Outcome:{' '}

                    <strong
                      style={{
                        color: '#0F172A'
                      }}
                    >
                      {selectedVideo.metrics.outcome}
                    </strong>

                  </div>

                </div>

              </div>

            </div>


            <h3
              style={{
                fontSize: '0.875rem',
                fontWeight: 700,
                color: '#475569',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '1rem'
              }}
            >
              Select Experimental Trial
            </h3>


            <div className="research-video-grid">

              {RESEARCH_DATA.videos.map(
                (video) => (

                  <div
                    key={video.id}
                    className="research-video-card"
                    onClick={() =>
                      setSelectedVideo(video)
                    }
                    style={{
                      backgroundColor:
                        selectedVideo.id ===
                        video.id
                          ? '#EFF6FF'
                          : '#FFFFFF',

                      border:
                        selectedVideo.id ===
                        video.id
                          ? '2px solid #2563EB'
                          : '1px solid #E2E8F0',

                      borderRadius: '0.75rem',

                      padding: '0.75rem',

                      cursor: 'pointer',

                      boxShadow:
                        '0 1px 3px rgba(0,0,0,0.03)'
                    }}
                  >

                    <div
                      style={{
                        width: '100%',
                        aspectRatio: '16 / 9',
                        backgroundColor: '#0F172A',
                        borderRadius: '0.5rem',
                        overflow: 'hidden',
                        position: 'relative',
                        marginBottom: '0.5rem'
                      }}
                    >

                      <img
                        src={video.posterUrl}
                        alt={video.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          opacity: 0.85
                        }}
                      />

                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >

                        <div
                          style={{
                            width: 36,
                            height: 36,
                            backgroundColor: '#1E3A8A',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF',
                            fontSize: '0.875rem'
                          }}
                        >
                          ▶
                        </div>

                      </div>

                    </div>


                    <h4
                      style={{
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        color: '#0F172A',
                        margin: 0
                      }}
                    >
                      {video.title}
                    </h4>

                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: '#64748B',
                        margin:
                          '0.25rem 0 0',
                        lineHeight: 1.5
                      }}
                    >
                      {video.description}
                    </p>

                  </div>

                )
              )}

            </div>

          </div>

        )}


        {/* ==============================================================
            GALLERY
            ============================================================== */}

        {activeTab === 'gallery' && (

          <div>

            <div
              className="research-gallery-header"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.25rem',
                gap: '1rem'
              }}
            >

              <h2
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: '#0F172A',
                  margin: 0
                }}
              >
                Experimental Schematics & Waveforms
              </h2>

              <span
                style={{
                  fontSize: '0.75rem',
                  color: '#64748B'
                }}
              >
                Click figure to enlarge
              </span>

            </div>


            <div className="research-gallery-grid">

              {RESEARCH_DATA.images.map(
                (image) => (

                  <div
                    key={image.id}
                    className="research-image-card"
                    onClick={() =>
                      setActiveImageModal(image)
                    }
                    style={{
                      backgroundColor: '#FFFFFF',
                      border:
                        '1px solid #E2E8F0',
                      borderRadius: '0.75rem',
                      cursor: 'pointer',
                      boxShadow:
                        '0 1px 3px rgba(0,0,0,0.03)'
                    }}
                  >

                    <div
                      style={{
                        width: '100%',
                        aspectRatio: '16 / 10',
                        backgroundColor: '#F1F5F9',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >

                      <img
                        src={image.imageUrl}
                        alt={image.title}
                        loading="lazy"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />

                      <span
                        style={{
                          position: 'absolute',
                          top: '0.5rem',
                          left: '0.5rem',
                          backgroundColor:
                            'rgba(255,255,255,0.95)',
                          color: '#1E3A8A',
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          padding:
                            '0.2rem 0.525rem',
                          borderRadius: '0.25rem',
                          fontFamily: 'monospace'
                        }}
                      >
                        {image.figure}
                      </span>

                    </div>


                    <div
                      style={{
                        padding: '0.875rem'
                      }}
                    >

                      <span
                        style={{
                          fontSize: '0.6875rem',
                          color: '#0284C7',
                          textTransform: 'uppercase',
                          fontWeight: 600
                        }}
                      >
                        {image.category}
                      </span>

                      <h3
                        style={{
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          color: '#0F172A',
                          margin:
                            '0.25rem 0'
                        }}
                      >
                        {image.title}
                      </h3>

                      <p
                        style={{
                          fontSize: '0.75rem',
                          color: '#64748B',
                          margin: 0,
                          lineHeight: 1.4
                        }}
                      >
                        {image.caption}
                      </p>

                    </div>

                  </div>

                )
              )}

            </div>


            {/* MODAL */}

            {activeImageModal && (

              <div
                className="research-modal"
                onClick={() =>
                  setActiveImageModal(null)
                }
                style={{
                  position: 'fixed',
                  inset: 0,
                  backgroundColor:
                    'rgba(15,23,42,0.75)',
                  backdropFilter:
                    'blur(4px)',
                  zIndex: 50,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >

                <div
                  className="research-modal-content"
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    boxShadow:
                      '0 20px 25px rgba(0,0,0,0.2)'
                  }}
                >

                  <div
                    style={{
                      padding:
                        '1rem 1.25rem',
                      borderBottom:
                        '1px solid #E2E8F0',
                      display: 'flex',
                      justifyContent:
                        'space-between',
                      alignItems: 'center',
                      gap: '1rem'
                    }}
                  >

                    <div
                      style={{
                        minWidth: 0
                      }}
                    >

                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontFamily: 'monospace',
                          color: '#0284C7',
                          fontWeight: 700
                        }}
                      >
                        {activeImageModal.figure}
                      </span>

                      <h3
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 700,
                          color: '#0F172A',
                          margin: 0
                        }}
                      >
                        {activeImageModal.title}
                      </h3>

                    </div>

                    <button
                      onClick={() =>
                        setActiveImageModal(null)
                      }
                      aria-label="Close image"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#64748B',
                        fontSize: '1.25rem',
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                    >
                      ✕
                    </button>

                  </div>


                  <div
                    className="research-modal-image-container"
                    style={{
                      backgroundColor: '#0F172A',
                      padding: '1rem',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >

                    <img
                      className="research-modal-image"
                      src={activeImageModal.imageUrl}
                      alt={activeImageModal.title}
                    />

                  </div>


                  <div
                    style={{
                      padding: '1rem',
                      fontSize: '0.8125rem',
                      color: '#334155'
                    }}
                  >
                    {activeImageModal.caption}
                  </div>

                </div>

              </div>

            )}

          </div>

        )}


        {/* ==============================================================
            SOURCE CODE
            ============================================================== */}

        {activeTab === 'code' && (

          <div>

            <div
              className="research-code-toolbar"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1.25rem'
              }}
            >

              <div>

                <h2
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    color: '#0F172A',
                    margin: 0
                  }}
                >
                  Firmware & DSP Code
                </h2>

                <p
                  style={{
                    fontSize: '0.75rem',
                    color: '#64748B',
                    margin:
                      '0.25rem 0 0'
                  }}
                >
                  Inspect the microcontroller firmware and algorithm implementations.
                </p>

              </div>


              <div
                className="research-code-buttons"
              >

                {RESEARCH_DATA.codeFiles.map(
                  (file, index) => (

                    <button
                      key={file.id}
                      onClick={() =>
                        setSelectedCodeIndex(index)
                      }
                      style={{
                        padding:
                          '0.4rem 0.85rem',
                        fontSize: '0.75rem',
                        fontFamily: 'monospace',
                        borderRadius:
                          '0.375rem',
                        border:
                          selectedCodeIndex === index
                            ? 'none'
                            : '1px solid #CBD5E1',
                        cursor: 'pointer',
                        backgroundColor:
                          selectedCodeIndex === index
                            ? '#1E3A8A'
                            : '#FFFFFF',
                        color:
                          selectedCodeIndex === index
                            ? '#FFFFFF'
                            : '#475569',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {file.filename}
                    </button>

                  )
                )}

              </div>

            </div>


            <div
              className="research-code-container"
              style={{
                backgroundColor: '#0F172A',
                border:
                  '1px solid #1E293B',
                borderRadius: '0.875rem',
                boxShadow:
                  '0 4px 12px rgba(0,0,0,0.15)'
              }}
            >

              <div
                style={{
                  backgroundColor: '#1E293B',
                  padding:
                    '0.75rem 1.25rem',
                  display: 'flex',
                  justifyContent:
                    'space-between',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    minWidth: 0
                  }}
                >

                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: '#EF4444'
                    }}
                  />

                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: '#F59E0B'
                    }}
                  />

                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: '#10B981'
                    }}
                  />

                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      color: '#94A3B8',
                      marginLeft: '0.5rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {
                      RESEARCH_DATA
                        .codeFiles[
                          selectedCodeIndex
                        ].filename
                    }
                  </span>

                </div>


                <button
                  onClick={() =>
                    handleCopyCode(
                      RESEARCH_DATA
                        .codeFiles[
                          selectedCodeIndex
                        ].code
                    )
                  }
                  style={{
                    padding:
                      '0.25rem 0.65rem',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    backgroundColor: '#334155',
                    color: '#F1F5F9',
                    border: 'none',
                    borderRadius:
                      '0.375rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                >
                  {copiedCode
                    ? '✓ Copied'
                    : 'Copy Code'}
                </button>

              </div>


              <div
                style={{
                  padding:
                    '0.75rem 1.25rem',
                  borderBottom:
                    '1px solid #1E293B',
                  fontSize: '0.75rem',
                  color: '#94A3B8'
                }}
              >
                {
                  RESEARCH_DATA
                    .codeFiles[
                      selectedCodeIndex
                    ].description
                }
              </div>


              <div
                className="research-code-scroll"
                style={{
                  padding:
                    '1.25rem',
                  fontFamily:
                    'ui-monospace, SFMono-Regular, Monaco, Consolas, monospace',
                  lineHeight: 1.6,
                  color: '#E2E8F0'
                }}
              >

                <pre
                  className="research-code"
                  style={{
                    margin: 0,
                    fontSize:
                      'clamp(0.68rem, 1vw, 0.8125rem)'
                  }}
                >

                  <code>

                    {
                      RESEARCH_DATA
                        .codeFiles[
                          selectedCodeIndex
                        ].code
                        .split('\n')
                        .map(
                          (line, index) => (

                            <div
                              key={index}
                              style={{
                                display:
                                  'table-row'
                              }}
                            >

                              <span
                                style={{
                                  display:
                                    'table-cell',
                                  userSelect:
                                    'none',
                                  paddingRight:
                                    '1.25rem',
                                  color:
                                    '#475569',
                                  textAlign:
                                    'right',
                                  fontSize:
                                    '0.75rem'
                                }}
                              >
                                {index + 1}
                              </span>

                              <span
                                style={{
                                  display:
                                    'table-cell',
                                  whiteSpace:
                                    'pre'
                                }}
                              >
                                {line}
                              </span>

                            </div>

                          )
                        )
                    }

                  </code>

                </pre>

              </div>

            </div>

          </div>

        )}


        {/* ==============================================================
            DOWNLOADS
            ============================================================== */}

        {activeTab === 'downloads' && (

          <div>

            <h2
              style={{
                fontSize: '1.125rem',
                fontWeight: 700,
                color: '#0F172A',
                margin:
                  '0 0 0.25rem'
              }}
            >
              Download Supplementary Files
            </h2>

            <p
              style={{
                fontSize: '0.75rem',
                color: '#64748B',
                margin:
                  '0 0 1.5rem'
              }}
            >
              Access simulation project files, firmware,
              and thesis documentation.
            </p>


            <div
              className="research-download-grid"
            >

              {RESEARCH_DATA.downloads.map(
                (item, index) => (

                  <div
                    key={index}
                    className="research-download-card"
                    style={{
                      backgroundColor: '#FFFFFF',
                      border:
                        '1px solid #E2E8F0',
                      borderRadius: '0.75rem',
                      padding: '1.25rem',
                      display: 'flex',
                      justifyContent:
                        'space-between',
                      alignItems: 'center',
                      gap: '1rem',
                      boxShadow:
                        '0 1px 3px rgba(0,0,0,0.03)'
                    }}
                  >

                    <div
                      className="research-download-info"
                    >

                      <span
                        style={{
                          fontSize: '0.6875rem',
                          color: '#0284C7',
                          textTransform:
                            'uppercase',
                          fontWeight: 700
                        }}
                      >
                        {item.type}
                      </span>

                      <h3
                        style={{
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          color: '#0F172A',
                          margin:
                            '0.25rem 0'
                        }}
                      >
                        {item.name}
                      </h3>

                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: '#64748B'
                        }}
                      >
                        Size: {item.size}
                      </span>

                    </div>


                    <button
                      type="button"
                      onClick={() =>
                        handleDownload(
                          item.link,
                          item.name
                        )
                      }
                      style={{
                        padding:
                          '0.5rem 0.85rem',
                        backgroundColor:
                          '#F1F5F9',
                        color: '#1E3A8A',
                        border:
                          '1px solid #CBD5E1',
                        borderRadius:
                          '0.5rem',
                        fontSize: '0.75rem',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Download ↓
                    </button>

                  </div>

                )
              )}

            </div>

          </div>

        )}

      </main>


      {/* ================================================================
          FOOTER
          ================================================================ */}

      <footer
        className="research-footer"
        style={{
          borderTop:
            '1px solid #E2E8F0',
          marginTop: '4rem',
          paddingTop: '2rem',
          paddingBottom: '1rem',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: '#64748B'
        }}
      >

        <p
          style={{
            fontWeight: 700,
            color: '#1E3A8A',
            margin: 0
          }}
        >
          {RESEARCH_DATA.meta.institution}
          {' ('}
          {RESEARCH_DATA.meta.institutionArabic}
          {')'}
        </p>

        <p
          style={{
            margin:
              '0.25rem 0 0'
          }}
        >
          {RESEARCH_DATA.meta.college}
          {' — '}
          {RESEARCH_DATA.meta.department}
        </p>

        <p
          style={{
            margin:
              '0.25rem 0 0',
            color: '#94A3B8'
          }}
        >
          B.Sc. Graduation Research Project
          {' • '}
          {RESEARCH_DATA.meta.academicYear}
        </p>

      </footer>

    </div>
  );
}