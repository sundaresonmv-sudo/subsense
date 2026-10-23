import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE
import shutil
import os

# Always reload from the pristine backup
if os.path.exists('Combined_Review_Template_Backup.pptx'):
    shutil.copyfile('Combined_Review_Template_Backup.pptx', 'Combined Review.pptx')
else:
    shutil.copyfile('Combined Review.pptx', 'Combined_Review_Template_Backup.pptx')

prs = pptx.Presentation('Combined Review.pptx')

# Brand Color Palette
TEAL = RGBColor(0x00, 0xA8, 0x96)       # #00A896
DEEP_TEAL = RGBColor(0x02, 0x80, 0x90)  # #028090
CHARCOAL = RGBColor(0x1B, 0x2A, 0x2E)   # #1B2A2E
MUTED = RGBColor(0x7A, 0x8F, 0x8C)      # #7A8F8C
WHITE = RGBColor(0xFF, 0xFF, 0xFF)      # #FFFFFF

def style_run(run, font_name="Calibri", font_size=13, bold=False, italic=False, color=CHARCOAL):
    run.font.name = font_name
    run.font.size = Pt(font_size)
    run.font.bold = bold
    run.font.italic = italic
    if color:
        run.font.color.rgb = color

def set_bullets(tf, items, font_name="Calibri", font_size=13, bold=False, color=CHARCOAL, space_after=4):
    tf.clear()
    for idx, item in enumerate(items):
        p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
        p.space_after = Pt(space_after)
        run = p.add_run()
        run.text = item
        style_run(run, font_name=font_name, font_size=font_size, bold=bold, color=color)

def set_single_text(shape, text, font_name="Calibri", font_size=13, bold=False, color=CHARCOAL, align=PP_ALIGN.LEFT):
    shape.text_frame.clear()
    p = shape.text_frame.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    style_run(run, font_name=font_name, font_size=font_size, bold=bold, color=color)

def set_table_cell(cell, text, font_name="Calibri", font_size=10.5, bold=False, color=CHARCOAL, align=PP_ALIGN.LEFT):
    cell.text = ""
    p = cell.text_frame.paragraphs[0]
    p.alignment = align
    run = p.add_run()
    run.text = text
    style_run(run, font_name=font_name, font_size=font_size, bold=bold, color=color)

FOOTER_TEXT = "SubSense  |  Review 1 & 2 (MERN Stack Project)"

print("Starting slide-by-slide updates...")

# -------------------------------------------------------------------
# SLIDE 1: AGENDA
# -------------------------------------------------------------------
s1 = prs.slides[0]
set_single_text(s1.shapes[6], FOOTER_TEXT, font_size=10, color=MUTED, align=PP_ALIGN.RIGHT)
s1_bullets = [
    "Requirements (Functional & Non-Functional)",
    "Detailed 3-Tier System Architecture",
    "Use Case & Database ER Modeling",
    "Module Description & Feature Matrix",
    "Technology Stack & Supporting Libraries",
    "UI Wireframes & Component Design System",
    "Frontend (React 18 + Vite) & Backend (Express) Build",
    "Database (MongoDB + Mongoose) & REST APIs",
    "Progress (95%), Screenshots & Live Demo Flow",
    "Technical Challenges, Solutions & Next Steps"
]
set_bullets(s1.shapes[4].text_frame, s1_bullets, font_size=12, color=WHITE, space_after=3)

# Add Right-Side Companion Card to balance Slide 1
right_box = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.0), Inches(1.86), Inches(5.6), Inches(4.07))
right_box.fill.solid()
right_box.fill.fore_color.rgb = RGBColor(0xF8, 0xFA, 0xFC)
right_box.line.color.rgb = DEEP_TEAL
right_box.line.width = Pt(1.5)

tf_r = right_box.text_frame
tf_r.word_wrap = True
tf_r.clear()

p0 = tf_r.paragraphs[0]
r0 = p0.add_run()
r0.text = "SubSense Project Overview"
style_run(r0, font_name="Cambria", font_size=15, bold=True, color=DEEP_TEAL)
p0.space_after = Pt(8)

p_tag = tf_r.add_paragraph()
r_tag = p_tag.add_run()
r_tag.text = "SaaS Subscription & Expense Analytics Dashboard"
style_run(r_tag, font_name="Calibri", font_size=11, bold=True, color=TEAL)
p_tag.space_after = Pt(10)

overview_points = [
    "• Problem: The average professional/team manages 8+ subscriptions, leading to billing surprises, untracked renewals, and redundant tool spending.",
    "• Solution: SubSense centralizes all recurring subscriptions into an executive glassmorphic dashboard with live spend analytics and renewal alerts.",
    "• Architecture: Built with the MERN stack (MongoDB, Express.js, React 18, Node.js) with JWT authentication and Recharts data visualization.",
    "• Review Scope: Comprehensive review of system design, database architecture, end-to-end API integration, UI implementation, and test suites."
]
for pt in overview_points:
    p = tf_r.add_paragraph()
    p.space_after = Pt(6)
    r = p.add_run()
    r.text = pt
    style_run(r, font_name="Calibri", font_size=10, color=CHARCOAL)

print("Slide 1 updated.")

# -------------------------------------------------------------------
# SLIDE 2: REQUIREMENTS (Badge 01)
# -------------------------------------------------------------------
s2 = prs.slides[1]
set_single_text(s2.shapes[12], FOOTER_TEXT, font_size=10, color=MUTED, align=PP_ALIGN.RIGHT)

s2_func = [
    "User registration, login & secure JWT token authentication",
    "Centralized subscription tracking & lifecycle states (Active, Paused, Cancelled)",
    "Multi-cycle billing calculation (Monthly, Weekly, Quarterly, Yearly)",
    "Real-time spend analytics & interactive Recharts spend trend visualization",
    "Category-based budget tracking with dynamic spending cap alerts",
    "Proactive renewal reminders & automated payment due-date countdown",
    "Smart insights: duplicate subscription alerts & unused license detection"
]
set_bullets(s2.shapes[7].text_frame, s2_func, font_size=12, color=CHARCOAL, space_after=4)

s2_non_func = [
    "Performance: sub-second API response (< 200ms) with MongoDB compound indexing",
    "Scalability: stateless REST API architecture handling high concurrent traffic",
    "Security: BCrypt password hashing (10 salt rounds), JWT Bearer tokens, CORS controls",
    "Usability: responsive glassmorphic dark UI styled with Tailwind CSS utility tokens",
    "Reliability: resilient MongoDB Atlas connection pooling & schema validation",
    "Maintainability: modular MVC backend architecture & reusable React components"
]
set_bullets(s2.shapes[10].text_frame, s2_non_func, font_size=12, color=CHARCOAL, space_after=4)
print("Slide 2 updated.")

# -------------------------------------------------------------------
# SLIDE 3: ARCHITECTURE (Badge 02)
# -------------------------------------------------------------------
s3 = prs.slides[2]
set_single_text(s3.shapes[20], FOOTER_TEXT, font_size=10, color=MUTED, align=PP_ALIGN.RIGHT)

s3_client = [
    "React.js 18 + Vite (SPA)",
    "React Context API (Auth)",
    "Tailwind CSS + Glassmorphism",
    "Recharts (Area & Donut)",
    "Axios HTTP (Bearer JWT)"
]
set_bullets(s3.shapes[7].text_frame, s3_client, font_size=10.5, color=WHITE, space_after=2)

s3_app = [
    "Node.js + Express.js REST API",
    "JWT Authentication Middleware",
    "Payload Validation Layer",
    "MVC Controllers & Services",
    "Jest & Supertest Test Suites"
]
set_bullets(s3.shapes[11].text_frame, s3_app, font_size=10.5, color=WHITE, space_after=2)

s3_data = [
    "MongoDB Atlas Cloud DB",
    "Mongoose ODM Models",
    "Users & Subscriptions Collections",
    "Compound & Unique Indexes",
    "Schema Enums & Sanitization"
]
set_bullets(s3.shapes[15].text_frame, s3_data, font_size=10.5, color=WHITE, space_after=2)

set_single_text(
    s3.shapes[16],
    "Stateless HTTP/HTTPS REST requests flow from the React 18 client through Express endpoints, verified by JWT auth and validation middleware, before querying MongoDB Atlas via Mongoose ODM.",
    font_size=12, color=CHARCOAL
)

set_single_text(
    s3.shapes[18],
    "Architecture Pipeline: Client Tier (React 18 + Vite) ⇄ Application Tier (Node/Express REST API + JWT) ⇄ Data Tier (MongoDB Atlas Cloud Cluster via Mongoose ODM).",
    font_size=11, bold=True, color=DEEP_TEAL
)
print("Slide 3 updated.")

# -------------------------------------------------------------------
# SLIDE 4: USE CASE (Badge 03)
# -------------------------------------------------------------------
s4 = prs.slides[3]
set_single_text(s4.shapes[11], FOOTER_TEXT, font_size=10, color=MUTED, align=PP_ALIGN.RIGHT)

s4.shapes[6].text_frame.clear()
s4.shapes.add_picture(
    'assets_generated/usecase_diagram.png',
    left=s4.shapes[5].left,
    top=s4.shapes[5].top,
    width=s4.shapes[5].width,
    height=s4.shapes[5].height
)

set_single_text(s4.shapes[8], "System Actors & Use Cases", font_name="Cambria", font_size=14, bold=True, color=DEEP_TEAL)

s4_notes = [
    "Primary Actor: Registered User",
    "  • Secure Register & Login (JWT Auth)",
    "  • Add, Edit, Delete Subscriptions (CRUD)",
    "  • Filter & Search (Category, Status, Cycle)",
    "  • View Live Spend Analytics & Trends",
    "  • Configure Category Budget Guardrails",
    "  • Track Upcoming Renewal Due Dates",
    "",
    "Secondary Actor: Notification Engine",
    "  • Calculate Renewal Due Countdowns",
    "  • Trigger Proactive Renewal Alerts (3d/1d)",
    "  • Detect Duplicate Subscriptions",
    "",
    "Relationships: User initiates interactive CRUD; Engine monitors cron-scheduled events."
]
set_bullets(s4.shapes[9].text_frame, s4_notes, font_size=10.5, color=CHARCOAL, space_after=2)
print("Slide 4 updated.")

# -------------------------------------------------------------------
# SLIDE 5: ER DIAGRAM (Badge 04)
# -------------------------------------------------------------------
s5 = prs.slides[4]
set_single_text(s5.shapes[11], FOOTER_TEXT, font_size=10, color=MUTED, align=PP_ALIGN.RIGHT)

s5.shapes[6].text_frame.clear()
s5.shapes.add_picture(
    'assets_generated/er_diagram.png',
    left=s5.shapes[5].left,
    top=s5.shapes[5].top,
    width=s5.shapes[5].width,
    height=s5.shapes[5].height
)

set_single_text(s5.shapes[8], "Database Schema Design", font_name="Cambria", font_size=14, bold=True, color=DEEP_TEAL)

s5_notes = [
    "Users Collection ('users'):",
    "  • _id: ObjectId [Primary Key]",
    "  • name, email [Unique, Lowercase], password [BCrypt]",
    "  • createdAt, updatedAt [Timestamps]",
    "",
    "Subscriptions Collection ('subscriptions'):",
    "  • _id: ObjectId [Primary Key]",
    "  • userId: ObjectId [Foreign Key -> users._id, Indexed]",
    "  • serviceName, price, currency (USD)",
    "  • category: Enum (Entertainment, Dev, Cloud, Design...)",
    "  • billingCycle: Enum (Weekly, Monthly, Quarterly, Yearly)",
    "  • renewalDate: Date [Indexed], status: Enum (Active/Paused)",
    "",
    "Cardinality: 1:N (1 User has many Subscriptions)",
    "Optimization: Compound index on { userId: 1, createdAt: -1 }."
]
set_bullets(s5.shapes[9].text_frame, s5_notes, font_size=10, color=CHARCOAL, space_after=2)
print("Slide 5 updated.")

# -------------------------------------------------------------------
# SLIDE 6: MODULES (Badge 05)
# -------------------------------------------------------------------
s6 = prs.slides[5]
set_single_text(s6.shapes[7], FOOTER_TEXT, font_size=10, color=MUTED, align=PP_ALIGN.RIGHT)

tbl6 = s6.shapes[5].table
modules_data = [
    ("Module", "Description", "Key Functions"),
    ("User Authentication", "Secure user onboarding, password hashing, and token issuance", "Signup, Login, JWT verification, Protected routes"),
    ("Subscription Core", "Full lifecycle management of recurring software subscriptions", "Create, Read, Update, Delete, Status Toggle, Billing cycles"),
    ("Spend Analytics", "Visual breakdown of recurring expenses and financial trends", "Recharts AreaChart, Donut category split, Run-rate projection"),
    ("Budget Guardrails", "Category spending limits and threshold monitoring", "Set Category Budgets, Progress tracking, Overspend alerts"),
    ("Renewal & Alerts", "Timeline tracking of upcoming renewal dates and smart heuristics", "Renewal countdown, Days remaining, Duplicate detection")
]
for r_idx, row in enumerate(modules_data):
    is_hdr = (r_idx == 0)
    for c_idx, val in enumerate(row):
        col_color = WHITE if is_hdr else CHARCOAL
        set_table_cell(tbl6.cell(r_idx, c_idx), val, font_size=10.5 if not is_hdr else 11.5,
                       bold=is_hdr, color=col_color)
print("Slide 6 updated.")

# -------------------------------------------------------------------
# SLIDE 7: TECH STACK (Badge 06)
# -------------------------------------------------------------------
s7 = prs.slides[6]
set_single_text(s7.shapes[20], FOOTER_TEXT, font_size=10, color=MUTED, align=PP_ALIGN.RIGHT)

set_single_text(s7.shapes[7], "NoSQL document database, Mongoose ODM schemas, compound indexes, cloud Atlas deployment.", font_size=9.5, color=WHITE)
set_single_text(s7.shapes[10], "Minimalist backend framework, RESTful API architecture, JWT auth middleware, custom validators.", font_size=9.5, color=WHITE)
set_single_text(s7.shapes[13], "React 18 SPA with Vite bundler, React Router v6, Context API, Recharts, Tailwind CSS.", font_size=9.5, color=WHITE)
set_single_text(s7.shapes[16], "Asynchronous event-driven V8 JavaScript runtime, non-blocking I/O, npm package ecosystem.", font_size=9.5, color=WHITE)

s7_tools = [
    "Mongoose ODM (Object Data Modeling & Schema validation)",
    "Tailwind CSS (Utility-first modern dark glassmorphism UI)",
    "Recharts (Interactive SVG spend charts & dynamic tooltips)",
    "JWT & bcryptjs (Stateless tokens & cryptographic hashing)",
    "Axios (Promise-based HTTP client with Bearer interceptors)",
    "Jest & Supertest (Automated unit and integration testing)"
]
set_bullets(s7.shapes[18].text_frame, s7_tools, font_size=11, color=CHARCOAL, space_after=3)
print("Slide 7 updated.")

# -------------------------------------------------------------------
# SLIDE 8: UI DESIGN (Badge 07)
# -------------------------------------------------------------------
s8 = prs.slides[7]
set_single_text(s8.shapes[11], FOOTER_TEXT, font_size=10, color=MUTED, align=PP_ALIGN.RIGHT)

s8.shapes[6].text_frame.clear()
s8.shapes.add_picture(
    'assets_generated/wireframe_diagram.png',
    left=s8.shapes[5].left,
    top=s8.shapes[5].top,
    width=s8.shapes[5].width,
    height=s8.shapes[5].height
)

set_single_text(s8.shapes[8], "Design Philosophy & Hierarchy", font_name="Cambria", font_size=14, bold=True, color=DEEP_TEAL)

s8_notes = [
    "Glassmorphic Aesthetic:",
    "  • Deep slate backdrop (#0B0F19 / #0F172A)",
    "  • High-contrast cyan & emerald accents (#38BDF8, #10B981)",
    "  • Translucent glass cards with subtle borders & blur",
    "",
    "Component Layout Hierarchy:",
    "  • DashboardLayout: Persistent responsive Sidebar & Navbar",
    "  • Metric Grid: 4 Top KPI StatCards with percentage shifts",
    "  • Visualization Grid: Spend Trajectory AreaChart & Donut",
    "  • Management Table: Filter pills, Search bar, CRUD modals",
    "",
    "Responsive Design:",
    "  • Tailored breakpoints for Desktop (1280px+), Tablet, Mobile",
    "  • Built with modern Tailwind CSS utility tokens."
]
set_bullets(s8.shapes[9].text_frame, s8_notes, font_size=10, color=CHARCOAL, space_after=2)
print("Slide 8 updated.")

# -------------------------------------------------------------------
# SLIDE 9: FRONTEND (Badge 08)
# -------------------------------------------------------------------
s9 = prs.slides[8]
set_single_text(s9.shapes[9], FOOTER_TEXT, font_size=10, color=MUTED, align=PP_ALIGN.RIGHT)

s9_frontend = [
    "Built with React 18 & Vite providing instant HMR and optimized production bundling (< 1s build)",
    "Component-driven modular architecture: DashboardLayout, Sidebar, Navbar, StatCards, Modals",
    "Global authentication state managed via React Context API (AuthContext) with persistent localStorage",
    "Client-side routing implemented with React Router DOM v6 with protected route authorization guards",
    "Interactive financial data visualizations engineered with Recharts (AreaChart, PieChart & custom tooltips)",
    "Modern glassmorphic dark design system styled with Tailwind CSS utility classes & custom CSS animations",
    "Centralized Axios HTTP client with request interceptors for automatic Bearer JWT header injection"
]
set_bullets(s9.shapes[5].text_frame, s9_frontend, font_size=12, color=CHARCOAL, space_after=4)

set_single_text(
    s9.shapes[7],
    "Completed Pages & Views: HomePage, LoginPage, RegisterPage, DashboardPage, SubscriptionsPage, AnalyticsPage, BudgetPage, RenewalsPage, InsightsPage, SettingsPage.",
    font_size=10.5, bold=True, color=DEEP_TEAL
)
print("Slide 9 updated.")

# -------------------------------------------------------------------
# SLIDE 10: BACKEND (Badge 09)
# -------------------------------------------------------------------
s10 = prs.slides[9]
set_single_text(s10.shapes[9], FOOTER_TEXT, font_size=10, color=MUTED, align=PP_ALIGN.RIGHT)

s10_backend = [
    "Node.js & Express.js RESTful API structured cleanly using the Model-View-Controller (MVC) pattern",
    "Stateless authentication pipeline with JWT tokens and BCrypt password encryption (10 salt rounds)",
    "Custom middleware architecture: protect for JWT route verification and validateSubscription for payload checks",
    "Strict input validation enforcing category enums, billing cycle enums, positive prices, and ISO dates",
    "Centralized error handling returning structured JSON status codes and developer-friendly messages",
    "Multi-environment configuration powered by dotenv for development and production portability",
    "Automated integration test suites built with Jest and Supertest (auth-flow.test.js, subscriptions.test.js)"
]
set_bullets(s10.shapes[5].text_frame, s10_backend, font_size=12, color=CHARCOAL, space_after=4)

set_single_text(
    s10.shapes[7],
    "Security & Middleware Stack: auth.protect (JWT token extraction & verification), validateSubscription.js (schema sanitization), and automated Jest API tests.",
    font_size=10.5, bold=True, color=DEEP_TEAL
)
print("Slide 10 updated.")

# -------------------------------------------------------------------
# SLIDE 11: DATABASE (Badge 10)
# -------------------------------------------------------------------
s11 = prs.slides[10]
set_single_text(s11.shapes[9], FOOTER_TEXT, font_size=10, color=MUTED, align=PP_ALIGN.RIGHT)

s11_db = [
    "MongoDB Atlas cloud cluster configured with Mongoose ODM connection pooling and auto-reconnect",
    "Normalized document schemas: User and Subscription models with strict type definitions",
    "Relational modeling using Mongoose ObjectId referencing (userId: Schema.Types.ObjectId -> User)",
    "Compound indexing on { userId: 1, createdAt: -1 } ensuring sub-millisecond user query performance",
    "Unique index on users.email preventing duplicate account creation at the database engine level",
    "Built-in Mongoose schema validators for categories, billing cycles, and subscription statuses",
    "Clean separation of database connection logic in config/db.js with structured connection logging"
]
set_bullets(s11.shapes[5].text_frame, s11_db, font_size=12, color=CHARCOAL, space_after=4)

set_single_text(
    s11.shapes[7],
    "Active Collections: 'users' (identity, hashed credentials, timestamps) and 'subscriptions' (service metadata, price, billing cycle, renewal date, status, notes).",
    font_size=10.5, bold=True, color=DEEP_TEAL
)
print("Slide 11 updated.")

# -------------------------------------------------------------------
# SLIDE 12: API (Badge 11)
# -------------------------------------------------------------------
s12 = prs.slides[11]
set_single_text(s12.shapes[7], FOOTER_TEXT, font_size=10, color=MUTED, align=PP_ALIGN.RIGHT)

tbl12 = s12.shapes[5].table
api_data = [
    ("Method", "Endpoint", "Description"),
    ("POST", "/api/auth/register", "Register a new user account with hashed password"),
    ("POST", "/api/auth/login", "Authenticate user credentials & issue 7-day JWT token"),
    ("GET", "/api/auth/me", "Retrieve current authenticated user profile via JWT"),
    ("GET", "/api/subscriptions", "Fetch all subscriptions belonging to authenticated user"),
    ("POST", "/api/subscriptions", "Create a new subscription record with schema validation"),
    ("PUT / DEL", "/api/subscriptions/:id", "Update subscription details / delete subscription by ID")
]
for r_idx, row in enumerate(api_data):
    is_hdr = (r_idx == 0)
    for c_idx, val in enumerate(row):
        col_color = WHITE if is_hdr else CHARCOAL
        set_table_cell(tbl12.cell(r_idx, c_idx), val, font_size=10.5 if not is_hdr else 11.5,
                       bold=is_hdr, color=col_color)
print("Slide 12 updated.")

# -------------------------------------------------------------------
# SLIDE 13: STATUS (Badge 12)
# -------------------------------------------------------------------
s13 = prs.slides[12]
set_single_text(s13.shapes[30], FOOTER_TEXT, font_size=10, color=MUTED, align=PP_ALIGN.RIGHT)

set_single_text(s13.shapes[5], "User Authentication & JWT Pipeline", font_size=13, bold=True, color=CHARCOAL)
set_single_text(s13.shapes[8], "100%", font_size=13, bold=True, color=DEEP_TEAL, align=PP_ALIGN.RIGHT)

set_single_text(s13.shapes[9], "Frontend UI (Core Dashboard & Views)", font_size=13, bold=True, color=CHARCOAL)
set_single_text(s13.shapes[12], "95%", font_size=13, bold=True, color=DEEP_TEAL, align=PP_ALIGN.RIGHT)
s13.shapes[11].width = int(s13.shapes[10].width * 0.95)

set_single_text(s13.shapes[13], "Backend REST APIs & Controllers", font_size=13, bold=True, color=CHARCOAL)
set_single_text(s13.shapes[16], "95%", font_size=13, bold=True, color=DEEP_TEAL, align=PP_ALIGN.RIGHT)
s13.shapes[15].width = int(s13.shapes[14].width * 0.95)

set_single_text(s13.shapes[17], "Database Integration & Mongoose Schemas", font_size=13, bold=True, color=CHARCOAL)
set_single_text(s13.shapes[20], "95%", font_size=13, bold=True, color=DEEP_TEAL, align=PP_ALIGN.RIGHT)
s13.shapes[19].width = int(s13.shapes[18].width * 0.95)

set_single_text(s13.shapes[21], "Spend Analytics & Recharts Data Visualization", font_size=13, bold=True, color=CHARCOAL)
set_single_text(s13.shapes[24], "90%", font_size=13, bold=True, color=DEEP_TEAL, align=PP_ALIGN.RIGHT)
s13.shapes[23].width = int(s13.shapes[22].width * 0.90)

set_single_text(s13.shapes[25], "Renewal Reminders & Budget Thresholds", font_size=13, bold=True, color=CHARCOAL)
set_single_text(s13.shapes[28], "80%", font_size=13, bold=True, color=DEEP_TEAL, align=PP_ALIGN.RIGHT)
s13.shapes[27].width = int(s13.shapes[26].width * 0.80)
print("Slide 13 updated.")

# -------------------------------------------------------------------
# SLIDE 14: SCREENSHOTS (Badge 13)
# -------------------------------------------------------------------
s14 = prs.slides[13]
set_single_text(s14.shapes[14], FOOTER_TEXT, font_size=10, color=MUTED, align=PP_ALIGN.RIGHT)

s14.shapes[6].text_frame.clear()
s14.shapes[8].text_frame.clear()
s14.shapes[10].text_frame.clear()
s14.shapes[12].text_frame.clear()

s14.shapes.add_picture('assets_generated/screenshot_login.png',
                       left=s14.shapes[5].left, top=s14.shapes[5].top,
                       width=s14.shapes[5].width, height=s14.shapes[5].height)

s14.shapes.add_picture('assets_generated/screenshot_dashboard.png',
                       left=s14.shapes[7].left, top=s14.shapes[7].top,
                       width=s14.shapes[7].width, height=s14.shapes[7].height)

s14.shapes.add_picture('assets_generated/screenshot_subscriptions.png',
                       left=s14.shapes[9].left, top=s14.shapes[9].top,
                       width=s14.shapes[9].width, height=s14.shapes[9].height)

s14.shapes.add_picture('assets_generated/screenshot_analytics.png',
                       left=s14.shapes[11].left, top=s14.shapes[11].top,
                       width=s14.shapes[11].width, height=s14.shapes[11].height)

labels = [
    ("1. Authentication & JWT Login", s14.shapes[5].left, s14.shapes[5].top - Inches(0.24)),
    ("2. Executive Overview Dashboard", s14.shapes[7].left, s14.shapes[7].top - Inches(0.24)),
    ("3. Subscriptions Lifecycle & CRUD", s14.shapes[9].left, s14.shapes[9].top - Inches(0.24)),
    ("4. Spend Analytics & Smart Insights", s14.shapes[11].left, s14.shapes[11].top - Inches(0.24))
]
for lbl, lx, ly in labels:
    tx_box = s14.shapes.add_textbox(lx, ly, Inches(3.5), Inches(0.22))
    p = tx_box.text_frame.paragraphs[0]
    r = p.add_run()
    r.text = lbl
    style_run(r, font_name="Calibri", font_size=10, bold=True, color=DEEP_TEAL)
print("Slide 14 updated.")

# -------------------------------------------------------------------
# SLIDE 15: CHALLENGES (Badge 14) - Exactly 5 rows (Header + 4)
# -------------------------------------------------------------------
s15 = prs.slides[14]
set_single_text(s15.shapes[7], FOOTER_TEXT, font_size=10, color=MUTED, align=PP_ALIGN.RIGHT)

tbl15 = s15.shapes[5].table
challenges_data = [
    ("Challenge", "Solution Adopted"),
    ("Heterogeneous Billing Cycle Normalization", "Engineered conversion algorithms normalizing Weekly, Monthly, Quarterly, and Yearly rates to monthly equivalents for unified analytics."),
    ("Stateless Session & Route Protection", "Implemented JWT Bearer token authentication with Express middleware and React Context API to retain auth state across page reloads."),
    ("Real-time Recharts Synchronization", "Centralized API queries and state updates so subscription mutations (Add/Edit/Delete) instantly re-render AreaChart and PieChart without refresh."),
    ("Strict Multi-field Input Validation", "Created dual-layer validation via Express middleware and Mongoose schema enums to reject invalid dates, negative prices, and bad enums.")
]
for r_idx, row in enumerate(challenges_data):
    is_hdr = (r_idx == 0)
    for c_idx, val in enumerate(row):
        col_color = WHITE if is_hdr else CHARCOAL
        set_table_cell(tbl15.cell(r_idx, c_idx), val, font_size=10.5 if not is_hdr else 11.5,
                       bold=is_hdr, color=col_color)
print("Slide 15 updated.")

# -------------------------------------------------------------------
# SLIDE 16: NEXT STEPS (Badge 15)
# -------------------------------------------------------------------
s16 = prs.slides[15]
set_single_text(s16.shapes[7], FOOTER_TEXT, font_size=10, color=MUTED, align=PP_ALIGN.RIGHT)

s16_steps = [
    "Automated Email & Webhook Renewal Alerts: Integration with Nodemailer / SendGrid and node-cron scheduler for proactive 3-day and 1-day reminders",
    "Multi-Currency Conversion & Live FX Rates: Integration with Open Exchange Rates API for dynamic multi-currency display and global conversion",
    "Bank Statement & CSV Import: Automated transaction parsing engine to detect recurring SaaS subscriptions automatically from statements",
    "Predictive ML Spend Anomaly Detection: Heuristic statistical model to predict unexpected price increases and budget overruns before they occur",
    "Production Cloud Deployment: Deployment of frontend SPA to Vercel, containerized Node.js backend on Render, and MongoDB Atlas cluster",
    "Comprehensive End-to-End Testing & Accessibility: Lighthouse 95+ performance optimization and Jest / Cypress automated test coverage expansion"
]
set_bullets(s16.shapes[5].text_frame, s16_steps, font_size=12, color=CHARCOAL, space_after=5)
print("Slide 16 updated.")

# -------------------------------------------------------------------
# SLIDE 17: REFERENCES (Badge 16) - Exactly 5 rows (Header + 4)
# -------------------------------------------------------------------
s17 = prs.slides[16]
set_single_text(s17.shapes[7], FOOTER_TEXT, font_size=10, color=MUTED, align=PP_ALIGN.RIGHT)

# Correct category header to REFERENCES
set_single_text(s17.shapes[2], "REFERENCES", font_size=12, bold=True, color=TEAL)

tbl17 = s17.shapes[5].table
ref_data = [
    ("#", "Reference"),
    ("1", "MongoDB & Mongoose ODM Documentation — https://www.mongodb.com/docs, https://mongoosejs.com"),
    ("2", "Express.js & Node.js Application Framework Guides — https://expressjs.com, https://nodejs.org"),
    ("3", "React 18 & Vite Official Documentation — https://react.dev, https://vite.dev"),
    ("4", "RFC 7519: JSON Web Token (JWT) Standard & Recharts Framework — https://recharts.org")
]
for r_idx, row in enumerate(ref_data):
    is_hdr = (r_idx == 0)
    for c_idx, val in enumerate(row):
        col_color = WHITE if is_hdr else CHARCOAL
        align = PP_ALIGN.CENTER if c_idx == 0 else PP_ALIGN.LEFT
        set_table_cell(tbl17.cell(r_idx, c_idx), val, font_size=10.5 if not is_hdr else 11.5,
                       bold=is_hdr, color=col_color, align=align)
print("Slide 17 updated.")

# -------------------------------------------------------------------
# CREATE & PREPEND TITLE SLIDE (Index 0)
# -------------------------------------------------------------------
title_slide = prs.slides.add_slide(prs.slide_layouts[0])

# Move to index 0
sldIdLst = prs.slides._sldIdLst
title_elem = sldIdLst[-1]
sldIdLst.remove(title_elem)
sldIdLst.insert(0, title_elem)

# Build Title Slide Elements
# Decorative top banner line
banner_line = title_slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(0.8), Inches(11.73), Inches(0.08))
banner_line.fill.solid()
banner_line.fill.fore_color.rgb = TEAL
banner_line.line.color.rgb = TEAL

# Subtitle / Category
cat_box = title_slide.shapes.add_textbox(Inches(0.8), Inches(1.1), Inches(11.73), Inches(0.4))
p_cat = cat_box.text_frame.paragraphs[0]
r_cat = p_cat.add_run()
r_cat.text = "MAJOR PROJECT REVIEW  •  COMBINED REVIEW (REVIEW 1 & 2)"
style_run(r_cat, font_name="Calibri", font_size=13, bold=True, color=TEAL)

# Project Title
title_box = title_slide.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(11.73), Inches(1.0))
p_t = title_box.text_frame.paragraphs[0]
r_t = p_t.add_run()
r_t.text = "SubSense"
style_run(r_t, font_name="Cambria", font_size=46, bold=True, color=CHARCOAL)

# Project Subtitle
sub_box = title_slide.shapes.add_textbox(Inches(0.8), Inches(2.55), Inches(11.73), Inches(0.6))
p_s = sub_box.text_frame.paragraphs[0]
r_s = p_s.add_run()
r_s.text = "SaaS Subscription & Expense Analytics Dashboard"
style_run(r_s, font_name="Cambria", font_size=22, bold=True, color=DEEP_TEAL)

# Left Column: Project Abstract Card
abs_card = title_slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(3.3), Inches(6.8), Inches(3.2))
abs_card.fill.solid()
abs_card.fill.fore_color.rgb = RGBColor(0xF8, 0xFA, 0xFC)
abs_card.line.color.rgb = DEEP_TEAL
abs_card.line.width = Pt(1.5)

tf_abs = abs_card.text_frame
tf_abs.word_wrap = True
tf_abs.clear()

p_ah = tf_abs.paragraphs[0]
r_ah = p_ah.add_run()
r_ah.text = "Project Summary & Highlights"
style_run(r_ah, font_name="Cambria", font_size=14, bold=True, color=DEEP_TEAL)
p_ah.space_after = Pt(8)

abs_bullets = [
    "• Objective: Eliminate subscription sprawl and optimize cloud/SaaS recurring expenditure through unified tracking and intelligent analytics.",
    "• Full-Stack Architecture: React 18 frontend with Recharts visualization, Node.js + Express backend, MongoDB Atlas persistence, and JWT session security.",
    "• Core Capabilities: Automated renewal countdowns, category budget guardrails, interactive spend trajectories, and smart license optimization.",
    "• Current Milestone: Review 1 & 2 complete with core APIs, database models, frontend views, and automated test coverage."
]
for ab in abs_bullets:
    p = tf_abs.add_paragraph()
    p.space_after = Pt(5)
    r = p.add_run()
    r.text = ab
    style_run(r, font_name="Calibri", font_size=10.5, color=CHARCOAL)

# Right Column: Project Metadata Card
meta_card = title_slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.8), Inches(3.3), Inches(4.73), Inches(3.2))
meta_card.fill.solid()
meta_card.fill.fore_color.rgb = DEEP_TEAL
meta_card.line.color.rgb = TEAL
meta_card.line.width = Pt(1.5)

tf_meta = meta_card.text_frame
tf_meta.word_wrap = True
tf_meta.clear()

pm_h = tf_meta.paragraphs[0]
rm_h = pm_h.add_run()
rm_h.text = "Presentation Details"
style_run(rm_h, font_name="Cambria", font_size=14, bold=True, color=WHITE)
pm_h.space_after = Pt(10)

meta_info = [
    ("Domain:", "Full-Stack Web Engineering (MERN)"),
    ("Core Stack:", "MongoDB • Express • React 18 • Node.js"),
    ("Design System:", "Tailwind CSS • Glassmorphism"),
    ("Security:", "JWT Bearer Tokens • BCrypt Salting"),
    ("Target Environment:", "Vercel / Render / MongoDB Atlas"),
    ("Review Milestone:", "Review 1 & 2 Combined Presentation")
]
for k, v in meta_info:
    p = tf_meta.add_paragraph()
    p.space_after = Pt(5)
    rk = p.add_run()
    rk.text = f"{k} "
    style_run(rk, font_name="Calibri", font_size=10.5, bold=True, color=RGBColor(0x99, 0xF6, 0xE4))
    rv = p.add_run()
    rv.text = v
    style_run(rv, font_name="Calibri", font_size=10.5, color=WHITE)

# Title slide footer
tf_foot = title_slide.shapes.add_textbox(Inches(0.8), Inches(6.7), Inches(11.73), Inches(0.3))
pf = tf_foot.text_frame.paragraphs[0]
rf = pf.add_run()
rf.text = "SubSense  |  Department of Computer Science & Engineering  |  Combined Review Presentation"
style_run(rf, font_name="Calibri", font_size=9.5, color=MUTED)

print("Title slide added successfully at index 0.")

# Save updated presentations
prs.save('SubSense_Combined_Review.pptx')
prs.save('Combined Review.pptx')
print("Saved both SubSense_Combined_Review.pptx and updated Combined Review.pptx successfully!")
