# System Architecture

## Overview

This project uses an event-driven AI automation workflow to classify cruise inquiries automatically.

## Architecture Flow

```text
Customer
↓
Google Form
↓
Google Sheets
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

## Layer Breakdown

### 1. Input Layer
The customer submits a cruise inquiry through Google Forms.

### 2. Data Storage Layer
Google Forms writes the inquiry into Google Sheets.

### 3. Automation Layer
A Google Apps Script trigger runs automatically on every form submission.

### 4. AI Layer
The script sends the inquiry to Gemini AI and requests a structured JSON classification.

### 5. Output Layer
The system writes the AI result back into the spreadsheet and sends an email alert for strong inquiries.

## Trigger Configuration

```text
Function: processLatestRow
Event Source: From Spreadsheet
Event Type: On Form Submit
```

## AI Output Fields

The AI returns these fields:

- inquiry_quality
- urgency
- cruise_type_classified
- travel_intent
- next_action
- ai_summary

## Business Purpose

This architecture helps a travel company:

- prioritize stronger inquiries
- reduce manual qualification work
- improve response speed
- create a repeatable inquiry-handling workflow
