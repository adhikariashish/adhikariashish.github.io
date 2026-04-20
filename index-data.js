window.INDEX_DATA = {
  projects: [
    {
      name: "Cashflow Intelligence",
      domain: "FinTech | Cashflow Intelligence",
      tech: "Forecasting | Explainability | Decision Support",
      cat: "fintech",
      github: "https://github.com/adhikariashish/cashflow-intelligence.git",
      details: [
        "Built a cashflow intelligence system for forward-looking liquidity planning and executive decision support.",
        "Combined scenario-based forecasting with feature-level explanations to highlight key drivers of cash movement.",
        "Designed outputs for finance operations, including risk flags and short-horizon action guidance."
      ]
    },
    {
      name: "API-Driven Analytics Monitoring Systems",
      domain: "Healthcare | Supply Chain",
      tech: "Power BI | Tableau | API ingestion",
      cat: "healthcare",
      links: [
        {
          label: "Power BI",
          url: "https://app.powerbi.com/groups/me/reports/842ae052-c41e-4a96-9f88-406829f66d27/2de2f98dabb12d8d0a0c?experience=power-bi"
        },
        {
          label: "Tableau",
          url: "https://public.tableau.com/app/profile/ashish.adhikari7397/viz/GlobalSupplyChainPressureMonitor/SupplyChain"
        }
      ],
      details: [
        "Developed an API-driven healthcare analytics dashboard using CDC NHSN hospital capacity datasets to monitor ICU utilization and respiratory admission trends.",
        "Built a global supply-chain pressure monitor integrating GSCPI, freight rates, oil prices, and industrial production through automated API ingestion and cloud-based pipelines.",
        "Healthcare dashboard: https://app.powerbi.com/groups/me/reports/842ae052-c41e-4a96-9f88-406829f66d27/2de2f98dabb12d8d0a0c?experience=power-bi"
      ]
    },
    {
      name: "Hybrid Black-Scholes PINN",
      domain: "FinTech | PINNs",
      tech: "PDE-constrained pricing | PyTorch | Streamlit",
      cat: "fintech",
      github: "https://github.com/adhikariashish/hybrid-black-scholes-option-pricing-pinn",
      details: [
        "Built a physics-informed neural network for Black-Scholes option pricing with PDE, terminal, and boundary constraints in the loss.",
        "Used float64 precision, strike-focused collocation sampling, and periodic resampling to improve numerical stability.",
        "Benchmarked against analytical Black-Scholes outputs and packaged diagnostics in a Streamlit interface."
      ]
    },
    {
      name: "ERCOT Probabilistic Load Forecasting",
      domain: "Energy | Forecasting",
      tech: "Transformer + constraints | 24h uncertainty",
      cat: "energy",
      github: "https://github.com/adhikariashish/Physics-Constrained-Probabilistic-Load-Forecasting",
      details: [
        "Developed a 24-hour ahead probabilistic demand forecasting pipeline for grid operations.",
        "Compared LSTM, Transformer, and physics-constrained Transformer models with uncertainty intervals.",
        "Added risk-tier detection and interactive forecast visualization for operational planning."
      ]
    },
    {
      name: "Credit Risk Model",
      domain: "FinTech | Credit",
      tech: "IFRS 9 framing | explainability | model risk",
      cat: "fintech",
      github: "https://github.com/adhikariashish/credit-risk-ml-pipeline-Xgboost-fairlearn",
      details: [
        "Designed an explainable credit risk workflow aligned to IFRS 9 use cases.",
        "Combined gradient boosting models with explainability and calibration checks for auditability.",
        "Focused on governance-ready outputs for finance and risk stakeholders."
      ]
    },
    {
      name: "Hybrid Siamese Change Detection",
      domain: "Computer Vision | Satellite",
      tech: "Siamese UNet++ | Mamba fusion | DefAlign",
      cat: "cv",
      github: "https://github.com/adhikariashish/hybrid-fusion-change-detection",
      details: [
        "Implemented a hybrid Siamese architecture for binary change detection in temporal satellite imagery.",
        "Combined cross-attention, Mamba-based fusion, and optional deformable alignment for robustness to spatial shifts.",
        "Used boundary-aware supervision to improve edge localization and thin-object detection."
      ]
    },
    {
      name: "Real-Time IoT Streaming Dashboard",
      domain: "IoT | Streaming Analytics",
      tech: "MQTT | SQLite | Plotly | Streamlit",
      cat: "iot",
      github: "https://github.com/adhikariashish/Real-Time-IoT-Analytics-Dashboard-MQTT-Streamlit-SQLite",
      details: [
        "Built a real-time sensor analytics dashboard with MQTT ingestion, SQLite storage, and Streamlit views.",
        "Tracked temperature, humidity, and CO2 metrics with KPI panels and trend charts.",
        "Added a weighted comfort score and modular components to support future alerting logic."
      ]
    },
    {
      name: "Enterprise RAG Assistant",
      domain: "Enterprise AI | RAG",
      tech: "Citation-grounded QA | FastAPI | Chroma",
      cat: "rag",
      github: "https://github.com/adhikariashish/enterprise-rag-assistant",
      details: [
        "Created a retrieval-first RAG assistant for document-grounded enterprise Q&A.",
        "Implemented deterministic no-answer behavior, distance-based retrieval validation, and citation controls.",
        "Shipped streaming responses and a modular configuration-driven architecture for deployment."
      ]
    }
  ]
};
