# 🚀 FairGadi

**Team Name:** _Techtonic_  
**Hackathon:** _Fantom Code 2025_  
**Date:** _12/04/2025_

---

## 📖 Table of Contents

1. [Introduction](#-introduction)
2. [Problem Statement](#-problem-statement)
3. [Solution Overview](#-solution-overview)
4. [Tech Stack](#-tech-stack)
5. [Architecture / Diagram (if any)](#-architecture--diagram-if-any)
6. [Installation & Usage](#-installation--usage)
7. [Team Members](#-team-members)

---

## 🧠 Introduction

_A centralized ride fare comparison tool that estimates fares using a distance-based formula and a machine learning model to predict surge pricing (based on day/time), with Google Maps for route visualization—no need for direct cab API integration._

_Everyday commuters and ride-hailing users seeking transparent, predictable fare estimates—especially those frustrated with surge pricing. Also appeals to tech-savvy users interested in future-ready tools._

_It tackles fare unpredictability with clear calculations and predictive insights, empowering users to plan economically. It builds trust, simplifies choices, and is scalable for future live-data integration._

---

## ❗ Problem Statement

_**Problem**
Ride-hailing fare pricing is fragmented and unclear. Users juggle multiple apps, often facing unpredictable surge charges, leading to frustration and lack of trust._

_**Solution**
We simplify this with a transparent distance-based fare formula and ML-driven surge prediction (based on day/time). This gives users consistent, predictable pricing and helps them avoid peak fares._

_**Why it matters**
Transportation should be fair and predictable. Our app reduces confusion, builds trust, and empowers users to make smarter, cost-effective ride decisions._

---

## ✅ Solution Overview

_**Surge Pricing Prediction**
We use a machine learning model that analyzes the day and time to forecast potential surge pricing. This helps users avoid peak periods and plan cost-effective rides._

_**Google Maps Integration**
Google Maps is embedded to show routes, pickup/drop-off points, and distances—adding clarity to fare calculations and building user trust through visual context._

_**User-Friendly Interface**
The web app offers a smooth, interactive experience. Users get real-time fare comparisons, surge predictions, and maps—all in one unified, intuitive interface._

_**Modular and Scalable Design with Data**
With the use of data, we’ve quickly validated our approach without the overhead of managing multiple external APIs. This lean setup allows us to focus on perfecting key functionalities. Moreover, our modular design means that when API integrations become possible in the future, adding live data will be a seamless upgrade rather than a complete system overhaul._

---

## 🛠️ Tech Stack

- **Frontend:** _React_  
- **Backend:** _Node.js_  
- **Database:** _MongoDB_  
- **APIs / Libraries:** _Fast API, Scikit-learn, Google Maps API, Tailwind CSS, Express, Pandas, NumPy, Scikit learn, Random forest_  
- **Tools:** _GitHub Actions_

---

## 🧩 Architecture / Diagram (if any)
![Architecture of our web application](../FairGadi/frontend/src/assets/architecture.png)

---

## 🧪 Installation & Usage

### Prerequisites

- Node.js / Python 
- Dependencies listed in `package.json` `

### Steps

```bash
# Clone the repository
git clone https://github.com/your-repo-url.git

# Navigate into the project directory
cd your-project

# Install dependencies
npm install

# Start the development server
npm start

