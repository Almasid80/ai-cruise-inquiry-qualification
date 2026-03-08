# AI Cruise Inquiry Qualification System

AI-powered cruise inquiry qualification workflow built with **Google Forms**, **Google Sheets**, **Google Apps Script**, and **Google Gemini AI**.

This project simulates how a travel company can automatically evaluate incoming cruise inquiries, classify booking intent, and alert advisors when a lead is strong enough to prioritize.

---

## Overview

Travel companies receive many inquiries, but not all of them are equally valuable.

Some customers provide:

- destination
- travel period
- number of travelers
- cruise type preference
- clear request for offers or contact

Others send only vague messages such as:

- "Do you have offers?"
- "I want a cruise"

Manually reviewing every inquiry slows down response time and wastes advisor capacity.

This system automates the first qualification step.

---

## 1. Problem

A cruise travel business has to process many incoming inquiries, but the quality of those inquiries varies significantly.

Typical operational problems include:

- advisors spending time on low-quality inquiries
- delayed responses to serious customers
- inconsistent qualification logic
- no structured prioritization
- repeated manual review of similar requests

Without automation, valuable leads can be buried among vague or exploratory requests.

---

## 2. Workflow

The automation follows this sequence:

```text
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

Detailed process:

1. A customer submits the cruise inquiry form
2. Google Forms writes the response into Google Sheets
3. A Google Apps Script trigger runs automatically on form submission
4. The newest inquiry is sent to Gemini AI
5. Gemini returns structured JSON classification
6. Apps Script writes the result into the spreadsheet
7. If the inquiry is strong enough, an email alert is sent automatically

---

## 3. Input

The system receives inquiry data through a Google Form.

### Form fields

| Field | Type |
|---|---|
| Name | Short answer |
| Email | Short answer |
| Cruise Type Preference | Dropdown |
| Destination / Route | Short answer |
| Travel Period | Short answer |
| Number of Travelers | Short answer |
| Message | Paragraph |

### Example input

```text
Name: Sofia Wagner
Email: sofia@test.com
Cruise Type Preference: Ocean
Destination / Route: Mediterranean
Travel Period: July 2026
Number of Travelers: 2
Message: We are looking for a Mediterranean cruise in July for 2 adults with balcony cabin and flights included. Please send suitable options.
```

### Sheet structure

The spreadsheet stores raw input and AI output together.

| Column | Field |
|---|---|
| A | Timestamp |
| B | Name |
| C | Email |
| D | Cruise Type Preference |
| E | Destination / Route |
| F | Travel Period |
| G | Number of Travelers |
| H | Message |
| I | Inquiry Quality |
| J | Urgency |
| K | Cruise Type Classified |
| L | Travel Intent |
| M | Next Action |
| N | AI Summary |
| O | Processed |

---

## 4. AI Logic

Gemini AI receives the inquiry and returns structured classification in JSON.

### Output fields

| Field | Description |
|---|---|
| inquiry_quality | Lead quality: low, medium, high |
| urgency | Time sensitivity: low, medium, high |
| cruise_type_classified | ocean, river, unknown |
| travel_intent | research, comparing, ready_to_book |
| next_action | send_offers, advisor_callback, manual_review |
| ai_summary | Short professional summary |

### Classification logic

The prompt instructs the model to evaluate the inquiry using business rules.

#### Inquiry Quality

- **high** → detailed inquiry with real booking interest
- **medium** → some interest, but not enough detail for strong qualification
- **low** → vague inquiry with little useful travel information

#### Urgency

- **high** → near-term travel or strong immediate intent
- **medium** → clear interest without strong time pressure
- **low** → exploratory, not time-sensitive

#### Travel Intent

- **research** → broad, vague, exploratory
- **comparing** → customer has some preferences and is evaluating options
- **ready_to_book** → customer provides clear criteria and requests offers or contact

#### Next Action

- **send_offers** → inquiry is useful and can first be handled with suitable options
- **advisor_callback** → inquiry is high quality and likely ready to book
- **manual_review** → unclear, mixed, or unusual case

### Example AI output

```json
{
  "inquiry_quality": "high",
  "urgency": "medium",
  "cruise_type_classified": "ocean",
  "travel_intent": "ready_to_book",
  "next_action": "send_offers",
  "ai_summary": "Customer seeks Mediterranean ocean cruise for two in July 2026 with balcony cabin and flights included."
}
```

---

## 5. Output

The system produces two business outputs.

### A. Spreadsheet enrichment

After the AI runs, the sheet is automatically updated with:

- inquiry quality
- urgency
- classified cruise type
- travel intent
- next action
- AI summary
- processed flag

This turns raw form data into structured operational information.

### B. Email alert

If the AI detects a high-value inquiry, the system sends an automatic email.

### Alert condition

```text
inquiry_quality = high
AND
travel_intent = ready_to_book
```

### Alert content

The email includes:

- customer name
- email
- cruise preference
- destination
- travel period
- travelers
- original message
- AI classification
- AI summary

This allows an advisor to react immediately.

---

## 6. Business Value

This project demonstrates how AI can improve travel inquiry handling in a practical way.

### Operational value

- reduces manual review effort
- prioritizes stronger leads
- creates more consistent qualification logic
- improves response speed for valuable inquiries
- structures inquiry handling for advisors

### Commercial value

- stronger leads can be contacted faster
- weak inquiries no longer consume the same amount of time
- customer response quality improves
- qualification becomes repeatable and scalable

### Why this matters

This is not just an AI demo. It is a small business workflow automation system.

It shows how AI can be placed inside a real process:

- data enters through a form
- automation routes the data
- AI interprets the inquiry
- the system produces business action

---

## Technology Stack

| Component | Technology |
|---|---|
| Form intake | Google Forms |
| Data storage | Google Sheets |
| Automation | Google Apps Script |
| AI analysis | Google Gemini API |
| Notifications | Gmail |

---

## Trigger Configuration

The Apps Script trigger is configured as follows:

```text
Function: processLatestRow
Event Source: From Spreadsheet
Event Type: On Form Submit
```

---

## Installation

1. Create the Google Form
2. Link it to a Google Sheet
3. Add the spreadsheet columns for AI output
4. Open **Extensions → Apps Script**
5. Paste the Apps Script automation
6. Add the Gemini API key in **Script Properties**

```text
Key: GEMINI_API_KEY
Value: YOUR_API_KEY
```

7. Create the form submission trigger

```text
Function: processLatestRow
Event Source: From Spreadsheet
Event Type: On Form Submit
```

---

## Current Version Scope

Version 1 includes:

- form intake
- spreadsheet database
- AI inquiry classification
- automatic trigger
- processed-row protection
- email alert for strong inquiries

---

## Future Improvements

Possible next versions:

- CRM integration
- advisor dashboard
- automatic follow-up email drafting
- booking probability scoring
- multilingual support
- full processing of all unprocessed rows instead of latest row only

---

## Author

**Almamy**  
Data & Process Analysis Apprentice

Focus areas:

- AI automation
- data-driven workflows
- process optimization
- scalable business systems

---

## License

This project is intended for **educational and portfolio purposes**.
