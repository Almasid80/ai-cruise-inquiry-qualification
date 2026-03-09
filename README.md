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
JSON Parsing  
↓  
Schema Validation  
↓  
Spreadsheet Update  
↓  
Email Alert  

Detailed process:

1. A customer submits the cruise inquiry form  
2. Google Forms writes the response into Google Sheets  
3. A Google Apps Script trigger runs automatically on form submission  
4. The newest inquiry is sent to Gemini AI  
5. Gemini returns structured JSON classification  
6. Apps Script parses and validates the AI response  
7. Apps Script writes the result into the spreadsheet  
8. If the inquiry is strong enough, an email alert is sent automatically  

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

Name: Sofia Wagner  
Email: sofia@test.com  
Cruise Type Preference: Ocean  
Destination / Route: Mediterranean  
Travel Period: July 2026  
Number of Travelers: 2  
Message: We are looking for a Mediterranean cruise in July for 2 adults with balcony cabin and flights included. Please send suitable options.

---

### Sheet structure

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
| O | Status |

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

---

## 5. Output

### Spreadsheet enrichment

After the AI runs, the sheet is automatically updated with:

- inquiry quality
- urgency
- classified cruise type
- travel intent
- next action
- AI summary
- processing status

### Email alert

If the AI detects a high-value inquiry, the system sends an automatic email.

Alert condition:

inquiry_quality = high  
AND  
travel_intent = ready_to_book  

---

## 6. Processing Status

| Status | Meaning |
|---|---|
| PROCESSED | Inquiry successfully analyzed |
| ERROR | AI processing failed or invalid response |

---

## 7. Reliability Controls

The script includes multiple safeguards.

### AI schema validation

The Gemini response is validated to ensure:

- required fields exist  
- values belong to allowed enums  
- ai_summary is a valid string  

### Error handling

If processing fails:

- the error message is written into the sheet  
- the row is marked `ERROR`  
- the failure is logged  

---

## 8. Engineering Improvements

Compared with the initial prototype, this version includes:

- centralized configuration object  
- modular function architecture  
- Gemini response validation  
- enum enforcement for AI outputs  
- batch spreadsheet writes for performance  
- explicit processing statuses  
- improved logging and error handling  

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

Function: processLatestRow  
Event Source: From Spreadsheet  
Event Type: On Form Submit  

---

## Installation

1. Create the Google Form  
2. Link it to a Google Sheet  
3. Add the spreadsheet columns for AI output  
4. Open **Extensions → Apps Script**  
5. Paste the Apps Script automation  
6. Add the Gemini API key in **Script Properties**

Key: GEMINI_API_KEY  
Value: YOUR_API_KEY  

7. Create the form submission trigger

Function: processLatestRow  
Event Source: From Spreadsheet  
Event Type: On Form Submit  

---

## Known Limitations

The current version processes only the **latest submitted row** rather than scanning all unprocessed rows.

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
