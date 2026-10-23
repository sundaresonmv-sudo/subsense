import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Ellipse
import numpy as np

# -------------------------------------------------------------------
# SCREENSHOT 1: LOGIN & AUTH SCREEN
# -------------------------------------------------------------------
def render_login_screen():
    fig, ax = plt.subplots(figsize=(8, 4.8), dpi=300)
    fig.patch.set_facecolor('#0B0F19')
    ax.set_facecolor('#0B0F19')

    # Background gradient glow circles
    g1 = Ellipse((2.0, 3.8), width=3.5, height=2.5, fc='#0284C7', alpha=0.12)
    g2 = Ellipse((6.0, 1.2), width=4.0, height=3.0, fc='#0D9488', alpha=0.12)
    ax.add_patch(g1)
    ax.add_patch(g2)

    # Auth Card
    card = FancyBboxPatch((2.2, 0.4), 3.6, 4.0, boxstyle="round,pad=0.12,rounding_size=0.15",
                          ec="#334155", fc="#111827", lw=1.5, zorder=2)
    ax.add_patch(card)

    # Logo & Header
    ax.text(4.0, 4.05, "SubSense", fontsize=16, fontweight='bold', color='#38BDF8', ha='center', va='center')
    ax.text(4.0, 3.7, "Welcome back to your dashboard", fontsize=8, color='#94A3B8', ha='center', va='center')

    # Input 1: Email
    ax.text(2.5, 3.25, "EMAIL ADDRESS", fontsize=6.8, fontweight='bold', color='#64748B')
    inp1 = FancyBboxPatch((2.5, 2.65), 3.0, 0.45, boxstyle="round,pad=0.04,rounding_size=0.06",
                          ec="#374151", fc="#1F2937", lw=1, zorder=3)
    ax.add_patch(inp1)
    ax.text(2.65, 2.87, "alex.morgan@subsense.dev", fontsize=7.5, color='#F3F4F6', va='center')

    # Input 2: Password
    ax.text(2.5, 2.35, "PASSWORD", fontsize=6.8, fontweight='bold', color='#64748B')
    inp2 = FancyBboxPatch((2.5, 1.75), 3.0, 0.45, boxstyle="round,pad=0.04,rounding_size=0.06",
                          ec="#374151", fc="#1F2937", lw=1, zorder=3)
    ax.add_patch(inp2)
    ax.text(2.65, 1.97, "••••••••••••", fontsize=8.5, color='#F3F4F6', va='center')

    # Remember me & Forgot Password
    ax.text(2.5, 1.45, "[✓] Remember for 30 days", fontsize=6.5, color='#94A3B8')
    ax.text(5.5, 1.45, "Forgot password?", fontsize=6.5, color='#38BDF8', ha='right')

    # Sign In Button
    btn = FancyBboxPatch((2.5, 0.8), 3.0, 0.45, boxstyle="round,pad=0.04,rounding_size=0.06",
                         ec="#0284C7", fc="#0284C7", lw=1, zorder=3)
    ax.add_patch(btn)
    ax.text(4.0, 1.02, "Sign In to Dashboard", fontsize=8.5, fontweight='bold', color='#FFFFFF', ha='center', va='center')

    # Footer note
    ax.text(4.0, 0.55, "Protected by 256-bit JWT Encryption", fontsize=6, color='#64748B', ha='center')

    ax.set_xlim(0, 8)
    ax.set_ylim(0.2, 4.6)
    ax.axis('off')
    plt.tight_layout()
    plt.savefig('assets_generated/screenshot_login.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("Generated assets_generated/screenshot_login.png")

# -------------------------------------------------------------------
# SCREENSHOT 2: MAIN DASHBOARD
# -------------------------------------------------------------------
def render_dashboard_screen():
    fig, ax = plt.subplots(figsize=(8, 4.8), dpi=300)
    fig.patch.set_facecolor('#0B0F19')
    ax.set_facecolor('#0B0F19')

    # Header Bar
    top = FancyBboxPatch((0.4, 4.15), 7.2, 0.55, boxstyle="round,pad=0.03,rounding_size=0.06",
                         ec="#1E293B", fc="#111827", lw=1, zorder=2)
    ax.add_patch(top)
    ax.text(0.65, 4.42, "SubSense  |  Overview Dashboard", fontsize=9, fontweight='bold', color='#38BDF8', va='center')
    ax.text(7.35, 4.42, "Live Mode  •  Last Synced 2m ago", fontsize=6.8, color='#10B981', ha='right', va='center')

    # 4 Metric Cards
    cards_data = [
        ("MONTHLY RUN RATE", "$242.49", "-$18.50 vs last mo", "#0284C7"),
        ("ACTIVE SERVICES", "8 Active", "2 Subscriptions Paused", "#10B981"),
        ("NEXT RENEWAL", "GitHub ($39)", "Renews in 3 Days", "#F59E0B"),
        ("ANNUAL FORECAST", "$2,909.88", "Within Target Budget", "#8B5CF6")
    ]
    for i, (label, val, sub, col) in enumerate(cards_data):
        x = 0.4 + i * 1.83
        c = FancyBboxPatch((x, 3.1), 1.72, 0.9, boxstyle="round,pad=0.03,rounding_size=0.06",
                           ec="#1E293B", fc="#111827", lw=1, zorder=2)
        ax.add_patch(c)
        ax.text(x + 0.1, 3.82, label, fontsize=5.8, fontweight='bold', color='#94A3B8')
        ax.text(x + 0.1, 3.52, val, fontsize=9.5, fontweight='bold', color='#FFFFFF')
        ax.text(x + 0.1, 3.25, sub, fontsize=5.8, color=col)

    # Chart 1: Spend Trajectory Area Chart (Center Left)
    c1 = FancyBboxPatch((0.4, 1.25), 4.6, 1.72, boxstyle="round,pad=0.04,rounding_size=0.06",
                        ec="#1E293B", fc="#111827", lw=1, zorder=2)
    ax.add_patch(c1)
    ax.text(0.6, 2.8, "Monthly Spend Trajectory (6-Month Trend)", fontsize=7.2, fontweight='bold', color='#F3F4F6')
    ax.text(4.8, 2.8, "Recharts Area", fontsize=6, color='#64748B', ha='right')
    
    # Area curve
    xs = np.linspace(0.6, 4.8, 25)
    ys = 1.6 + 0.4 * np.sin((xs - 0.6) * 1.2) + 0.2 * ((xs - 0.6) / 4.2)**2
    ax.plot(xs, ys, color='#38BDF8', lw=2, zorder=4)
    ax.fill_between(xs, 1.45, ys, color='#0284C7', alpha=0.25, zorder=3)
    # Months labels
    months = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"]
    for idx, m in enumerate(months):
        mx = 0.7 + idx * 0.78
        ax.text(mx, 1.35, m, fontsize=5.8, color='#64748B', ha='center')

    # Chart 2: Category Donut Chart (Center Right)
    c2 = FancyBboxPatch((5.15, 1.25), 2.45, 1.72, boxstyle="round,pad=0.04,rounding_size=0.06",
                        ec="#1E293B", fc="#111827", lw=1, zorder=2)
    ax.add_patch(c2)
    ax.text(5.3, 2.8, "Spend by Category", fontsize=7.2, fontweight='bold', color='#F3F4F6')
    
    # Pie segments
    pie = Ellipse((6.37, 2.05), width=1.1, height=1.1, ec="#111827", fc="#0284C7", lw=1.5, zorder=4)
    ax.add_patch(pie)
    pie_inner = Ellipse((6.37, 2.05), width=0.55, height=0.55, ec="#111827", fc="#111827", lw=1.5, zorder=5)
    ax.add_patch(pie_inner)
    ax.text(6.37, 2.05, "$242", fontsize=6.8, fontweight='bold', color='#FFFFFF', ha='center', va='center', zorder=6)
    
    # Category legend pills
    cats = [("Dev (38%)", "#0284C7"), ("Cloud (28%)", "#F59E0B"), ("Design (18%)", "#8B5CF6"), ("Other (16%)", "#10B981")]
    for idx, (cat, col) in enumerate(cats):
        cy = 2.6 - idx * 0.2
        ax.plot([5.35], [cy], marker='s', markersize=4, color=col)
        ax.text(5.48, cy, cat, fontsize=5.5, color='#94A3B8', va='center')

    # Bottom Quick Row: Upcoming Renewals list
    c3 = FancyBboxPatch((0.4, 0.4), 7.2, 0.75, boxstyle="round,pad=0.03,rounding_size=0.06",
                        ec="#1E293B", fc="#111827", lw=1, zorder=2)
    ax.add_patch(c3)
    ax.text(0.6, 0.95, "UPCOMING RENEWALS THIS MONTH", fontsize=6, fontweight='bold', color='#64748B')
    items = [
        ("GitHub Enterprise", "$39.00/mo", "Oct 17 (3d)", "#F59E0B"),
        ("Figma Org", "$45.00/mo", "Oct 19 (5d)", "#10B981"),
        ("AWS Hosting", "$68.50/mo", "Oct 25 (11d)", "#38BDF8")
    ]
    for idx, (title, cost, due, col) in enumerate(items):
        ix = 0.6 + idx * 2.4
        ax.text(ix, 0.65, f"• {title}  {cost}  [{due}]", fontsize=6.2, color='#E2E8F0')

    ax.set_xlim(0, 8)
    ax.set_ylim(0.2, 4.8)
    ax.axis('off')
    plt.tight_layout()
    plt.savefig('assets_generated/screenshot_dashboard.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("Generated assets_generated/screenshot_dashboard.png")

# -------------------------------------------------------------------
# SCREENSHOT 3: SUBSCRIPTIONS CRUD & MODAL
# -------------------------------------------------------------------
def render_subscriptions_screen():
    fig, ax = plt.subplots(figsize=(8, 4.8), dpi=300)
    fig.patch.set_facecolor('#0B0F19')
    ax.set_facecolor('#0B0F19')

    # Header Bar
    top = FancyBboxPatch((0.4, 4.15), 7.2, 0.55, boxstyle="round,pad=0.03,rounding_size=0.06",
                         ec="#1E293B", fc="#111827", lw=1, zorder=2)
    ax.add_patch(top)
    ax.text(0.65, 4.42, "Subscriptions  |  All Tracked Services (8)", fontsize=9, fontweight='bold', color='#38BDF8', va='center')
    
    # Add Button in Header
    btn_add = FancyBboxPatch((6.0, 4.25), 1.45, 0.35, boxstyle="round,pad=0.02,rounding_size=0.04",
                            ec="#0284C7", fc="#0284C7", lw=1, zorder=3)
    ax.add_patch(btn_add)
    ax.text(6.72, 4.42, "+ New Subscription", fontsize=6.8, fontweight='bold', color='#FFFFFF', ha='center', va='center', zorder=4)

    # Filter Bar (Category Pills)
    categories = ["All (8)", "Development", "Cloud", "Design", "Productivity", "Entertainment"]
    for idx, cat in enumerate(categories):
        x = 0.4 + idx * 1.22
        is_active = (idx == 0)
        p = FancyBboxPatch((x, 3.65), 1.15, 0.35, boxstyle="round,pad=0.02,rounding_size=0.04",
                           ec="#0284C7" if is_active else "#334155",
                           fc="#0369A1" if is_active else "#1F2937", lw=1, zorder=2)
        ax.add_patch(p)
        ax.text(x + 0.57, 3.82, cat, fontsize=6, fontweight='bold' if is_active else 'normal',
                color='#FFFFFF' if is_active else '#94A3B8', ha='center', va='center', zorder=3)

    # Subscriptions Table Container
    table_card = FancyBboxPatch((0.4, 0.4), 7.2, 3.1, boxstyle="round,pad=0.04,rounding_size=0.06",
                                ec="#1E293B", fc="#111827", lw=1, zorder=2)
    ax.add_patch(table_card)

    # Table Header Row
    ax.text(0.65, 3.25, "SERVICE NAME", fontsize=6, fontweight='bold', color='#64748B')
    ax.text(2.6, 3.25, "CATEGORY", fontsize=6, fontweight='bold', color='#64748B')
    ax.text(3.9, 3.25, "BILLING CYCLE", fontsize=6, fontweight='bold', color='#64748B')
    ax.text(5.0, 3.25, "PRICE", fontsize=6, fontweight='bold', color='#64748B')
    ax.text(5.9, 3.25, "STATUS", fontsize=6, fontweight='bold', color='#64748B')
    ax.text(6.9, 3.25, "ACTIONS", fontsize=6, fontweight='bold', color='#64748B')
    ax.plot([0.5, 7.5], [3.12, 3.12], color='#334155', lw=0.8)

    # Table Data Rows
    rows = [
        ("GitHub Enterprise & Copilot", "Development", "Monthly", "$39.00 USD", "Active", "#10B981"),
        ("AWS Cloud Infrastructure", "Cloud Services", "Monthly", "$68.50 USD", "Active", "#10B981"),
        ("Figma Professional Org", "Design", "Monthly", "$45.00 USD", "Active", "#10B981"),
        ("OpenAI ChatGPT Team", "Productivity", "Monthly", "$20.00 USD", "Active", "#10B981"),
        ("Slack Pro Workspace", "Communication", "Monthly", "$28.00 USD", "Active", "#10B981"),
        ("Notion Team Workspace", "Productivity", "Monthly", "$18.00 USD", "Active", "#10B981"),
        ("Netflix Premium 4K", "Entertainment", "Monthly", "$22.99 USD", "Paused", "#F59E0B"),
    ]
    for idx, (svc, cat, cycle, price, status, col) in enumerate(rows):
        y = 2.85 - idx * 0.38
        ax.text(0.65, y, svc, fontsize=6.8, fontweight='semibold', color='#F3F4F6')
        ax.text(2.6, y, cat, fontsize=6.2, color='#94A3B8')
        ax.text(3.9, y, cycle, fontsize=6.2, color='#94A3B8')
        ax.text(5.0, y, price, fontsize=6.8, fontweight='bold', color='#38BDF8')
        
        # Status Badge
        badge = FancyBboxPatch((5.85, y - 0.1), 0.7, 0.22, boxstyle="round,pad=0.01,rounding_size=0.03",
                               ec="none", fc=col, alpha=0.2, zorder=3)
        ax.add_patch(badge)
        ax.text(6.2, y + 0.01, status, fontsize=5.5, fontweight='bold', color=col, ha='center', va='center', zorder=4)
        
        # Actions
        ax.text(6.9, y, "[Edit]  [Del]", fontsize=5.8, color='#64748B')
        ax.plot([0.5, 7.5], [y - 0.16, y - 0.16], color='#1E293B', lw=0.6)

    ax.set_xlim(0, 8)
    ax.set_ylim(0.2, 4.8)
    ax.axis('off')
    plt.tight_layout()
    plt.savefig('assets_generated/screenshot_subscriptions.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("Generated assets_generated/screenshot_subscriptions.png")

# -------------------------------------------------------------------
# SCREENSHOT 4: SPEND ANALYTICS & INSIGHTS
# -------------------------------------------------------------------
def render_analytics_screen():
    fig, ax = plt.subplots(figsize=(8, 4.8), dpi=300)
    fig.patch.set_facecolor('#0B0F19')
    ax.set_facecolor('#0B0F19')

    # Header Bar
    top = FancyBboxPatch((0.4, 4.15), 7.2, 0.55, boxstyle="round,pad=0.03,rounding_size=0.06",
                         ec="#1E293B", fc="#111827", lw=1, zorder=2)
    ax.add_patch(top)
    ax.text(0.65, 4.42, "Analytics & Smart Insights  |  Spend Optimization", fontsize=9, fontweight='bold', color='#38BDF8', va='center')
    ax.text(7.35, 4.42, "Target Budget: $300.00 / mo", fontsize=6.8, color='#94A3B8', ha='right', va='center')

    # Left Container: Budget Progress & Categories
    b_card = FancyBboxPatch((0.4, 0.4), 3.9, 3.6, boxstyle="round,pad=0.04,rounding_size=0.06",
                            ec="#1E293B", fc="#111827", lw=1, zorder=2)
    ax.add_patch(b_card)
    ax.text(0.65, 3.75, "Category Spending vs Guardrail Caps", fontsize=7.2, fontweight='bold', color='#F3F4F6')

    budgets = [
        ("Cloud Infrastructure", 68.50, 100.00, "#38BDF8"),
        ("Development Tools", 39.00, 60.00, "#10B981"),
        ("Design Systems", 45.00, 50.00, "#F59E0B"),
        ("Productivity & AI", 38.00, 50.00, "#8B5CF6"),
        ("Team Communication", 28.00, 40.00, "#EC4899"),
    ]
    for idx, (name, actual, cap, col) in enumerate(budgets):
        y = 3.3 - idx * 0.62
        pct = int((actual / cap) * 100)
        ax.text(0.65, y+0.16, name, fontsize=6.2, fontweight='semibold', color='#E2E8F0')
        ax.text(4.05, y+0.16, f"${actual:.2f} / ${cap:.2f} ({pct}%)", fontsize=5.8, color='#94A3B8', ha='right')
        
        # Background bar
        bar_bg = FancyBboxPatch((0.65, y-0.08), 3.4, 0.16, boxstyle="round,pad=0.01,rounding_size=0.03",
                                ec="none", fc="#334155", zorder=3)
        ax.add_patch(bar_bg)
        # Fill bar
        bar_fill = FancyBboxPatch((0.65, y-0.08), 3.4 * (actual / cap), 0.16, boxstyle="round,pad=0.01,rounding_size=0.03",
                                  ec="none", fc=col, zorder=4)
        ax.add_patch(bar_fill)

    # Right Container: Smart Cost Optimization Insights
    i_card = FancyBboxPatch((4.5, 0.4), 3.1, 3.6, boxstyle="round,pad=0.04,rounding_size=0.06",
                            ec="#1E293B", fc="#111827", lw=1, zorder=2)
    ax.add_patch(i_card)
    ax.text(4.75, 3.75, "AI Heuristics & Savings", fontsize=7.2, fontweight='bold', color='#38BDF8')

    insights = [
        ("Potential Annual Savings", "Save $275.88 / year", "Switching GitHub & Figma to annual billing saves 15% upfront.", "#10B981"),
        ("Duplicate Functionality", "Review AI Subscriptions", "You have both OpenAI Plus and Copilot active for code assistance.", "#F59E0B"),
        ("Unused License Alert", "Paused Netflix Streaming", "Streaming is paused; saving $22.99 this billing cycle.", "#38BDF8")
    ]
    for idx, (title, tag, desc, col) in enumerate(insights):
        y = 3.3 - idx * 1.05
        # Inner card
        ic = FancyBboxPatch((4.7, y-0.45), 2.7, 0.85, boxstyle="round,pad=0.02,rounding_size=0.04",
                            ec="#334155", fc="#1E293B", lw=1, zorder=3)
        ax.add_patch(ic)
        ax.text(4.85, y+0.22, title, fontsize=6.2, fontweight='bold', color='#FFFFFF')
        ax.text(4.85, y+0.04, tag, fontsize=5.8, fontweight='bold', color=col)
        # multi-line desc
        ax.text(4.85, y-0.2, desc, fontsize=5.2, color='#94A3B8', wrap=True)

    ax.set_xlim(0, 8)
    ax.set_ylim(0.2, 4.8)
    ax.axis('off')
    plt.tight_layout()
    plt.savefig('assets_generated/screenshot_analytics.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("Generated assets_generated/screenshot_analytics.png")

render_login_screen()
render_dashboard_screen()
render_subscriptions_screen()
render_analytics_screen()
