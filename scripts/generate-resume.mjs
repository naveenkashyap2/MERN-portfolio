import PDFDocument from "pdfkit";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "public", "Naveen_Kumar_Resume.pdf");
fs.mkdirSync(path.dirname(output), { recursive: true });

const doc = new PDFDocument({ size: "A4", margin: 0, info: {
  Title: "Naveen Kumar — Full Stack Developer Resume",
  Author: "Naveen Kumar",
  Subject: "Professional A4 resume",
} });
doc.pipe(fs.createWriteStream(output));

const C = {
  navy: "#0B1C2C",
  navy2: "#132B3D",
  cyan: "#18B8D5",
  ink: "#172A38",
  muted: "#5F7482",
  light: "#F1F6F8",
  line: "#D8E4E9",
  white: "#FFFFFF",
};
const W = 595.28;
const H = 841.89;
const sideW = 174;
const mainX = 198;
const mainW = W - mainX - 27;

function text(value, x, y, options = {}) {
  const { size = 8, color = C.ink, font = "Helvetica", ...rest } = options;
  doc.font(font).fontSize(size).fillColor(color).text(value, x, y, rest);
}

function sidebarTitle(value, y) {
  text(value.toUpperCase(), 22, y, { size: 7.5, color: C.cyan, font: "Helvetica-Bold", characterSpacing: 1.2 });
  doc.moveTo(22, y + 15).lineTo(150, y + 15).lineWidth(0.5).strokeColor("#BFD1D9").stroke();
  return y + 25;
}

function mainTitle(value, y) {
  text(value.toUpperCase(), mainX, y, { size: 8, color: C.cyan, font: "Helvetica-Bold", characterSpacing: 1.25 });
  doc.moveTo(mainX, y + 15).lineTo(mainX + mainW, y + 15).lineWidth(0.6).strokeColor(C.line).stroke();
  return y + 24;
}

function bullet(value, x, y, width, size = 7.45) {
  doc.circle(x + 2.2, y + 4, 1.35).fill(C.cyan);
  text(value, x + 10, y, { size, color: C.muted, width: width - 10, lineGap: 1.6 });
  return y + doc.heightOfString(value, { width: width - 10, lineGap: 1.6 }) + 4;
}

// Backgrounds
doc.rect(0, 0, W, H).fill(C.white);
doc.rect(0, 0, W, 108).fill(C.navy);
doc.rect(0, 108, sideW, H - 108).fill(C.light);
doc.rect(sideW - 1, 108, 1, H - 108).fill("#DCE8EC");

// Header monogram
doc.roundedRect(25, 25, 58, 58, 5).lineWidth(1).strokeColor(C.cyan).stroke();
text("NK", 34, 42, { size: 21, color: C.cyan, font: "Helvetica-Bold", width: 40, align: "center" });
text("NAVEEN KUMAR", 105, 24, { size: 23, color: C.white, font: "Helvetica-Bold", characterSpacing: 0.5 });
text("FULL STACK DEVELOPER  /  MERN STACK DEVELOPER", 106, 56, { size: 8, color: C.cyan, font: "Helvetica-Bold", characterSpacing: 1.1 });
text("Building responsive applications, real-time products, and AI-powered experiences.", 106, 75, { size: 8, color: "#B8CAD3", width: 430 });

// Sidebar
let sy = 130;
sy = sidebarTitle("Contact", sy);
text("EMAIL", 22, sy, { size: 6.2, color: C.muted, font: "Helvetica-Bold", characterSpacing: 0.8 });
text("nk1910479@gmail.com", 22, sy + 11, { size: 7.6, color: C.ink, link: "mailto:nk1910479@gmail.com" });
sy += 34;
text("PHONE", 22, sy, { size: 6.2, color: C.muted, font: "Helvetica-Bold", characterSpacing: 0.8 });
text("+91 8467817027", 22, sy + 11, { size: 7.6, color: C.ink });
sy += 34;
text("LOCATION", 22, sy, { size: 6.2, color: C.muted, font: "Helvetica-Bold", characterSpacing: 0.8 });
text("Kanpur, Uttar Pradesh\nIndia", 22, sy + 11, { size: 7.6, color: C.ink, lineGap: 2 });
sy += 46;
text("LINKS", 22, sy, { size: 6.2, color: C.muted, font: "Helvetica-Bold", characterSpacing: 0.8 });
text("github.com/naveenkashyap2", 22, sy + 11, { size: 6.9, color: C.ink, link: "https://github.com/naveenkashyap2" });
text("linkedin.com/in/naveen-kashyap08", 22, sy + 24, { size: 6.35, color: C.ink, link: "https://www.linkedin.com/in/naveen-kashyap08/" });

sy += 55;
sy = sidebarTitle("Core Skills", sy);
const skillGroups = [
  ["Frontend", "React.js · Next.js · TypeScript\nJavaScript · Tailwind CSS\nFramer Motion · HTML5 · CSS3"],
  ["Backend", "Node.js · Express.js · REST APIs\nSocket.io · Spring Boot"],
  ["Database", "MongoDB · MySQL · SQL"],
  ["Languages & Tools", "Java · Python · Git · GitHub\nFirebase · Postman · Vercel\nNetlify · MongoDB Atlas"],
];
for (const [heading, body] of skillGroups) {
  text(heading.toUpperCase(), 22, sy, { size: 6.5, color: C.ink, font: "Helvetica-Bold", characterSpacing: 0.7 });
  text(body, 22, sy + 12, { size: 7.15, color: C.muted, width: 132, lineGap: 2.7 });
  sy += doc.heightOfString(body, { width: 132, lineGap: 2.7 }) + 25;
}

sy += 2;
sy = sidebarTitle("Highlights", sy);
bullet("Microsoft Azure Fundamentals", 22, sy, 132, 7.1); sy += 23;
bullet("Top 5% class rank", 22, sy, 132, 7.1); sy += 19;
bullet("Best Performer — Cricket, AIT", 22, sy, 132, 7.1);

// Main content
let my = 130;
my = mainTitle("Professional Summary", my);
const summary = "Motivated Full Stack Developer and final-year B.Tech Computer Science student with practical internship experience across frontend and backend development. Builds scalable, responsive applications with the MERN stack, REST APIs, real-time technologies, and AI-powered features. Strong focus on clean interfaces, reusable architecture, and user experience.";
text(summary, mainX, my, { size: 8.15, color: C.muted, width: mainW, lineGap: 2.2 });
my += doc.heightOfString(summary, { width: mainW, lineGap: 2.2 }) + 16;

my = mainTitle("Experience", my);
text("Frontend Developer Intern", mainX, my, { size: 10.2, color: C.ink, font: "Helvetica-Bold" });
text("MAY 2025 — SEP 2025", mainX + 245, my + 1, { size: 6.7, color: C.muted, font: "Helvetica-Bold", width: mainW - 245, align: "right", characterSpacing: 0.5 });
text("CODEXINTERN", mainX, my + 15, { size: 7, color: C.cyan, font: "Helvetica-Bold", characterSpacing: 0.8 });
my += 30;
my = bullet("Developed responsive React.js applications across 5+ projects using Tailwind CSS, Bootstrap, and modern JavaScript.", mainX, my, mainW);
my = bullet("Integrated REST APIs and dynamic data flows; gained hands-on experience with Node.js, Express.js, and MongoDB.", mainX, my, mainW);
my = bullet("Implemented Framer Motion interactions and contributed through Agile sprints using component-based architecture.", mainX, my, mainW);
my += 8;

my = mainTitle("Selected Projects", my);
const projects = [
  ["Streamify", "React · Node.js · WebRTC · Socket.io · MongoDB", "Real-time video and chat platform with peer-to-peer streaming, JWT authentication, profiles, and call history."],
  ["Resumify AI", "React · Tailwind CSS · Framer Motion", "ATS-focused AI résumé builder with live preview, real-time editing, modern templates, and PDF export."],
  ["DashFlow", "React · TypeScript · Tailwind CSS", "Responsive admin dashboard with analytics, user management, dark mode, and polished interface motion."],
  ["WeatherAI + Nova Todo", "React · APIs · LocalStorage", "Real-time weather and productivity applications with responsive UI, filtering, and persistent state."],
];
for (const [name, stack, description] of projects) {
  text(name, mainX, my, { size: 8.7, color: C.ink, font: "Helvetica-Bold" });
  text(stack, mainX + 105, my + 1, { size: 6.3, color: C.cyan, width: mainW - 105, align: "right" });
  text(description, mainX, my + 13, { size: 7.25, color: C.muted, width: mainW, lineGap: 1.2 });
  my += doc.heightOfString(description, { width: mainW, lineGap: 1.2 }) + 23;
}
my += 3;

my = mainTitle("Education", my);
text("B.Tech — Computer Science & Engineering", mainX, my, { size: 10, color: C.ink, font: "Helvetica-Bold" });
text("SEP 2022 — SEP 2026", mainX + 250, my + 1, { size: 6.7, color: C.muted, font: "Helvetica-Bold", width: mainW - 250, align: "right" });
text("Apollo Institute of Technology (AIT), Kanpur", mainX, my + 16, { size: 7.4, color: C.cyan, font: "Helvetica-Bold" });
text("CGPA  7.2 / 10.0     ·     CLASS RANK  Top 5%", mainX, my + 32, { size: 7, color: C.muted, font: "Helvetica-Bold", characterSpacing: 0.4 });

// Footer
doc.moveTo(mainX, 812).lineTo(W - 27, 812).lineWidth(0.5).strokeColor(C.line).stroke();
text("PORTFOLIO  ·  github.com/naveenkashyap2", mainX, 821, { size: 6.2, color: C.muted, font: "Helvetica-Bold", characterSpacing: 0.55, link: "https://github.com/naveenkashyap2" });
text("NAVEEN KUMAR", W - 125, 821, { size: 6.2, color: C.cyan, font: "Helvetica-Bold", width: 98, align: "right", characterSpacing: 0.8 });

doc.end();
console.log(`Generated ${output}`);
