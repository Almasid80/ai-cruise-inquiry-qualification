# AI Cruise Inquiry Qualification System

AI-powered lead qualification workflow for cruise travel inquiries using
**Google Forms, Google Sheets, Google Apps Script, and Google Gemini
AI**.

The system automatically analyzes incoming cruise inquiries, classifies
their quality and booking intent, and alerts advisors when high-priority
leads appear.

------------------------------------------------------------------------

# Project Overview

Travel agencies receive many cruise inquiries through forms and emails.
Many of these inquiries are vague, exploratory, or incomplete.

Sales advisors must manually review every request before deciding:

-   Which customers are serious
-   Which inquiries need follow-up
-   Which requests can be ignored or handled later

This project builds an **AI-assisted lead qualification system** that
automatically analyzes cruise inquiries and prioritizes the most
valuable leads.

The system uses **Google Gemini AI** to classify each inquiry and
recommend the next action.

------------------------------------------------------------------------

# Key Features

-   Automatic AI classification of cruise inquiries
-   Lead quality scoring (low / medium / high)
-   Travel intent detection
-   Cruise type classification (ocean / river)
-   AI-generated inquiry summary
-   Automatic spreadsheet update
-   Email alerts for high-priority inquiries
-   Event-driven automation using Google Apps Script

------------------------------------------------------------------------

# Problem

Travel advisors often face these issues:

-   Large volumes of incoming inquiries
-   Many inquiries contain incomplete travel details
-   Advisors spend time reviewing low-quality leads
-   Important inquiries may be delayed

Manual qualification slows response time and reduces sales efficiency.

------------------------------------------------------------------------

# Solution

This system automatically evaluates each inquiry using AI and
determines:

-   How serious the customer is
-   Whether the inquiry requires immediate attention
-   What the next recommended action should be

High-quality inquiries trigger automatic alerts so advisors can respond
quickly.

------------------------------------------------------------------------

# Workflow

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

------------------------------------------------------------------------

# Technology Stack

  Component       Technology
  --------------- --------------------
  Form intake     Google Forms
  Data storage    Google Sheets
  Automation      Google Apps Script
  AI analysis     Google Gemini API
  Notifications   Gmail API

------------------------------------------------------------------------

# AI Classification Fields

The AI model returns a structured JSON response with the following
fields.

  Field                    Description
  ------------------------ ------------------------------------
  inquiry_quality          Lead quality (low / medium / high)
  urgency                  Time sensitivity of the request
  cruise_type_classified   Detected cruise type
  travel_intent            Customer booking readiness
  next_action              Recommended advisor action
  ai_summary               Short summary of the inquiry

------------------------------------------------------------------------

# AI Decision Logic

The AI evaluates each inquiry using rules such as:

### High Inquiry Quality

An inquiry is considered **high quality** when it includes multiple
useful travel details such as:

-   destination
-   travel period
-   number of travelers
-   cruise type preference
-   cabin preference
-   request for offers or recommendations

### Medium Inquiry Quality

The inquiry shows interest but lacks enough details for strong
qualification.

### Low Inquiry Quality

The inquiry contains vague or minimal travel information.

------------------------------------------------------------------------

# Travel Intent Classification

  Intent          Meaning
  --------------- --------------------------------------
  research        Customer is exploring options
  comparing       Customer is evaluating alternatives
  ready_to_book   Customer likely intends to book soon

------------------------------------------------------------------------

# Next Action Recommendation

The AI recommends one of the following actions.

  Action             Description
  ------------------ ----------------------------------------------
  send_offers        Send suitable cruise offers
  advisor_callback   Advisor should contact the customer directly
  manual_review      Inquiry requires manual inspection

------------------------------------------------------------------------

# Example Inquiry

    Name: Markus Klein
    Destination: Caribbean
    Travel Period: December 2026
    Travelers: 2

    Message:
    Looking for a Caribbean cruise in December with balcony cabin.
    Please send suitable options.

------------------------------------------------------------------------

# Example AI Output

``` json
{
"inquiry_quality": "high",
"urgency": "medium",
"cruise_type_classified": "ocean",
"travel_intent": "ready_to_book",
"next_action": "send_offers",
"ai_summary": "Customer seeks Caribbean ocean cruise for two in December 2026 with balcony cabin; requests options."
}
```

------------------------------------------------------------------------

# Email Alert System

When the AI detects a strong lead the system sends an email alert.

Condition:

    inquiry_quality = high
    AND
    travel_intent = ready_to_book

The email alert contains:

-   customer information
-   travel details
-   AI classification
-   AI summary

This allows advisors to prioritize high-value inquiries immediately.

------------------------------------------------------------------------

# Spreadsheet Output

Each form submission is automatically enriched with AI insights.

  Column                   Description
  ------------------------ -------------------------------
  Inquiry Quality          Lead strength
  Urgency                  Time sensitivity
  Cruise Type Classified   Ocean / River
  Travel Intent            Booking readiness
  Next Action              Recommended action
  AI Summary               Short AI-generated summary
  Processed                Prevents duplicate processing

------------------------------------------------------------------------

# Automation Trigger

The system uses an Apps Script trigger.

    Function: processLatestRow
    Event Source: From Spreadsheet
    Event Type: On Form Submit

Each form submission automatically activates the AI classification
process.

------------------------------------------------------------------------

# Installation

1.  Create a Google Form for cruise inquiries
2.  Link the form to a Google Sheet
3.  Open **Apps Script** from the spreadsheet
4.  Paste the project script
5.  Add your Gemini API key to Script Properties

```{=html}
<!-- -->
```
    Key: GEMINI_API_KEY
    Value: My_api_key_here

6.  Create the Apps Script trigger

```{=html}
<!-- -->
```
    Function: processLatestRow
    Event Source: From Spreadsheet
    Event Type: On Form Submit

------------------------------------------------------------------------

# System Architecture

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

------------------------------------------------------------------------

# Use Cases

Travel agencies can use this system to:

-   automatically qualify cruise inquiries
-   prioritize serious customers
-   reduce manual review
-   speed up advisor response time
-   improve sales efficiency

------------------------------------------------------------------------

# Future Improvements

Possible extensions:

-   CRM integration
-   automated cruise offer generation
-   AI follow-up emails
-   lead scoring dashboards
-   booking probability prediction
-   multi-language inquiry support

------------------------------------------------------------------------

# Author

Almamy\
Data & Process Analysis Apprentice

Focus areas:

-   AI automation
-   data-driven workflows
-   business process optimization
-   scalable automation systems

------------------------------------------------------------------------

# License

This project is intended for educational and portfolio purposes.
