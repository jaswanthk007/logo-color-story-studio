export type PlatformId = "olx" | "99acres" | "magicbricks" | "housing" | "meta" | "google" | "instagram" | "linkedin" | "custom";

export const platforms: Record<PlatformId, { name: string; short: string; category: "Marketplace" | "Advertising" | "Social" | "Custom"; hue: number }> = {
  olx: { name: "OLX", short: "OX", category: "Marketplace", hue: 200 },
  "99acres": { name: "99acres", short: "99", category: "Marketplace", hue: 250 },
  magicbricks: { name: "Magicbricks", short: "MB", category: "Marketplace", hue: 20 },
  housing: { name: "Housing.com", short: "HC", category: "Marketplace", hue: 300 },
  meta: { name: "Meta", short: "Me", category: "Advertising", hue: 255 },
  google: { name: "Google Ads", short: "G", category: "Advertising", hue: 140 },
  instagram: { name: "Instagram", short: "IG", category: "Social", hue: 340 },
  linkedin: { name: "LinkedIn", short: "in", category: "Social", hue: 230 },
  custom: { name: "Webhook / Custom", short: "C", category: "Custom", hue: 290 },
};

export type ListingStatus = "Active" | "Draft" | "Paused" | "Archived";
export type SyncStatus = "Synced" | "Syncing" | "Partial" | "Failed" | "Not Published";

export interface Listing {
  id: string; title: string; category: string; location: string; price: number;
  status: ListingStatus; sync: SyncStatus; platforms: PlatformId[];
  views: number; leads: number; spend: number; conversion: number; updated: string; created: string; hue: number;
}

const titles: [string, string, string][] = [
  ["3BHK Lake View Apartment", "Real Estate", "Powai, Mumbai"],
  ["Premium Co-living PG for Women", "PG / Rental", "Koramangala, Bengaluru"],
  ["2022 Hyundai Creta SX(O)", "Automobile", "Gurugram"],
  ["Senior Frontend Engineer – Hiring", "Recruitment", "Remote / Pune"],
  ["Boutique Hotel Weekend Package", "Hotels", "Calangute, Goa"],
  ["Commercial Office Space 2,400 sq ft", "Real Estate", "BKC, Mumbai"],
  ["Studio Apartment Near Metro", "PG / Rental", "Indiranagar, Bengaluru"],
  ["Maruti Swift VXI – Single Owner", "Automobile", "Noida"],
  ["Interior Design Consultation", "Professional Services", "Hyderabad"],
  ["4BHK Villa with Private Pool", "Real Estate", "Whitefield, Bengaluru"],
  ["Festive Ethnic Wear Collection", "Retail", "Jaipur"],
  ["Sales Executive – Field Role", "Recruitment", "Ahmedabad"],
  ["1BHK Furnished Rental", "PG / Rental", "Baner, Pune"],
  ["Toyota Fortuner Legender 4x4", "Automobile", "Chandigarh"],
  ["Heritage Haveli Stay – 3 Nights", "Hotels", "Udaipur"],
  ["Retail Shop on High Street", "Real Estate", "Sector 29, Gurugram"],
  ["CA & Tax Filing Services", "Professional Services", "Delhi"],
  ["Smart Home Appliance Bundle", "Retail", "Chennai"],
  ["2BHK Gated Society Flat", "Real Estate", "Kharadi, Pune"],
  ["Shared Room PG – Meals Included", "PG / Rental", "HSR Layout, Bengaluru"],
  ["Mahindra XUV700 AX7", "Automobile", "Lucknow"],
  ["Plot 1,200 sq yd – Clear Title", "Real Estate", "Shamshabad, Hyderabad"],
  ["Data Analyst – Immediate Joiner", "Recruitment", "Bengaluru"],
  ["Beachfront Resort Honeymoon Deal", "Hotels", "Havelock, Andaman"],
];
const statuses: ListingStatus[] = ["Active", "Active", "Active", "Draft", "Paused", "Active", "Archived", "Active"];
const syncs: SyncStatus[] = ["Synced", "Synced", "Syncing", "Partial", "Synced", "Failed", "Synced", "Not Published"];
const platSets: PlatformId[][] = [["olx", "99acres", "meta"], ["housing", "instagram"], ["olx", "google"], ["linkedin", "google"], ["meta", "instagram", "google"], ["99acres", "magicbricks", "linkedin"], ["housing", "olx"], ["olx", "meta"]];

export const listings: Listing[] = titles.map(([title, category, location], i) => {
  const status = statuses[i % statuses.length];
  const views = Math.round(2400 + ((i * 7919) % 26000));
  const leads = Math.round(views * (0.018 + ((i * 13) % 20) / 1000));
  return {
    id: `LST-${1040 + i}`, title, category, location,
    price: [8500000, 14000, 1450000, 2800000, 18500, 32000000][i % 6],
    status, sync: status === "Draft" ? "Not Published" : syncs[i % syncs.length],
    platforms: platSets[i % platSets.length], views, leads,
    spend: Math.round(400 + ((i * 3571) % 4200)),
    conversion: +(8 + ((i * 17) % 120) / 10).toFixed(1),
    updated: `${(i % 9) + 1}h ago`, created: `${(i % 27) + 1} Sep 2026`, hue: (i * 47) % 360,
  };
});

export type CampaignStatus = "Active" | "Scheduled" | "Paused" | "Completed" | "Draft";
export interface Campaign { id: string; name: string; platform: PlatformId; status: CampaignStatus; budget: number; spend: number; impressions: number; clicks: number; leads: number; conversions: number; objective: string; start: string; end: string }
const cNames = ["Diwali Home Fest", "Lake View Retargeting", "Co-living Awareness Q4", "SUV Test Drive Drive", "Hiring – Tech Talent", "Goa Weekend Escapes", "Office Space B2B Push", "Festive Retail Sale", "Lead Gen – Villas", "Brand Search – Core", "PG Students Bengaluru", "Used Car Clearance", "Year End Hotel Deals", "Pune Rentals Carousel"];
const cPlat: PlatformId[] = ["meta", "google", "instagram", "google", "linkedin", "meta", "linkedin", "instagram", "meta", "google", "instagram", "meta", "google", "meta"];
const cStat: CampaignStatus[] = ["Active", "Active", "Scheduled", "Active", "Paused", "Completed", "Active", "Draft", "Active", "Active", "Paused", "Completed", "Scheduled", "Active"];
export const campaigns: Campaign[] = cNames.map((name, i) => {
  const budget = [50000, 30000, 25000, 40000, 60000, 20000, 45000][i % 7];
  const spend = cStat[i] === "Draft" || cStat[i] === "Scheduled" ? 0 : Math.round(budget * (0.35 + ((i * 11) % 60) / 100));
  const impressions = spend * 31 + 1200 * i;
  const clicks = Math.round(impressions * (0.012 + (i % 5) / 400));
  const leads = Math.round(clicks * (0.06 + (i % 4) / 100));
  return { id: `CMP-${210 + i}`, name, platform: cPlat[i], status: cStat[i], budget, spend, impressions, clicks, leads, conversions: Math.round(leads * 0.18), objective: ["Lead generation", "Traffic", "Awareness", "Conversions"][i % 4], start: `${(i % 20) + 1} Oct 2026`, end: `${(i % 20) + 8} Nov 2026` };
});

export const team = [
  { id: "u1", name: "Rohit Sharma", email: "rohit@ravyu.in", role: "Owner", status: "Active", last: "Online", leads: 42 },
  { id: "u2", name: "Ananya Iyer", email: "ananya@ravyu.in", role: "Admin", status: "Active", last: "12m ago", leads: 88 },
  { id: "u3", name: "Karan Mehta", email: "karan@ravyu.in", role: "Marketing Manager", status: "Active", last: "1h ago", leads: 31 },
  { id: "u4", name: "Sneha Kulkarni", email: "sneha@ravyu.in", role: "Sales", status: "Active", last: "3h ago", leads: 126 },
  { id: "u5", name: "Arjun Nair", email: "arjun@ravyu.in", role: "Sales", status: "Active", last: "Yesterday", leads: 104 },
  { id: "u6", name: "Priya Desai", email: "priya@ravyu.in", role: "Analyst", status: "Active", last: "2d ago", leads: 0 },
  { id: "u7", name: "Vikram Singh", email: "vikram@ravyu.in", role: "Viewer", status: "Invited", last: "—", leads: 0 },
];

export type LeadStatus = "New" | "Contacted" | "Qualified" | "Converted" | "Lost";
const fn = ["Aditya", "Meera", "Rahul", "Pooja", "Siddharth", "Neha", "Farhan", "Kavya", "Manish", "Ishita", "Varun", "Divya", "Harsh", "Tanvi", "Nikhil", "Riya", "Sameer", "Aisha", "Gaurav", "Simran"];
const ln = ["Verma", "Rao", "Kapoor", "Joshi", "Bose", "Malhotra", "Khan", "Reddy", "Gupta", "Pillai"];
const lStat: LeadStatus[] = ["New", "Contacted", "Qualified", "New", "Converted", "Contacted", "Lost", "Qualified", "New"];
export const leads = Array.from({ length: 36 }, (_, i) => {
  const name = `${fn[i % fn.length]} ${ln[(i * 3) % ln.length]}`;
  const listing = listings[(i * 5) % listings.length];
  const campaign = campaigns[(i * 3) % campaigns.length];
  return {
    id: `LD-${5300 + i}`, name, phone: `+91 98${(10000000 + i * 734521) % 100000000}`.slice(0, 14),
    email: `${name.toLowerCase().replace(" ", ".")}@gmail.com`,
    source: (["meta", "99acres", "olx", "google", "instagram", "housing"] as PlatformId[])[i % 6],
    listing: listing.title, campaign: campaign.name, status: lStat[i % lStat.length],
    assignee: team[3 + (i % 3)].name, created: i < 6 ? `Today, ${9 + i}:${(i * 7) % 60 < 10 ? "0" : ""}${(i * 7) % 60}` : `${(i % 24) + 1} Oct`,
    last: `${(i % 11) + 1}h ago`, tags: [["Hot", "Site visit"], ["Budget fit"], ["Follow-up"], ["NRI"], []][i % 5],
  };
});

export const channels = (Object.keys(platforms) as PlatformId[]).map((id, i) => ({
  id, ...platforms[id],
  connected: id !== "custom" && id !== "linkedin" ? true : id === "linkedin",
  health: id === "magicbricks" ? "Needs attention" : id === "linkedin" ? "Expired" : "Healthy",
  account: id === "custom" ? "—" : `ravyu-${id}@business`,
  lastSync: id === "custom" ? "—" : `${(i % 5) + 2}m ago`,
  items: id === "custom" ? 0 : 18 + ((i * 37) % 120),
}));

export const series = Array.from({ length: 30 }, (_, i) => {
  const d = i + 1;
  const base = 3200 + Math.sin(i / 3) * 600 + i * 40;
  return { day: `${d} Oct`, views: Math.round(base + ((i * 97) % 500)), leads: Math.round(base / 36 + ((i * 7) % 30)), spend: Math.round(1100 + Math.cos(i / 4) * 250 + i * 12), conversions: Math.round(base / 200 + (i % 6)), prevViews: Math.round(base * 0.84) };
});

export const notifications = [
  { id: 1, cat: "Leads", title: "New enquiry received", body: "Meera Rao enquired about 3BHK Lake View Apartment via 99acres.", time: "2m ago", unread: true },
  { id: 2, cat: "Synchronization", title: "Listing synchronization failed", body: "3 listings couldn't be synchronized to Magicbricks — missing RERA ID.", time: "18m ago", unread: true },
  { id: 3, cat: "Campaigns", title: "Campaign budget threshold reached", body: "Diwali Home Fest has spent 90% of its ₹50,000 budget.", time: "1h ago", unread: true },
  { id: 4, cat: "System", title: "Platform disconnected", body: "LinkedIn connection expired. Reconnect to resume campaigns.", time: "3h ago", unread: false },
  { id: 5, cat: "Automation", title: "Automation completed", body: "Pause Low Performing Campaign paused 2 campaigns.", time: "5h ago", unread: false },
  { id: 6, cat: "Listings", title: "Listing published", body: "Toyota Fortuner Legender is live on OLX and Google.", time: "Yesterday", unread: false },
  { id: 7, cat: "Leads", title: "Lead converted", body: "Sneha marked Rahul Kapoor as Converted.", time: "Yesterday", unread: false },
];

export const rules = [
  { id: "r1", name: "Pause Low Performing Campaign", trigger: "No leads for 7 days", conditions: "Spend > ₹2,000", action: "Pause campaign", scope: "All Meta campaigns", active: true, last: "5h ago", runs: 42 },
  { id: "r2", name: "Publish New Listings", trigger: "New listing created", conditions: "Status = Active", action: "Publish to selected channels", scope: "Real Estate listings", active: true, last: "1h ago", runs: 118 },
  { id: "r3", name: "Lead Notification", trigger: "New enquiry received", conditions: "Any source", action: "Notify assigned member", scope: "All leads", active: true, last: "2m ago", runs: 3482 },
  { id: "r4", name: "Budget Alert", trigger: "Spend exceeds ₹5,000/day", conditions: "Campaign active", action: "Notify team", scope: "All campaigns", active: true, last: "Yesterday", runs: 9 },
  { id: "r5", name: "Auto-assign Hot Leads", trigger: "Lead tagged Hot", conditions: "Source = 99acres", action: "Assign to Sneha Kulkarni", scope: "Real Estate", active: false, last: "4d ago", runs: 61 },
  { id: "r6", name: "Retry Failed Syncs", trigger: "Sync failed", conditions: "Retries < 3", action: "Retry after 15 min", scope: "All channels", active: true, last: "18m ago", runs: 27 },
];

export const activity = [
  { who: "Sneha Kulkarni", what: "converted lead Rahul Kapoor", when: "12m ago" },
  { who: "Automation", what: "paused campaign Used Car Clearance", when: "1h ago" },
  { who: "Karan Mehta", what: "published 4BHK Villa with Private Pool to 3 channels", when: "2h ago" },
  { who: "System", what: "sync failed for 3 listings on Magicbricks", when: "3h ago" },
  { who: "Ananya Iyer", what: "invited Vikram Singh as Viewer", when: "Yesterday" },
];

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
export const fmt = (n: number) => n.toLocaleString("en-IN");
export const compact = (n: number) => (n >= 100000 ? (n / 100000).toFixed(1) + "L" : n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n));
