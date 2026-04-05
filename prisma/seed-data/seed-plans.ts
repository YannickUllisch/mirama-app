

export const DEFAULT_PLANS = [
  {
    name: "Free Tier",
    description: "Perfect for solo designers trying out the platform.",
    price: 0, // In cents
    interval: "month",
    features: {
      maxOrganizations: 1,      // Just for the freelancer's own brand
      maxProjectsPerOrg: 3,     
      storageGb: 5,             
      maxMembersPerOrg: 2,      // Freelancer + 1 guest
      hasApprovalFlows: false,  // Upsell hook!
      canCustomBrand: false,    
    },
  },
  {
    name: "Freelancer Plus",
    description: "For active freelancers who manage multiple clients and need professional sign-offs.",
    price: 1999, // 19.99 EUR / month
    interval: "month",
    features: {
      maxOrganizations: 10,     // Allows 1 organization per client for clean isolation
      maxProjectsPerOrg: 15, 
      storageGb: 50,           // More mockups and revisions
      maxMembersPerOrg: 5,      // Freelancer + a few client stakeholders
      hasApprovalFlows: true,   // Unlocked!
      canCustomBrand: false,
    },
  },
  {
    name: "Pro Studio",
    description: "Ideal for growing design studios and collaborative teams.",
    price: 4999, // 49.99 EUR / month
    interval: "month",
    features: {
      maxOrganizations: 25,
      maxProjectsPerOrg: 100, 
      storageGb: 300,          
      maxMembersPerOrg: 20,
      hasApprovalFlows: true,
      canCustomBrand: true,    // Studios love white-labeling
    },
  },
  {
    name: "Enterprise Agency",
    description: "For large design agencies operating at scale.",
    price: 19999, // 199.99 EUR / month
    interval: "month",
    features: {
      maxOrganizations: 999,   
      maxProjectsPerOrg: 999,
      storageGb: 1000,         // 1 TB of storage
      maxMembersPerOrg: 999,
      hasApprovalFlows: true,
      canCustomBrand: true,
    },
  },
] as const;
