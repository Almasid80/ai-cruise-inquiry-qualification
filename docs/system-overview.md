
# System Overview

## Purpose

The **AI Cruise Inquiry Qualification System** is an automation workflow designed to classify and prioritize cruise travel inquiries using artificial intelligence.

Travel agencies often receive many inquiries that vary widely in quality. Some contain detailed booking information, while others are vague or exploratory. This system automatically evaluates each inquiry and helps advisors focus on the most valuable leads.

The goal of the system is to:

- reduce manual inquiry review
- identify high-quality leads quickly
- prioritize advisor response
- standardize lead qualification
- create a scalable automation workflow

---

# System Flow

```
Customer
   ↓
Google Form
   ↓
Google Sheets Database
   ↓
Apps Script Trigger
   ↓
Gemini AI API
   ↓
Lead Classification
   ↓
Spreadsheet Update
   ↓
Email Alert
```

---

# Component Breakdown

## 1. Customer Input Layer

Customers submit cruise inquiries through a **Google Form**.  
The form collects structured information such as:

- name
- email
- cruise type preference
- destination
- travel period
- number of travelers
- message

This structured format ensures that the AI receives consistent input.

---

## 2. Data Storage Layer

The form automatically stores all submissions in a **Google Sheets database**.

Each submission becomes a new row in the spreadsheet.  
This sheet acts as the **central data source** for the automation workflow.

Additional columns store the AI classification results:

- inquiry_quality
- urgency
- cruise_type_classified
- travel_intent
- next_action
- ai_summary
- processed

---

## 3. Automation Layer

A **Google Apps Script trigger** runs automatically when a new form submission appears.

Trigger configuration:

```
Function: processLatestRow
Event Source: From Spreadsheet
Event Type: On Form Submit
```

This trigger activates the automation pipeline without manual intervention.

---

## 4. AI Classification Layer

The Apps Script sends the inquiry data to the **Google Gemini API**.

Gemini analyzes the message using a structured prompt that defines:

- classification rules
- allowed values
- decision logic
- output format

The AI returns a structured JSON object describing the inquiry.

Example fields returned by the model:

- inquiry_quality
- urgency
- cruise_type_classified
- travel_intent
- next_action
- ai_summary

---

## 5. Data Enrichment Layer

After receiving the AI response, the script writes the classification results back into the spreadsheet.

Each inquiry row becomes enriched with AI-generated insights.

Example:

| Inquiry Quality | Urgency | Cruise Type | Travel Intent | Next Action |
|----------------|--------|-------------|--------------|-------------|
| high | medium | ocean | ready_to_book | send_offers |

This enables quick review by advisors.

---

## 6. Alert & Notification Layer

If a **high-value inquiry** is detected, the system automatically sends an email alert.

Trigger condition:

```
inquiry_quality = high
AND
travel_intent = ready_to_book
```

The email contains:

- customer information
- travel details
- AI classification results
- AI summary

This ensures advisors respond quickly to the most valuable leads.

---

# Data Flow Summary

1. Customer submits inquiry
2. Google Form records submission
3. Data appears in Google Sheets
4. Apps Script trigger runs automatically
5. Inquiry is sent to Gemini AI
6. AI returns classification JSON
7. Spreadsheet is updated with results
8. Email alert is sent if inquiry is high priority

---

# Design Principles

The system is built around several key design principles:

**Event-Driven Automation**  
The system runs automatically when new data arrives.

**Structured AI Output**  
AI responses are constrained to valid JSON for reliable parsing.

**Separation of Concerns**  
Data storage, automation, and AI analysis are handled by separate components.

**Scalability**  
The workflow can handle increasing inquiry volumes without additional manual effort.

---

# Use Cases

Travel agencies can use this system to:

- automatically qualify cruise inquiries
- prioritize high-value leads
- reduce manual data review
- improve advisor response time
- support scalable sales workflows

---

# Future Extensions

Potential improvements include:

- CRM integration
- automated cruise offer generation
- AI-generated follow-up emails
- lead scoring dashboards
- booking probability prediction
- multilingual inquiry processing
