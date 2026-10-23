// Realistic SaaS Subscriptions & Analytics Mock Data for SubSense

export const INITIAL_MOCK_SUBSCRIPTIONS = [
  {
    _id: 'sub-1',
    serviceName: 'GitHub Enterprise & Copilot',
    category: 'Development',
    price: 39.0,
    currency: 'USD',
    billingCycle: 'Monthly',
    renewalDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startDate: '2024-01-15',
    status: 'Active',
    logo: 'GH',
    color: '#22c55e',
    notes: 'Dev team seat licenses and Copilot AI assistance',
    autoRenew: true,
  },
  {
    _id: 'sub-2',
    serviceName: 'Figma Organization',
    category: 'Design',
    price: 45.0,
    currency: 'USD',
    billingCycle: 'Monthly',
    renewalDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startDate: '2024-02-01',
    status: 'Active',
    logo: 'FG',
    color: '#a855f7',
    notes: 'Design systems and UI prototyping workspace',
    autoRenew: true,
  },
  {
    _id: 'sub-3',
    serviceName: 'AWS Cloud Services',
    category: 'Cloud Services',
    price: 68.5,
    currency: 'USD',
    billingCycle: 'Monthly',
    renewalDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startDate: '2023-11-10',
    status: 'Active',
    logo: 'AWS',
    color: '#f97316',
    notes: 'EC2 production cluster, S3 assets, and RDS Postgres',
    autoRenew: true,
  },
  {
    _id: 'sub-4',
    serviceName: 'OpenAI ChatGPT Plus',
    category: 'Productivity',
    price: 20.0,
    currency: 'USD',
    billingCycle: 'Monthly',
    renewalDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startDate: '2024-03-05',
    status: 'Active',
    logo: 'AI',
    color: '#10b981',
    notes: 'GPT-4o API testing and engineering research',
    autoRenew: true,
  },
  {
    _id: 'sub-5',
    serviceName: 'Slack Pro Workspace',
    category: 'Communication',
    price: 28.0,
    currency: 'USD',
    billingCycle: 'Monthly',
    renewalDate: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startDate: '2023-09-12',
    status: 'Active',
    logo: 'SL',
    color: '#06b6d4',
    notes: 'Core team chat, huddles, and webhook integrations',
    autoRenew: true,
  },
  {
    _id: 'sub-6',
    serviceName: 'Notion Team Workspace',
    category: 'Productivity',
    price: 18.0,
    currency: 'USD',
    billingCycle: 'Monthly',
    renewalDate: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startDate: '2024-04-18',
    status: 'Active',
    logo: 'NO',
    color: '#64748b',
    notes: 'Product roadmap, documentation, and sprint tracking',
    autoRenew: true,
  },
  {
    _id: 'sub-7',
    serviceName: 'Netflix Premium 4K',
    category: 'Entertainment',
    price: 22.99,
    currency: 'USD',
    billingCycle: 'Monthly',
    renewalDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startDate: '2023-08-20',
    status: 'Active',
    logo: 'NF',
    color: '#ef4444',
    notes: 'Family media streaming plan',
    autoRenew: true,
  },
  {
    _id: 'sub-8',
    serviceName: 'Vercel Pro',
    category: 'Development',
    price: 20.0,
    currency: 'USD',
    billingCycle: 'Monthly',
    renewalDate: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startDate: '2024-05-01',
    status: 'Active',
    logo: 'VC',
    color: '#38bdf8',
    notes: 'Next.js edge deployments and preview environments',
    autoRenew: true,
  },
  {
    _id: 'sub-9',
    serviceName: 'Spotify Duo',
    category: 'Entertainment',
    price: 14.99,
    currency: 'USD',
    billingCycle: 'Monthly',
    renewalDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startDate: '2023-12-15',
    status: 'Paused',
    logo: 'SP',
    color: '#22c55e',
    notes: 'Paused for holiday break',
    autoRenew: false,
  },
];

export const MONTHLY_SPEND_TREND = [
  { month: 'May', spend: 185.0, budget: 320, savings: 35.0 },
  { month: 'Jun', spend: 210.5, budget: 320, savings: 40.0 },
  { month: 'Jul', spend: 225.0, budget: 320, savings: 30.0 },
  { month: 'Aug', spend: 232.0, budget: 320, savings: 45.0 },
  { month: 'Sep', spend: 248.5, budget: 320, savings: 50.0 },
  { month: 'Oct', spend: 261.49, budget: 320, savings: 58.51 },
];

export const CATEGORY_SPEND_DATA = [
  { name: 'Cloud Services', value: 68.5, color: '#f97316', count: 1 },
  { name: 'Development', value: 59.0, color: '#06b6d4', count: 2 },
  { name: 'Design', value: 45.0, color: '#a855f7', count: 1 },
  { name: 'Productivity', value: 38.0, color: '#10b981', count: 2 },
  { name: 'Entertainment', value: 37.98, color: '#ec4899', count: 2 },
  { name: 'Communication', value: 28.0, color: '#3b82f6', count: 1 },
];

export const SMART_INSIGHTS = [
  {
    id: 'ins-1',
    type: 'saving',
    tag: 'High Impact Saving',
    title: 'Switch Figma Organization to Annual Billing',
    description: 'You are currently paying $45/mo on monthly billing. Switching to annual billing ($36/mo) saves 20%.',
    savingAmount: '$108.00 / year',
    impact: 'High',
    actionText: 'Review Annual Plan',
    service: 'Figma Organization',
    category: 'Design',
  },
  {
    id: 'ins-2',
    type: 'redundancy',
    tag: 'Potential Redundancy',
    title: 'Overlapping Task Management Tools',
    description: 'Both Notion Team ($18/mo) and GitHub Projects are active for task tracking. Consolidating saves money.',
    savingAmount: '$216.00 / year',
    impact: 'Medium',
    actionText: 'Compare Tool Usage',
    service: 'Notion Team Workspace',
    category: 'Productivity',
  },
  {
    id: 'ins-3',
    type: 'alert',
    tag: 'Price Increase Warning',
    title: 'AWS Cloud Services Usage Trending +14%',
    description: 'RDS and S3 egress exceeded previous 30-day baseline by $8.40. Auto-scaling policy review suggested.',
    savingAmount: '$100.80 / year',
    impact: 'Action Needed',
    actionText: 'Inspect AWS Bandwidth',
    service: 'AWS Cloud Services',
    category: 'Cloud Services',
  },
  {
    id: 'ins-4',
    type: 'dormant',
    tag: 'Dormant License Notice',
    title: 'Spotify Duo Subscription is Paused',
    description: 'Plan has been paused for 28 days. Consider cancelling to prevent accidental billing upon resume.',
    savingAmount: '$179.88 / year',
    impact: 'Low',
    actionText: 'Manage Subscription',
    service: 'Spotify Duo',
    category: 'Entertainment',
  },
];

export const BUDGET_SUMMARY = {
  monthlyCap: 320.0,
  currentSpent: 261.49,
  softThresholdPct: 80,
  currency: 'USD',
  categories: [
    { category: 'Cloud Services', spent: 68.5, cap: 80.0, color: 'bg-orange-500' },
    { category: 'Development', spent: 59.0, cap: 70.0, color: 'bg-cyan-500' },
    { category: 'Design', spent: 45.0, cap: 50.0, color: 'bg-purple-500' },
    { category: 'Productivity', spent: 38.0, cap: 50.0, color: 'bg-emerald-500' },
    { category: 'Entertainment', spent: 37.98, cap: 45.0, color: 'bg-pink-500' },
    { category: 'Communication', spent: 28.0, cap: 35.0, color: 'bg-blue-500' },
  ],
};

// Local storage management helpers
const STORAGE_KEY = 'subsense_prototype_subscriptions';

export const getStoredSubscriptions = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_SUBSCRIPTIONS));
      return INITIAL_MOCK_SUBSCRIPTIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_MOCK_SUBSCRIPTIONS;
  }
};

export const setStoredSubscriptions = (subs) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subs));
  } catch (err) {
    console.error('Failed to store subscriptions locally', err);
  }
};
