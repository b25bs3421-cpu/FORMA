import { ParsedDocument, chunkText, estimateWordCount } from './documentParser';

export interface SampleCorpus {
  id: string;
  title: string;
  category: string;
  description: string;
  documents: ParsedDocument[];
  sampleQuestions: {
    grounded: { query: string; expectedAnswer: string; targetDoc: string }[];
    notCovered: { query: string; whyMissing: string }[];
  };
}

// Helper to create parsed document with chunks
function createSampleDoc(
  id: string,
  name: string,
  type: ParsedDocument['type'],
  rawText: string
): ParsedDocument {
  const chunks = chunkText(id, name, rawText, 200, 30);
  return {
    id,
    name,
    type,
    size: rawText.length,
    wordCount: estimateWordCount(rawText),
    rawText,
    chunks,
    createdAt: new Date().toISOString(),
    isActive: true,
  };
}

export const SAMPLE_CORPORA: SampleCorpus[] = [
  {
    id: 'spaceflight-propulsion',
    title: 'Deep Space Mission Architecture & Life Support',
    category: 'Aerospace Engineering',
    description: 'Technical specifications for crewed deep-space transits, nuclear thermal propulsion stages, and ECLSS life support loops.',
    documents: [
      createSampleDoc(
        'doc-space-1',
        'Orion_ECLSS_LifeSupport_Subsystem.md',
        'markdown',
        `# Orion Environmental Control & Life Support System (ECLSS) Specifications
Document ID: NASA-SPEC-ECLSS-2026-B
Applicability: Deep Space Crewed Missions (Artemis IV+)

## 1. Atmosphere Revitalization Loop
The Orion ECLSS maintains a nominal cabin pressure of 101.3 kPa (14.7 psia) with an oxygen partial pressure between 20.7 and 23.4 kPa. Carbon dioxide removal is governed by a regenerative Amine Thermal Swing Adsorption (ATSA) bed. The system limits cabin CO2 partial pressure to below 0.4 kPa (3.0 mmHg) during active crew metabolism (4 astronauts at 2,800 kcal/day).

## 2. Water Recovery and Hydration
Nominal water consumption is rationed at 2.8 liters per crew member per day for hydration and food reconstitution. The Urine Processor Assembly (UPA) recovers 85% of crew urine via vapor compression distillation. The remaining distillate passes through multi-filtration beds and catalytic oxidizers to achieve potable standards: total organic carbon (TOC) must remain under 100 parts per billion (ppb).

## 3. Nitrogen Recharge and Depressurization Reserve
A dual high-pressure nitrogen storage assembly provides 48.0 kg of supercritical N2 at 20.7 MPa (3,000 psia) for cabin repressurization. In the event of a micrometeoroid puncture with an equivalent hole diameter up to 6.35 mm, the emergency nitrogen feed guarantees 45 minutes of habitable pressure to allow the crew to don pressurized survival suits.`
      ),
      createSampleDoc(
        'doc-space-2',
        'Nuclear_Thermal_Propulsion_Stage.txt',
        'text',
        `PROJECT DRACO: NUCLEAR THERMAL PROPULSION (NTP) FLIGHT DEMONSTRATOR
TECHNICAL OPERATING PARAMETERS - REVISION 4.2

1. CORE REACTOR SPECIFICATIONS:
The NTP stage incorporates a high-assay low-enriched uranium (HALEU) ceramic-metallic (cermet) core enriched to 19.75% U-235. The reactor thermal power rating is 500 MWt. The core uses zirconium carbide (ZrC) coated fuel kernels embedded in a tungsten-rhenium matrix capable of withstanding hydrogen propellant temperatures up to 2,750 Kelvin.

2. SPECIFIC IMPULSE AND THRUST PERFORMANCE:
- Vacuum Thrust: 111 kN (25,000 lbf)
- Vacuum Specific Impulse (Isp): 900 seconds (minimum threshold: 885 seconds)
- Propellant: Ultra-cold Liquid Hydrogen (LH2) stored at 20.2 K (-252.9°C)
- Turbopump Speed: 62,000 RPM delivering 12.8 kg/sec of LH2 to the regenerative nozzle jacket.

3. ZERO-BOIL-OFF (ZBO) CRYOGENIC CRYOCAMP:
To prevent propellant mass depletion during the 180-day transit to Mars, the LH2 tanks are insulated with 60 layers of multi-layer insulation (MLI) coupled with a 20 K reverse-Brayton active cryocooler consuming 450 W of electrical power from the auxiliary solar-electric bus.`
      ),
      createSampleDoc(
        'doc-space-3',
        'Lunar_Gateway_Optical_Communications.json',
        'json',
        `{
  "system": "Lunar Gateway Optical & Ka-Band Telecommunications",
  "document_reference": "GW-COMMS-REV-C",
  "optical_terminal": {
    "laser_wavelength_nm": 1550,
    "transmitter_power_watts": 10,
    "downlink_data_rate_mbps": 1200,
    "uplink_data_rate_mbps": 100,
    "ground_station_targets": ["Table Mountain, California", "Tenerife Optical Ground Station, Spain"],
    "pointing_accuracy_microradians": 3.5
  },
  "rf_backup_system": {
    "band": "Ka-band deep space",
    "frequency_ghz": 32.05,
    "high_gain_antenna_diameter_meters": 1.8,
    "nominal_throughput_mbps": 40
  },
  "orbital_geometry": {
    "orbit_type": "Near-Rectilinear Halo Orbit (NRHO)",
    "perilune_altitude_km": 3000,
    "apolune_altitude_km": 70000,
    "orbital_period_days": 6.56
  }
}`
      ),
    ],
    sampleQuestions: {
      grounded: [
        {
          query: 'What is the specific impulse and propellant temperature of the Nuclear Thermal Propulsion stage?',
          expectedAnswer: 'Vacuum Specific Impulse is 900 seconds (minimum 885s) with LH2 propellant temperatures up to 2,750 Kelvin.',
          targetDoc: 'Nuclear_Thermal_Propulsion_Stage.txt',
        },
        {
          query: 'How much water is rationed per crew member daily in the Orion ECLSS, and what is the TOC potable water limit?',
          expectedAnswer: '2.8 liters per crew member per day; Total Organic Carbon (TOC) must remain below 100 ppb.',
          targetDoc: 'Orion_ECLSS_LifeSupport_Subsystem.md',
        },
        {
          query: 'What data rates does the Lunar Gateway optical laser communications terminal achieve?',
          expectedAnswer: '1200 Mbps downlink and 100 Mbps uplink at 1550 nm laser wavelength.',
          targetDoc: 'Lunar_Gateway_Optical_Communications.json',
        },
      ],
      notCovered: [
        {
          query: 'What is the total financial budget and contractor cost allocated for the Artemis V launch vehicle?',
          whyMissing: 'The documents only contain engineering specs, life support physics, and communication telemetry. No budget, contract values, or cost figures exist in the corpus.',
        },
        {
          query: 'What are the emergency medical protocols for treating astronaut radiation sickness during solar flares?',
          whyMissing: 'The ECLSS document only covers atmosphere revitalization, water recovery, and nitrogen puncture reserves; medical pharmacological protocols are not mentioned.',
        },
      ],
    },
  },
  {
    id: 'cloud-infrastructure-sla',
    title: 'Enterprise Cloud SLA & Security Architecture',
    category: 'Cloud Engineering & Compliance',
    description: 'Contractual uptime guarantees, multi-region disaster recovery RTO/RPO limits, and Zero-Trust cryptographic policy.',
    documents: [
      createSampleDoc(
        'doc-cloud-1',
        'Enterprise_Cloud_SLA_Uptime_Guarantees.md',
        'markdown',
        `# Enterprise Service Level Agreement (SLA) & Availability Policy
Document Version: 2026.1 | Applicable to Tier-4 Enterprise Contracts

## 1. Monthly Uptime Percentage Commitments
The Service Provider guarantees a Monthly Uptime Percentage of at least 99.95% for multi-region active-active deployments across designated Availability Zones.
- Monthly Uptime >= 99.95%: Normal operation (No SLA credit).
- Monthly Uptime 99.00% to 99.94%: 10% Service Credit applied to monthly invoice.
- Monthly Uptime 95.00% to 98.99%: 25% Service Credit.
- Monthly Uptime < 95.00%: 100% Service Credit.

## 2. Exclusions from Downtime Calculations
Downtime explicitly excludes:
a) Scheduled maintenance announced at least 7 calendar days in advance, conducted exclusively during the Sunday Maintenance Window (02:00 UTC to 04:00 UTC).
b) Denial of Service (DDoS) volumetric attacks exceeding 500 Gbps where tenant failed to enable Cloud Armor DDoS Shielding.
c) Tenant-initiated configuration errors or upstream internet peering failures.`
      ),
      createSampleDoc(
        'doc-cloud-2',
        'Disaster_Recovery_RTO_RPO_Policy.txt',
        'text',
        `ENTERPRISE DISASTER RECOVERY & CONTINUITY POLICY
CLASSIFICATION: CONFIDENTIAL - AUDIT CERTIFIED ISO 22301

1. RECOVERY TIME OBJECTIVE (RTO):
- Tier-1 Mission Critical Services (Payment Processing, Identity Federation): Maximum RTO is 15 minutes. Failover must be triggered automatically via global health probes.
- Tier-2 Business Operations (Analytics, Batch ETL): Maximum RTO is 4 hours.
- Tier-3 Archival Services: Maximum RTO is 24 hours.

2. RECOVERY POINT OBJECTIVE (RPO):
- Tier-1 Services: Maximum RPO is 60 seconds (1 minute). All transactional writes require synchronous replication across at least 2 distinct Availability Zones separated by >= 25 km.
- Tier-2 Services: Maximum RPO is 15 minutes via asynchronous snapshot streaming.

3. ANNUAL AUDIT & RESILIENCY TESTING:
Mandatory unannounced disaster simulation exercises are conducted bi-annually. The system must demonstrate cold-region reconstitution within the stipulated RTO thresholds.`
      ),
      createSampleDoc(
        'doc-cloud-3',
        'Zero_Trust_Encryption_Policy.json',
        'json',
        `{
  "policy": "Zero-Trust Cryptographic Standard",
  "document_id": "SEC-CIPHER-2026",
  "encryption_at_rest": {
    "algorithm": "AES-256-GCM",
    "key_management": "Dedicated Cloud KMS with FIPS 140-3 Level 3 Hardware Security Modules (HSMs)",
    "key_rotation_interval_days": 90,
    "envelope_encryption": true
  },
  "encryption_in_transit": {
    "protocols_allowed": ["TLS 1.3"],
    "deprecated_protocols": ["TLS 1.0", "TLS 1.1", "TLS 1.2"],
    "cipher_suites": [
      "TLS_AES_256_GCM_SHA384",
      "TLS_CHACHA20_POLY1305_SHA256"
    ],
    "mutual_tls_mTLS": "Mandatory for all inter-service mesh microservice calls"
  }
}`
      ),
    ],
    sampleQuestions: {
      grounded: [
        {
          query: 'What is the guaranteed Monthly Uptime Percentage and what service credit is issued if uptime drops below 95%?',
          expectedAnswer: 'Guaranteed uptime is 99.95%. If uptime drops below 95.00%, a 100% Service Credit is issued.',
          targetDoc: 'Enterprise_Cloud_SLA_Uptime_Guarantees.md',
        },
        {
          query: 'What are the specific RTO and RPO limits for Tier-1 Mission Critical Services?',
          expectedAnswer: 'Tier-1 services require a maximum RTO of 15 minutes and a maximum RPO of 60 seconds (1 minute).',
          targetDoc: 'Disaster_Recovery_RTO_RPO_Policy.txt',
        },
        {
          query: 'What encryption algorithm and key rotation interval are mandated for data at rest?',
          expectedAnswer: 'AES-256-GCM encryption with a 90-day key rotation interval using FIPS 140-3 Level 3 HSMs.',
          targetDoc: 'Zero_Trust_Encryption_Policy.json',
        },
      ],
      notCovered: [
        {
          query: 'How much discount can a customer negotiate for committing to a 3-year upfront payment?',
          whyMissing: 'The documents only define technical SLAs, downtime exclusions, RTO/RPO limits, and cryptographic cipher suites. Sales discounts or commercial pricing are not covered.',
        },
        {
          query: 'What are the severance packages and HR compensation tiers for cloud security engineers?',
          whyMissing: 'The materials are purely technical infrastructure policies and contain no human resources or personnel data.',
        },
      ],
    },
  },
  {
    id: 'clinical-trial-protocol',
    title: 'Phase III Neuro-Therapeutic Clinical Protocol',
    category: 'Biomedical & Clinical Trials',
    description: 'Investigational compound NTX-402 dosing regimens, patient exclusion criteria, and mandatory toxicity stopping rules.',
    documents: [
      createSampleDoc(
        'doc-clinic-1',
        'Phase_III_Clinical_Protocol_NTX402.md',
        'markdown',
        `# Investigational New Drug Protocol: NTX-402
Study Protocol: NTX-NEURO-301 | Phase III Double-Blind Placebo-Controlled Study

## 1. Study Population & Inclusion Criteria
Candidates must meet all of the following baseline parameters:
1. Age 50 to 78 years inclusive at the time of written informed consent.
2. Documented diagnosis of Mild Cognitive Impairment (MCI) or early-stage neurodegenerative decline with Mini-Mental State Examination (MMSE) score between 22 and 27 inclusive.
3. Positron Emission Tomography (PET) scan demonstrating positive amyloid-beta plaque deposition.

## 2. Exclusion Criteria
Patients are excluded if presenting:
a) History of unmanaged major depressive disorder or psychosis within the past 24 months.
b) Severe renal impairment characterized by estimated Glomerular Filtration Rate (eGFR) < 30 mL/min/1.73m2.
c) Concurrent administration of acetylcholinesterase inhibitors unless established on a stable dose for >= 120 days prior to baseline.

## 3. Investigational Dosing Regimen
Enrolled participants are randomized 1:1 to receive:
- Cohort A (Active): 30 mg NTX-402 administered orally once daily (QD) with a morning meal.
- Cohort B (Placebo): Matched microcrystalline cellulose placebo tablet QD.
Primary efficacy endpoint is evaluated at Week 48 using the ADAS-Cog14 cognitive score change from baseline.`
      ),
      createSampleDoc(
        'doc-clinic-2',
        'Toxicity_and_Safety_Stopping_Rules.txt',
        'text',
        `SAFETY MONITORING & ADVERSE EVENT HALTING RULES
PROTOCOL REFERENCE: IND-SAFETY-GUIDELINE-REV-2

1. HEPATIC FUNCTION HALTING THRESHOLDS:
Immediate individual patient dosing suspension is mandatory if:
- Alanine Aminotransferase (ALT) or Aspartate Aminotransferase (AST) exceeds 3.0x Upper Limit of Normal (ULN) accompanied by total bilirubin > 2.0x ULN.
- ALT/AST exceeds 5.0x ULN regardless of bilirubin levels.

2. CARDIOVASCULAR SAFETY GATE:
Serial 12-lead Electrocardiograms (ECGs) are performed at weeks 2, 4, 12, 24, and 48.
If Fridericia-corrected QT interval (QTcF) exceeds 500 milliseconds (ms) or shows a baseline increase > 60 ms, study drug administration must be withheld and repeat testing performed within 2 hours.

3. DATA SAFETY MONITORING BOARD (DSMB) INDEPENDENCE:
An unblinded independent DSMB audits patient safety data quarterly. If active group serious adverse events (SAEs) exceed placebo rate by a hazard ratio > 1.8 with p < 0.01, trial suspension is automatically triggered.`
      ),
    ],
    sampleQuestions: {
      grounded: [
        {
          query: 'What are the age limits and MMSE score requirements for enrolling in the NTX-402 trial?',
          expectedAnswer: 'Age 50 to 78 years inclusive, with an MMSE score between 22 and 27 inclusive.',
          targetDoc: 'Phase_III_Clinical_Protocol_NTX402.md',
        },
        {
          query: 'Under what specific liver enzyme thresholds must patient dosing be immediately suspended?',
          expectedAnswer: 'Dosing is suspended if ALT or AST exceeds 3.0x ULN with bilirubin > 2.0x ULN, or ALT/AST exceeds 5.0x ULN alone.',
          targetDoc: 'Toxicity_and_Safety_Stopping_Rules.txt',
        },
      ],
      notCovered: [
        {
          query: 'What retail pharmacy price and insurance reimbursement co-pay will NTX-402 have upon FDA approval?',
          whyMissing: 'The documents only cover clinical trial protocol, safety stopping rules, and inclusion criteria. Post-approval market pricing is not included.',
        },
      ],
    },
  },
];
