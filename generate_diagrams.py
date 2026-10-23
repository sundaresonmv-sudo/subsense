import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Ellipse
import os

os.makedirs('assets_generated', exist_ok=True)

# -------------------------------------------------------------
# 1. USE CASE DIAGRAM (Slide 4)
# -------------------------------------------------------------
def create_use_case_diagram():
    fig, ax = plt.subplots(figsize=(10, 6.2), dpi=300)
    ax.set_facecolor('#F8FAFC')
    fig.patch.set_facecolor('#F8FAFC')
    
    # System boundary box
    rect = FancyBboxPatch((2.2, 0.4), 5.6, 5.4,
                          boxstyle="round,pad=0.2,rounding_size=0.15",
                          ec="#028090", fc="#FFFFFF", lw=2, zorder=1)
    ax.add_patch(rect)
    ax.text(5.0, 5.55, "SubSense System Boundary", fontsize=12, fontweight='bold',
            color='#1B2A2E', ha='center', va='center')
    
    # Use cases
    use_cases = [
        ("Register & Login (JWT Auth)", 5.0, 4.8),
        ("Add & Manage Subscriptions (CRUD)", 5.0, 3.9),
        ("Filter & Search (Category, Cycle, Status)", 5.0, 3.0),
        ("View Spend Analytics & Trends", 5.0, 2.1),
        ("Track Category Budgets & Spending Caps", 5.0, 1.3),
        ("Renewal Reminders & Due Date Alerts", 5.0, 0.55),
    ]
    
    for text, x, y in use_cases:
        ellipse = Ellipse((x, y), width=3.6, height=0.58,
                          ec="#00A896", fc="#E6F7F5", lw=1.5, zorder=3)
        ax.add_patch(ellipse)
        ax.text(x, y, text, fontsize=8.5, fontweight='bold',
                color='#1B2A2E', ha='center', va='center')
    
    # Actor 1: Registered User (Left)
    ax.plot([1.0], [3.5], marker='o', markersize=14, color='#028090', zorder=4)
    ax.plot([1.0, 1.0], [3.35, 2.9], color='#028090', lw=2.5, zorder=4)
    ax.plot([0.65, 1.35], [3.15, 3.15], color='#028090', lw=2.5, zorder=4)
    ax.plot([1.0, 0.75], [2.9, 2.5], color='#028090', lw=2.5, zorder=4)
    ax.plot([1.0, 1.25], [2.9, 2.5], color='#028090', lw=2.5, zorder=4)
    ax.text(1.0, 2.25, "Registered User\n(Individual / Pro)", fontsize=9, fontweight='bold',
            color='#1B2A2E', ha='center', va='center')
    
    # Actor 2: System / Scheduler (Right)
    ax.plot([9.0], [2.1], marker='s', markersize=16, color='#F97316', zorder=4)
    ax.plot([9.0, 9.0], [1.95, 1.5], color='#F97316', lw=2.5, zorder=4)
    ax.plot([8.65, 9.35], [1.75, 1.75], color='#F97316', lw=2.5, zorder=4)
    ax.plot([9.0, 8.75], [1.5, 1.1], color='#F97316', lw=2.5, zorder=4)
    ax.plot([9.0, 9.25], [1.5, 1.1], color='#F97316', lw=2.5, zorder=4)
    ax.text(9.0, 0.85, "Notification Engine\n(Automated Cron)", fontsize=9, fontweight='bold',
            color='#1B2A2E', ha='center', va='center')

    # Association lines from User to Use Cases
    user_coords = (1.2, 3.15)
    for _, ux, uy in use_cases:
        ax.plot([user_coords[0], ux - 1.75], [user_coords[1], uy],
                color='#7A8F8C', lw=1.2, linestyle='-', zorder=2)
        
    # Association from System to Renewal & Budget
    ax.plot([8.7, 5.0 + 1.75], [1.75, 0.55], color='#F97316', lw=1.2, linestyle='--', zorder=2)
    ax.plot([8.7, 5.0 + 1.75], [1.75, 1.3], color='#F97316', lw=1.2, linestyle='--', zorder=2)
    
    ax.set_xlim(0, 10)
    ax.set_ylim(0.2, 6.0)
    ax.axis('off')
    plt.tight_layout()
    plt.savefig('assets_generated/usecase_diagram.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("Regenerated clean assets_generated/usecase_diagram.png")

# -------------------------------------------------------------
# 2. ER DIAGRAM (Slide 5)
# -------------------------------------------------------------
def create_er_diagram():
    fig, ax = plt.subplots(figsize=(10, 6.2), dpi=300)
    ax.set_facecolor('#F8FAFC')
    fig.patch.set_facecolor('#F8FAFC')
    
    ax.text(5.0, 5.85, "SubSense Database Schema & Relational Model (MongoDB)",
            fontsize=12, fontweight='bold', color='#1B2A2E', ha='center')
    
    # Entity 1: User Collection (Left Table)
    user_box = FancyBboxPatch((0.8, 1.5), 3.4, 3.9,
                              boxstyle="round,pad=0.1,rounding_size=0.1",
                              ec="#028090", fc="#FFFFFF", lw=2, zorder=2)
    ax.add_patch(user_box)
    
    u_hdr = FancyBboxPatch((0.8, 4.8), 3.4, 0.6,
                           boxstyle="round,pad=0.1,rounding_size=0.08",
                           ec="#028090", fc="#028090", lw=2, zorder=3)
    ax.add_patch(u_hdr)
    ax.text(2.5, 5.1, "USERS COLLECTION", fontsize=10, fontweight='bold',
            color='#FFFFFF', ha='center', va='center')
    
    user_attrs = [
        ("[PK] _id", "ObjectId", "#00A896"),
        ("name", "String (Required)", "#1B2A2E"),
        ("email", "String (Unique, Idx)", "#1B2A2E"),
        ("password", "String (BCrypt)", "#1B2A2E"),
        ("createdAt", "Date (Timestamp)", "#64748B"),
        ("updatedAt", "Date (Timestamp)", "#64748B"),
    ]
    for idx, (attr, dtype, col) in enumerate(user_attrs):
        y_pos = 4.45 - (idx * 0.48)
        ax.text(1.0, y_pos, attr, fontsize=8.5, fontweight='bold' if '[PK]' in attr else 'normal',
                color=col, va='center')
        ax.text(4.0, y_pos, dtype, fontsize=7.5, color='#475569',
                ha='right', va='center')
        ax.plot([0.9, 4.1], [y_pos - 0.2, y_pos - 0.2], color='#E2E8F0', lw=0.8)

    # Entity 2: Subscription Collection (Right Table)
    sub_box = FancyBboxPatch((5.8, 0.6), 3.8, 4.8,
                             boxstyle="round,pad=0.1,rounding_size=0.1",
                              ec="#00A896", fc="#FFFFFF", lw=2, zorder=2)
    ax.add_patch(sub_box)
    
    s_hdr = FancyBboxPatch((5.8, 4.8), 3.8, 0.6,
                           boxstyle="round,pad=0.1,rounding_size=0.08",
                           ec="#00A896", fc="#00A896", lw=2, zorder=3)
    ax.add_patch(s_hdr)
    ax.text(7.7, 5.1, "SUBSCRIPTIONS COLLECTION", fontsize=10, fontweight='bold',
            color='#FFFFFF', ha='center', va='center')
    
    sub_attrs = [
        ("[PK] _id", "ObjectId", "#00A896"),
        ("[FK] userId", "ObjectId (ref: User)", "#028090"),
        ("serviceName", "String (e.g. Netflix)", "#1B2A2E"),
        ("category", "Enum (Entertainment...)", "#1B2A2E"),
        ("price", "Number (min: 0.01)", "#1B2A2E"),
        ("currency", "String (USD, EUR...)", "#1B2A2E"),
        ("billingCycle", "Enum (Monthly, Yearly...)", "#1B2A2E"),
        ("startDate", "Date (Default: now)", "#64748B"),
        ("renewalDate", "Date (Required, Idx)", "#DC2626"),
        ("status", "Enum (Active, Paused...)", "#16A34A"),
        ("notes", "String (Optional)", "#64748B"),
    ]
    for idx, (attr, dtype, col) in enumerate(sub_attrs):
        y_pos = 4.45 - (idx * 0.36)
        ax.text(6.0, y_pos, attr, fontsize=8, fontweight='bold' if ('[PK]' in attr or '[FK]' in attr) else 'normal',
                color=col, va='center')
        ax.text(9.4, y_pos, dtype, fontsize=7, color='#475569',
                ha='right', va='center')
        ax.plot([5.9, 9.5], [y_pos - 0.16, y_pos - 0.16], color='#E2E8F0', lw=0.8)

    # Relationship diamond (1:N)
    diamond = patches.Polygon([[4.6, 3.6], [5.0, 3.9], [5.4, 3.6], [5.0, 3.3]],
                              ec="#028090", fc="#E6F7F5", lw=1.5, zorder=4)
    ax.add_patch(diamond)
    ax.text(5.0, 3.6, "has", fontsize=8.5, fontweight='bold', color='#028090',
            ha='center', va='center')
    
    ax.plot([4.2, 4.6], [3.6, 3.6], color='#028090', lw=2)
    ax.text(4.35, 3.8, "1", fontsize=10, fontweight='bold', color='#028090')
    
    ax.plot([5.4, 5.8], [3.6, 3.6], color='#00A896', lw=2)
    ax.text(5.55, 3.8, "N", fontsize=10, fontweight='bold', color='#00A896')
    
    # Schema Note box at bottom
    note_box = FancyBboxPatch((0.8, 0.6), 4.6, 0.7,
                              boxstyle="round,pad=0.08,rounding_size=0.08",
                              ec="#CBD5E1", fc="#F1F5F9", lw=1)
    ax.add_patch(note_box)
    ax.text(3.1, 0.95, "Indexes: users(email [unique]) | subscriptions(userId, renewalDate)\nReferencing: Mongoose ObjectId referencing User._id with populate()",
            fontsize=7.2, color='#334155', ha='center', va='center')

    ax.set_xlim(0.4, 10)
    ax.set_ylim(0.3, 6.1)
    ax.axis('off')
    plt.tight_layout()
    plt.savefig('assets_generated/er_diagram.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("Regenerated clean assets_generated/er_diagram.png")

# -------------------------------------------------------------
# 3. SYSTEM ARCHITECTURE (Slide 3)
# -------------------------------------------------------------
def create_architecture_diagram():
    fig, ax = plt.subplots(figsize=(10.5, 6.2), dpi=300)
    ax.set_facecolor('#F8FAFC')
    fig.patch.set_facecolor('#F8FAFC')
    
    ax.text(5.25, 5.9, "SubSense End-to-End MERN Stack System Architecture",
            fontsize=12, fontweight='bold', color='#1B2A2E', ha='center')
    
    # TIER 1: CLIENT TIER (Left)
    c_box = FancyBboxPatch((0.6, 0.7), 2.8, 4.8, boxstyle="round,pad=0.1,rounding_size=0.1",
                           ec="#028090", fc="#FFFFFF", lw=2, zorder=2)
    ax.add_patch(c_box)
    c_hdr = FancyBboxPatch((0.6, 4.9), 2.8, 0.6, boxstyle="round,pad=0.1,rounding_size=0.08",
                           ec="#028090", fc="#028090", lw=2, zorder=3)
    ax.add_patch(c_hdr)
    ax.text(2.0, 5.2, "CLIENT TIER\n(React 18 + Vite)", fontsize=9, fontweight='bold',
            color='#FFFFFF', ha='center', va='center')
    
    client_items = [
        "DashboardLayout & Navigation",
        "Pages (Dashboard, Subscriptions,\nAnalytics, Budget, Renewals)",
        "Recharts (Area & Donut Charts)",
        "React Context API (AuthContext)",
        "Axios HTTP Client (Bearer JWT)",
        "Tailwind CSS Glassmorphism",
    ]
    for idx, item in enumerate(client_items):
        y = 4.25 - idx * 0.66
        p = FancyBboxPatch((0.8, y-0.22), 2.4, 0.5, boxstyle="round,pad=0.05,rounding_size=0.06",
                           ec="#E2E8F0", fc="#E6F7F5", lw=1)
        ax.add_patch(p)
        ax.text(2.0, y+0.03, item, fontsize=7.2, color='#1B2A2E', ha='center', va='center')

    # TIER 2: APPLICATION TIER (Center)
    s_box = FancyBboxPatch((3.85, 0.7), 3.2, 4.8, boxstyle="round,pad=0.1,rounding_size=0.1",
                           ec="#00A896", fc="#FFFFFF", lw=2, zorder=2)
    ax.add_patch(s_box)
    s_hdr = FancyBboxPatch((3.85, 4.9), 3.2, 0.6, boxstyle="round,pad=0.1,rounding_size=0.08",
                           ec="#00A896", fc="#00A896", lw=2, zorder=3)
    ax.add_patch(s_hdr)
    ax.text(5.45, 5.2, "APPLICATION TIER\n(Node.js + Express.js REST API)", fontsize=9, fontweight='bold',
            color='#FFFFFF', ha='center', va='center')

    server_items = [
        "API Gateway & CORS Config",
        "JWT Auth Middleware (protect)",
        "Payload Validation Layer\n(validateSubscription.js)",
        "Auth Controller (BCrypt Hashing)",
        "Subscription Controller (CRUD)",
        "Automated Test Suite (Jest)",
    ]
    for idx, item in enumerate(server_items):
        y = 4.25 - idx * 0.66
        p = FancyBboxPatch((4.05, y-0.22), 2.8, 0.5, boxstyle="round,pad=0.05,rounding_size=0.06",
                           ec="#E2E8F0", fc="#F0FDF4", lw=1)
        ax.add_patch(p)
        ax.text(5.45, y+0.03, item, fontsize=7.2, color='#1B2A2E', ha='center', va='center')

    # TIER 3: DATA TIER (Right)
    d_box = FancyBboxPatch((7.5, 0.7), 2.5, 4.8, boxstyle="round,pad=0.1,rounding_size=0.1",
                           ec="#F97316", fc="#FFFFFF", lw=2, zorder=2)
    ax.add_patch(d_box)
    d_hdr = FancyBboxPatch((7.5, 4.9), 2.5, 0.6, boxstyle="round,pad=0.1,rounding_size=0.08",
                           ec="#F97316", fc="#F97316", lw=2, zorder=3)
    ax.add_patch(d_hdr)
    ax.text(8.75, 5.2, "DATA TIER\n(MongoDB + Mongoose)", fontsize=9, fontweight='bold',
            color='#FFFFFF', ha='center', va='center')

    data_items = [
        "Mongoose ODM Models",
        "Users Collection (Unique email)",
        "Subscriptions Collection (Compound Idx)",
        "Connection Pool Manager",
        "Schema Enum Validation",
        "MongoDB Atlas Cloud DB",
    ]
    for idx, item in enumerate(data_items):
        y = 4.25 - idx * 0.66
        p = FancyBboxPatch((7.7, y-0.22), 2.1, 0.5, boxstyle="round,pad=0.05,rounding_size=0.06",
                           ec="#E2E8F0", fc="#FFF7ED", lw=1)
        ax.add_patch(p)
        ax.text(8.75, y+0.03, item, fontsize=7.2, color='#1B2A2E', ha='center', va='center')

    # Connecting Arrows
    ax.annotate("", xy=(3.8, 3.2), xytext=(3.45, 3.2),
                arrowprops=dict(arrowstyle="->", lw=2, color="#028090"))
    ax.annotate("", xy=(3.45, 2.9), xytext=(3.8, 2.9),
                arrowprops=dict(arrowstyle="->", lw=2, color="#028090"))
    ax.text(3.62, 3.35, "REST\nJSON", fontsize=6.5, fontweight='bold', color="#028090", ha='center')
    ax.text(3.62, 2.65, "JWT\nBearer", fontsize=6.5, fontweight='bold', color="#028090", ha='center')

    ax.annotate("", xy=(7.45, 3.2), xytext=(7.1, 3.2),
                arrowprops=dict(arrowstyle="->", lw=2, color="#F97316"))
    ax.annotate("", xy=(7.1, 2.9), xytext=(7.45, 2.9),
                arrowprops=dict(arrowstyle="->", lw=2, color="#F97316"))
    ax.text(7.28, 3.35, "Queries\nBSON", fontsize=6.5, fontweight='bold', color="#F97316", ha='center')
    ax.text(7.28, 2.65, "Docs\nCursor", fontsize=6.5, fontweight='bold', color="#F97316", ha='center')

    ax.set_xlim(0.2, 10.5)
    ax.set_ylim(0.4, 6.1)
    ax.axis('off')
    plt.tight_layout()
    plt.savefig('assets_generated/architecture_diagram.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("Regenerated clean assets_generated/architecture_diagram.png")

# -------------------------------------------------------------
# 4. UI WIREFRAME ARCHITECTURE (Slide 8)
# -------------------------------------------------------------
def create_wireframe_diagram():
    fig, ax = plt.subplots(figsize=(10, 6.2), dpi=300)
    ax.set_facecolor('#F8FAFC')
    fig.patch.set_facecolor('#F8FAFC')
    
    ax.text(5.0, 5.9, "SubSense Glassmorphic UI Wireframe & Component Hierarchy",
            fontsize=12, fontweight='bold', color='#1B2A2E', ha='center')
    
    # Outer desktop frame
    screen = FancyBboxPatch((0.5, 0.5), 9.0, 5.1, boxstyle="round,pad=0.1,rounding_size=0.12",
                            ec="#1E293B", fc="#0F172A", lw=2, zorder=1)
    ax.add_patch(screen)
    
    # Top Bar (Navbar)
    nav = FancyBboxPatch((0.6, 5.0), 8.8, 0.5, boxstyle="round,pad=0.04,rounding_size=0.06",
                         ec="#334155", fc="#1E293B", lw=1, zorder=2)
    ax.add_patch(nav)
    ax.text(0.9, 5.25, "[SubSense Logo] SubSense Dashboard", fontsize=8.5, fontweight='bold', color='#38BDF8', va='center')
    ax.text(8.8, 5.25, "John Doe (Profile) | Sign Out", fontsize=7.2, color='#94A3B8', ha='right', va='center')

    # Sidebar (Left)
    side = FancyBboxPatch((0.6, 0.6), 1.8, 4.25, boxstyle="round,pad=0.04,rounding_size=0.06",
                          ec="#334155", fc="#1E293B", lw=1, zorder=2)
    ax.add_patch(side)
    menu_items = ["Dashboard", "Subscriptions", "Analytics", "Budgeting", "Renewals", "Insights", "Settings"]
    for i, m in enumerate(menu_items):
        y = 4.45 - i * 0.55
        if i == 0:
            active_p = FancyBboxPatch((0.7, y-0.18), 1.6, 0.36, boxstyle="round,pad=0.02,rounding_size=0.04",
                                     ec="none", fc="#0284C7", zorder=3)
            ax.add_patch(active_p)
            col = "#FFFFFF"
        else:
            col = "#94A3B8"
        ax.text(0.85, y, f"- {m}", fontsize=7.2, fontweight='bold' if i == 0 else 'normal', color=col, va='center', zorder=4)

    # Main Area: Stat Cards (Top row)
    stat_labels = [
        ("Monthly Spend", "$242.49", "+4.2%"),
        ("Active Services", "7 Services", "2 Paused"),
        ("Next Renewal", "GitHub (3d)", "$39.00"),
        ("Top Category", "Cloud & Dev", "44% spend")
    ]
    for i, (title, val, sub) in enumerate(stat_labels):
        x = 2.6 + i * 1.65
        sc = FancyBboxPatch((x, 3.9), 1.5, 0.9, boxstyle="round,pad=0.03,rounding_size=0.06",
                            ec="#334155", fc="#1E293B", lw=1, zorder=2)
        ax.add_patch(sc)
        ax.text(x+0.1, 4.58, title, fontsize=6.5, color='#94A3B8')
        ax.text(x+0.1, 4.28, val, fontsize=8.5, fontweight='bold', color='#FFFFFF')
        ax.text(x+0.1, 4.05, sub, fontsize=6, color='#38BDF8')

    # Chart Area (Center Left)
    chart_box = FancyBboxPatch((2.6, 1.7), 4.2, 2.05, boxstyle="round,pad=0.04,rounding_size=0.06",
                               ec="#334155", fc="#1E293B", lw=1, zorder=2)
    ax.add_patch(chart_box)
    ax.text(2.8, 3.55, "Monthly Spend Trajectory (Recharts AreaChart)", fontsize=7.2, fontweight='bold', color='#FFFFFF')
    cx = [2.8, 3.4, 4.1, 4.8, 5.5, 6.2, 6.6]
    cy = [2.1, 2.4, 2.2, 2.7, 2.6, 3.0, 3.2]
    ax.plot(cx, cy, color='#06B6D4', lw=2, zorder=3)
    ax.fill_between(cx, [1.9]*len(cx), cy, color='#0891B2', alpha=0.25, zorder=2)

    # Donut Chart Area (Center Right)
    donut_box = FancyBboxPatch((7.0, 1.7), 2.2, 2.05, boxstyle="round,pad=0.04,rounding_size=0.06",
                               ec="#334155", fc="#1E293B", lw=1, zorder=2)
    ax.add_patch(donut_box)
    ax.text(7.15, 3.55, "Category Split", fontsize=7.2, fontweight='bold', color='#FFFFFF')
    c_pie = Ellipse((8.1, 2.6), width=1.1, height=1.1, ec="#028090", fc="#00A896", lw=1.5, zorder=3)
    ax.add_patch(c_pie)
    c_hole = Ellipse((8.1, 2.6), width=0.55, height=0.55, ec="#1E293B", fc="#1E293B", lw=1.5, zorder=4)
    ax.add_patch(c_hole)
    ax.text(8.1, 2.6, "7\nCategories", fontsize=6, color='#FFFFFF', ha='center', va='center', zorder=5)

    # Subscription Table Preview (Bottom)
    tbl_box = FancyBboxPatch((2.6, 0.6), 6.6, 0.95, boxstyle="round,pad=0.03,rounding_size=0.06",
                             ec="#334155", fc="#1E293B", lw=1, zorder=2)
    ax.add_patch(tbl_box)
    ax.text(2.8, 1.35, "Active Subscriptions  |  [ + Add New Subscription ]", fontsize=7.2, fontweight='bold', color='#38BDF8')
    t_rows = [
        "GitHub Enterprise  -  Development  -  $39.00/mo  -  Renews in 3 days  -  Active",
        "AWS Cloud Services  -  Cloud Services  -  $68.50/mo  -  Renews in 11 days  -  Active"
    ]
    for idx, r in enumerate(t_rows):
        ax.text(2.8, 1.08 - idx * 0.25, r, fontsize=6.5, color='#CBD5E1')

    ax.set_xlim(0, 10)
    ax.set_ylim(0.2, 6.1)
    ax.axis('off')
    plt.tight_layout()
    plt.savefig('assets_generated/wireframe_diagram.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("Regenerated clean assets_generated/wireframe_diagram.png")

create_use_case_diagram()
create_er_diagram()
create_architecture_diagram()
create_wireframe_diagram()
