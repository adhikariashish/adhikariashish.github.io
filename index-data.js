window.INDEX_DATA = {
  projects: [
    {
      name: "Hybrid Black-Scholes PINN",
      domain: "FinTech | PINNs",
      tech: "PDE-constrained pricing | PyTorch | Streamlit",
      cat: "fintech",
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
      details: [
        "Created a retrieval-first RAG assistant for document-grounded enterprise Q&A.",
        "Implemented deterministic no-answer behavior, distance-based retrieval validation, and citation controls.",
        "Shipped streaming responses and a modular configuration-driven architecture for deployment."
      ]
    },
    {
      name: "Cashflow Intelligence",
      domain: "FinTech | Cashflow Intelligence",
      tech: "Forecasting | Explainability | Decision Support",
      cat: "fintech",
      details: [
        "Built a cashflow intelligence system for forward-looking liquidity planning and executive decision support.",
        "Combined scenario-based forecasting with feature-level explanations to highlight key drivers of cash movement.",
        "Designed outputs for finance operations, including risk flags and short-horizon action guidance."
      ]
    }
  ]
};
