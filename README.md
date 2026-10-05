# Behavioural Investor Signal

A Streamlit dashboard that explores whether behavioural finance indicators add useful context to technical indicators when assessing market direction.
This project began as a live research brief from Lambda BI Ltd, sourced through Uniworx and completed as part of the MSc Data Science programme at the University of Leicester. A group of four completed the research. I independently built the LightGBM classification model, explainability analysis and Streamlit dashboard, then redesigned the dashboard to help investors compare a technical baseline with behavioural signals.

This is an educational research project. Its outputs are historical model estimates, not financial advice or recommendations to buy or sell assets.

### The Question:

### Can behavioural finance indicators improve financial asset prediction beyond technical indicators alone?

The dashboard is designed to make that comparison visible while encouraging users to question what the model can and cannot tell them.

#### What the dashboard shows
- Market direction signals from a LightGBM classification model.
- Technical and behavioural comparisons so users can see how adding behavioural features changes the signal.
- Model performance using classification measures such as F1 score, recall and accuracy.
- Explainability to show which inputs contributed to the model's predictions, including SHAP-based analysis.
- Historical context from daily market data covering 2019–2026.

The research focused on the S&P 500 and FTSE 100, with the Russell 2000 used for external validation. Behavioural inputs included sentiment scores derived with FinBERT and VIX data. Technical inputs included indicators such as RSI, MACD, ADX, Bollinger Bands, EMA, OBV and ATR.

#### Key findings
Adding behavioural indicators improved directional classification in the tested periods, particularly F1 score and recall. The gains were not consistent across every market or metric, and technical indicators remained influential. External validation on the Russell 2000 showed that some models transferred better than others.
These results suggest behavioural features can add context to a directional signal, but they do not establish reliable future performance. Results depend on the market, time period, data availability and modelling choices.

#### How to run
This is a Python and Streamlit project. From the project directory:

'python -m venv .venv'

Activate the environment, then install the project's dependencies:

'pip install -r requirements.txt'

Start the dashboard with Streamlit, using the app's entry-point filename:

'streamlit run app.py'

If the entry-point file has a different name, replace app.py with that filename. The dashboard also depends on the data files and model artifacts expected by the application; keep those files in the locations configured in the project.

####  Tools and methods

- Python, pandas and NumPy for data preparation
- LightGBM for direction classification
- scikit-learn for model evaluation
- FinBERT sentiment features and VIX data for behavioural inputs
- SHAP for model explainability
- Streamlit and Plotly for the dashboard

#### Limitations

- Historical performance does not guarantee future results.
- Sentiment timing and data availability can affect the reliability of behavioural features.
- Model performance varied between the S&P 500 and FTSE 100.
- External validation results differed by model and target.
- The dashboard is a research and decision-support prototype, not a trading system.
  
### Project context

The original work tested whether behavioural indicators could improve prediction beyond a technical-only baseline. The dashboard redesign brings that comparison into a more focused investor workflow: compare the signals, inspect the model's evidence, and make an informed judgement about its limitations.
Author
Aini Aden
