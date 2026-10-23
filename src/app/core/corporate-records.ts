import type { ArchiveFile } from './models';

/** Explicit public projection approved for Implementation 01. Never import the writer JSON into runtime. */
export interface PublicEmployee { readonly id: string; readonly name: string; readonly department: string; readonly role: string; readonly dates: string; readonly profile: string }
export const PUBLIC_PERSONNEL: readonly PublicEmployee[] = [
  {
    "id": "P001",
    "name": "Dr. Ruth Calder",
    "department": "Leadership",
    "role": "Co-founder; former Medical Director",
    "dates": "1984–1999",
    "profile": "Helped found Meridian in 1984. Oversaw medical standards and early rehabilitation research; retired from daily management in 1999."
  },
  {
    "id": "P002",
    "name": "Martin Shaw",
    "department": "Leadership",
    "role": "Co-founder; former Systems Director",
    "dates": "1984–2000",
    "profile": "Co-founded Meridian and oversaw development of its internal computing and service-management systems."
  },
  {
    "id": "P003",
    "name": "Daniel Price",
    "department": "Executive",
    "role": "Acting Chief Executive",
    "dates": "2001–present",
    "profile": "Leads Meridian's reduced commercial and support operations following the restructuring."
  },
  {
    "id": "P004",
    "name": "Helen Mercer",
    "department": "Finance",
    "role": "Finance Director",
    "dates": "1992–present",
    "profile": "Responsible for budgets, contracts, insurance administration and monthly financial reporting."
  },
  {
    "id": "P005",
    "name": "Caroline Fitch",
    "department": "Legal",
    "role": "Corporate Counsel",
    "dates": "1995–present",
    "profile": "Handles liability, licensing terms, former research agreements and clinical-support contracts."
  },
  {
    "id": "P006",
    "name": "Julian Kell",
    "department": "Administration",
    "role": "Former Administration Supervisor",
    "dates": "1993–2001",
    "profile": "Coordinated facility and service closures during the 2001 consolidation."
  },
  {
    "id": "P007",
    "name": "Evelyn Lin",
    "department": "Operations",
    "role": "Former Operations Coordinator",
    "dates": "1996–2001",
    "profile": "Maintained shift schedules, operator assignments and unresolved communications requests."
  },
  {
    "id": "P008",
    "name": "Lydia Brooks",
    "department": "Human Resources",
    "role": "Human Resources Coordinator",
    "dates": "1997–present",
    "profile": "Processes staff changes and maintains the ordinary work directory."
  },
  {
    "id": "P009",
    "name": "Peter Duarte",
    "department": "Contracts",
    "role": "Contracts Administrator",
    "dates": "2000–present",
    "profile": "Maintains support-contract renewals and standard customer records."
  },
  {
    "id": "P010",
    "name": "Maya Singh",
    "department": "Procurement",
    "role": "Procurement Officer",
    "dates": "1998–present",
    "profile": "Coordinates suppliers, equipment orders and contract deliveries."
  },
  {
    "id": "P011",
    "name": "Brent Holloway",
    "department": "Finance",
    "role": "Payroll Clerk",
    "dates": "1999–present",
    "profile": "Supports payroll processing for Meridian's reduced workforce."
  },
  {
    "id": "P012",
    "name": "Teresa Walsh",
    "department": "Facilities",
    "role": "Former Reception Supervisor",
    "dates": "1988–2001",
    "profile": "Supervised the Providence Operations Annex reception desk until its closure."
  },
  {
    "id": "P013",
    "name": "Oliver Ames",
    "department": "Records",
    "role": "Records Archivist",
    "dates": "1996–present",
    "profile": "Maintains legacy document indexing and retention schedules."
  },
  {
    "id": "P014",
    "name": "Samuel Ortiz",
    "department": "Customer Support",
    "role": "Customer Support Manager",
    "dates": "1993–present",
    "profile": "Leads support for older Meridian clinical and rehabilitation equipment."
  },
  {
    "id": "P015",
    "name": "Nina Park",
    "department": "Engineering",
    "role": "Medical Equipment Engineer",
    "dates": "1995–present",
    "profile": "Works on calibration, spare-part compatibility and approved software maintenance for legacy devices."
  },
  {
    "id": "P016",
    "name": "Owen Keller",
    "department": "Quality Assurance",
    "role": "QA Technician",
    "dates": "2000–present",
    "profile": "Performs routine verification of refurbished equipment and service records."
  },
  {
    "id": "P017",
    "name": "Rafael Costa",
    "department": "Field Support",
    "role": "Field-Service Engineer",
    "dates": "1996–present",
    "profile": "Visits hospitals and equipment customers for scheduled inspections."
  },
  {
    "id": "P018",
    "name": "Naomi Reed",
    "department": "Customer Support",
    "role": "Service Scheduling Coordinator",
    "dates": "1998–present",
    "profile": "Schedules maintenance calls and maintains rotating coverage rosters."
  },
  {
    "id": "P019",
    "name": "Leah Morgan",
    "department": "Parts",
    "role": "Warehouse and Parts Coordinator",
    "dates": "1997–present",
    "profile": "Coordinates equipment replacement parts, storage and shipping."
  },
  {
    "id": "P020",
    "name": "Victor Chen",
    "department": "Information Systems",
    "role": "Network Administrator",
    "dates": "1997–present",
    "profile": "Maintains Meridian's surviving office networks and remote service accounts."
  },
  {
    "id": "P021",
    "name": "Miles Harper",
    "department": "Communications",
    "role": "Former Communications Technician",
    "dates": "1993–2000",
    "profile": "Installed and documented old dial-up, telephone-extension and service bridges."
  },
  {
    "id": "P022",
    "name": "Gina Valdez",
    "department": "Documentation",
    "role": "Technical Documentation Editor",
    "dates": "1999–present",
    "profile": "Updates ordinary service guides, parts sheets and manuals."
  },
  {
    "id": "P023",
    "name": "Thomas Keene",
    "department": "Facilities",
    "role": "Former Facilities Manager",
    "dates": "1990–2002",
    "profile": "Oversaw building access, inspections and site handovers during consolidation."
  },
  {
    "id": "P024",
    "name": "Andrew Bell",
    "department": "Workshop",
    "role": "Equipment Repair Technician",
    "dates": "1998–present",
    "profile": "Repairs returned legacy clinical monitoring units."
  },
  {
    "id": "P025",
    "name": "Anna Voss",
    "department": "Research",
    "role": "Head Researcher, Advanced Neural Interfaces",
    "dates": "1989–1996",
    "profile": "Led Meridian's Advanced Neural Interfaces research program. Recorded responsibilities include experimental interface design and team leadership."
  },
  {
    "id": "P026",
    "name": "Dr. Miriam Rao",
    "department": "Clinical Research",
    "role": "Clinical Research Physician",
    "dates": "1992–1998",
    "profile": "Served as a physician on Meridian neurological-interface research programs."
  },
  {
    "id": "P027",
    "name": "Elias Hart",
    "department": "Research Engineering",
    "role": "Lead Systems Architect",
    "dates": "1990–1999",
    "profile": "Designed experimental interface integration and analysis pipelines."
  },
  {
    "id": "P028",
    "name": "Dr. Iris Bell",
    "department": "Neuroscience",
    "role": "Neuroscience Researcher",
    "dates": "1991–1997",
    "profile": "Studied sensory encoding, rehabilitative stimulation and measurement procedures."
  },
  {
    "id": "P029",
    "name": "Daniel Kessler",
    "department": "Bioelectronics",
    "role": "Bioelectronics Engineer",
    "dates": "1993–2000",
    "profile": "Worked on electrode arrays, signal conditioning and experimental controller testing."
  },
  {
    "id": "P030",
    "name": "Clara Weiss",
    "department": "Research Administration",
    "role": "Research Administrator",
    "dates": "1991–1998",
    "profile": "Maintained project staffing, approvals and equipment inventory for research programs."
  },
  {
    "id": "P031",
    "name": "Sophia Nadir",
    "department": "Research Compliance",
    "role": "Research Ethics Coordinator",
    "dates": "1994–1998",
    "profile": "Coordinated research documentation and internal review meetings."
  },
  {
    "id": "P032",
    "name": "Robert Vale",
    "department": "Laboratory Services",
    "role": "Former Animal-Care Technician",
    "dates": "1992–1997",
    "profile": "Supported approved preclinical animal-care operations in historical research."
  },
  {
    "id": "P033",
    "name": "Helen Wu",
    "department": "Research",
    "role": "Former Research Assistant",
    "dates": "1994–1997",
    "profile": "Assisted with data preparation, instrument checks and laboratory scheduling."
  },
  {
    "id": "P034",
    "name": "Grace Sato",
    "department": "Research Data",
    "role": "Research Statistician",
    "dates": "1993–1998",
    "profile": "Worked on analysis of rehabilitation and neural-monitoring trials."
  }
];

/** Only the four authored samples approved for this pass; no narrative reveals or permissions. */
export const CORPORATE_FILES: readonly ArchiveFile[] = [
  {
    "id": "corporate-profile",
    "path": "/ADMIN/MERIDIAN_COMPANY_PROFILE.TXT",
    "title": "Company profile",
    "modified": "1997-05-14",
    "author": "Corporate Communications",
    "provenance": "DOC-COR-01 / general company archive",
    "evidence": [],
    "body": "MERIDIAN SYSTEMS — COMPANY PROFILE\nMeridian Systems develops medical electronic equipment for clinical monitoring, rehabilitation and specialist research.\nFounded in 1984 by Dr. Ruth Calder and Martin Shaw, the company provides installation, calibration, maintenance and technical documentation to hospitals, research organizations and rehabilitation providers.\nMeridian's main administrative office is in Providence, Rhode Island. Technical engineering and calibration facilities operate in Massachusetts.\nProduct enquiries should be directed to Customer and Field Services."
  },
  {
    "id": "work-directory",
    "path": "/PERSONNEL/WORK_DIRECTORY.TXT",
    "title": "Work directory",
    "modified": "2003",
    "author": "HR records mirror",
    "provenance": "DOC-HR-01 / general work information / selected research entries",
    "evidence": [],
    "body": "HISTORICAL WORK DIRECTORY — RESEARCH / SELECTED ENTRIES\nDr. Iris Bell — Neuroscience Researcher — 1991–1997\nDaniel Kessler — Bioelectronics Engineer — 1993–2000\nClara Weiss — Research Administrator — 1991–1998\nAnna Voss — Head Researcher, Advanced Neural Interfaces — 1989–1996\nGrace Sato — Research Statistician — 1993–1998\nHelen Wu — Research Assistant — 1994–1997\n\nThis directory contains work assignments only. Private personnel and medical records are not reproduced here."
  },
  {
    "id": "annex-transfer",
    "path": "/ADMIN/ANNEX_TRANSFER_2001.TXT",
    "title": "Operations Annex transfer notice",
    "modified": "2001-09-12",
    "author": "Facilities",
    "provenance": "DOC-OFF-03 / general historical administration",
    "evidence": [],
    "body": "PROVIDENCE OPERATIONS ANNEX — OFFICE TRANSFER\nThe Providence Operations Annex will close to routine staffing on 18 September 2001. Telephone extensions and dispatch positions assigned to the annex are to be retired or reassigned.\nSupport inquiries will be handled by the Corporate Headquarters service team following the transfer.\nStaff should return keys, confirm assigned equipment inventories and submit final handover forms by the scheduled closure date.\nThis notice does not affect Meridian's remaining headquarters operations."
  },
  {
    "id": "equipment-qa",
    "path": "/OPERATIONS/LOWELL_QA_2003.TXT",
    "title": "Equipment QA report",
    "modified": "2003-11-04",
    "author": "Owen Keller",
    "provenance": "DOC-QA-03 / general technical support",
    "evidence": [],
    "body": "LOWELL — MONTHLY VERIFICATION REPORT\nDevice type: C-14 Bedside Monitor\nUnits checked: 12\nPassed: 11\nReturned for replacement component: 1\nFirmware checksum mismatch: 0\n\nNo abnormal failures were detected. Returned device ticket filed with the workshop."
  }
];

export const corporateText = (value: string): string => value.toLowerCase().replace(/[’']/g, '').replace(/[–—-]/g, ' ').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
export function findPublicPersonnel(term: string): readonly PublicEmployee[] {
  const text = corporateText(term).replace(/^(?:employees?|staff|personnel|people|work profiles?|directory)(?: (?:in|from|named|called|for))? ?/, '').replace(/^(?:the )?(?:department of|department|team) /, '').replace(/ department$/, '');
  if (!text) return PUBLIC_PERSONNEL;
  const singular = (word: string): string => word.length > 3 ? word.replace(/s$/, '') : word;
  const words = text.split(' ').filter(word => !['dr','the','and'].includes(word)).map(singular);
  return PUBLIC_PERSONNEL.filter(person => { const fields = corporateText([person.name, person.department, person.role].join(' ')).split(' ').map(singular); return words.every(word => fields.includes(word)); });
}
export const publicPersonnelLines = (people: readonly PublicEmployee[]): string[] => people.map(person => `${person.name} — ${person.role} / ${person.department} / ${person.dates}\n${person.profile}`);
