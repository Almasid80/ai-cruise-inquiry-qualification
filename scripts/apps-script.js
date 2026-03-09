// ─────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────

// Retrieve the Gemini API key stored securely in Script Properties
// (never hard-code API keys directly in the script)
const API_KEY = PropertiesService
  .getScriptProperties()
  .getProperty('GEMINI_API_KEY');

// The email address that receives alerts for high-priority inquiries
const ALERT_EMAIL = 'almamysidibe111@gmail.com';


// ─────────────────────────────────────────────
// FUNCTION: analyzeInquiry
// Sends the inquiry to Gemini AI and returns a
// structured JSON classification of the lead.
// ─────────────────────────────────────────────
function analyzeInquiry(inquiry) {

  // Build the prompt sent to Gemini.
  // It instructs the model to classify the inquiry across 6 fields
  // and defines exactly what values are allowed for each field.
  const prompt = `
You are an AI assistant for cruise inquiry qualification.

Analyze the following cruise inquiry and return ONLY valid JSON.
Do not add markdown.
Do not wrap the JSON in code fences.
Do not add explanations before or after the JSON.
Return exactly one JSON object.

Use exactly these fields:
- inquiry_quality
- urgency
- cruise_type_classified
- travel_intent
- next_action
- ai_summary

Allowed values:
- inquiry_quality: low, medium, high
- urgency: low, medium, high
- cruise_type_classified: ocean, river, unknown
- travel_intent: research, comparing, ready_to_book
- next_action: send_offers, advisor_callback, manual_review

Classification rules:

inquiry_quality = high when:
- the inquiry includes multiple useful details
- and shows real booking interest
- and includes at least some of the following: destination, travel period, traveler count, cruise preference, cabin preference, flights included

inquiry_quality = medium when:
- there is some real interest
- but not enough detail for strong qualification

inquiry_quality = low when:
- the inquiry is vague
- or contains almost no useful travel information

urgency = high when:
- travel is soon
- or the customer explicitly asks for a callback quickly
- or the message suggests immediate booking intent

urgency = medium when:
- there is clear interest but no strong time pressure

urgency = low when:
- the inquiry is exploratory and not time-sensitive

travel_intent = ready_to_book when:
- the inquiry includes clear travel criteria
- and the customer wants offers, recommendations, or contact

travel_intent = comparing when:
- the customer has some preferences
- but is still exploring options

travel_intent = research when:
- the inquiry is broad, vague, or only asks generally about offers

next_action = advisor_callback when:
- inquiry_quality is high
- and travel_intent is ready_to_book
- and the request is detailed enough for direct advisor follow-up

next_action = send_offers when:
- the inquiry is useful
- but can first be handled with suitable offers

next_action = manual_review when:
- the inquiry is unclear, mixed, or unusual

Important decision rules:
- If the inquiry includes destination, travel period, traveler count, and a clear request for offers or contact, do not classify travel_intent as research.
- In such cases, classify travel_intent as ready_to_book or comparing.
- If the inquiry includes destination, travel period, traveler count, and at least one preference such as cruise type, cabin type, or flights included, classify inquiry_quality as high unless the message is clearly vague.
- If the inquiry includes enough detail for an advisor to prepare suitable options, do not classify next_action as manual_review.
- If the customer explicitly asks for suitable offers or options and provides multiple travel details, prefer ready_to_book over research.

Write ai_summary as one short professional sentence with a maximum of 20 words.

Inquiry:
Name: ${inquiry.name}
Email: ${inquiry.email}
Cruise Type Preference: ${inquiry.cruiseType}
Destination: ${inquiry.destination}
Travel Period: ${inquiry.travelPeriod}
Travelers: ${inquiry.travelers}
Message: ${inquiry.message}
`;

  // Gemini API endpoint — model and API key are appended as a query parameter
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  // Request body: wrap the prompt in the required Gemini content structure.
  // Low temperature (0.1) keeps the output consistent and less random.
  const payload = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.1
    }
  };

  // HTTP POST options for UrlFetchApp.
  // muteHttpExceptions: true prevents the script from crashing on API errors —
  // we handle errors manually below instead.
  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  // Call the Gemini API and get the raw response text
  const response = UrlFetchApp.fetch(url, options);
  const responseText = response.getContentText();
  Logger.log(responseText);

  // Parse the outer API response envelope
  const json = JSON.parse(responseText);

  // Validate that the response has the expected nested structure.
  // If Gemini returned an error or unexpected format, throw a descriptive error.
  if (!json.candidates || !json.candidates[0] || !json.candidates[0].content || !json.candidates[0].content.parts) {
    throw new Error('Unexpected Gemini response: ' + responseText);
  }

  // Extract the actual text content from the nested Gemini response structure
  const text = json.candidates[0].content.parts[0].text;

  // Strip any accidental markdown code fences Gemini may have added,
  // then trim whitespace — we need clean JSON to parse
  const cleaned = text
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();

  Logger.log(cleaned);

  // Parse and return the final classification object
  return JSON.parse(cleaned);
}


// ─────────────────────────────────────────────
// FUNCTION: processLatestRow
// Reads the most recently submitted inquiry from
// the sheet, runs AI analysis, writes results
// back, and sends an alert email if high-priority.
//
// This function should be triggered automatically
// whenever a new form submission is added (e.g.
// via an Apps Script onFormSubmit trigger).
// ─────────────────────────────────────────────
function processLatestRow() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();

  // Exit early if the sheet has no data rows (row 1 is the header)
  if (lastRow < 2) return;

  // Read all 15 columns of the last row in one call (more efficient than individual reads)
  const row = sheet.getRange(lastRow, 1, 1, 15).getValues()[0];

  // Destructure each column into a named variable.
  // Columns 1–8 come from the form; columns 9–15 are filled in by this script.
  const [
    timestamp,
    name,
    email,
    cruiseType,
    destination,
    travelPeriod,
    travelers,
    message,
    inquiryQuality,    // written by script (col 9)
    urgency,           // written by script (col 10)
    cruiseTypeClassified, // written by script (col 11)
    travelIntent,      // written by script (col 12)
    nextAction,        // written by script (col 13)
    aiSummary,         // written by script (col 14)
    processed          // "YES" flag to prevent duplicate processing (col 15)
  ] = row;

  // Skip this row if it has already been processed — prevents re-running on re-triggers
  if (processed === 'YES') return;

  // Build the inquiry object to pass into the AI analysis function
  const inquiry = {
    name: name || '',
    email: email || '',
    cruiseType: cruiseType || '',
    destination: destination || '',
    travelPeriod: travelPeriod || '',
    travelers: travelers || '',
    message: message || ''
  };

  // Send the inquiry to Gemini and get back the structured classification
  const result = analyzeInquiry(inquiry);

  // Write each AI result back into its corresponding column (cols 9–14)
  sheet.getRange(lastRow, 9).setValue(result.inquiry_quality || '');
  sheet.getRange(lastRow, 10).setValue(result.urgency || '');
  sheet.getRange(lastRow, 11).setValue(result.cruise_type_classified || '');
  sheet.getRange(lastRow, 12).setValue(result.travel_intent || '');
  sheet.getRange(lastRow, 13).setValue(result.next_action || '');
  sheet.getRange(lastRow, 14).setValue(result.ai_summary || '');

  // Mark the row as processed so it won't be analysed again (col 15)
  sheet.getRange(lastRow, 15).setValue("YES");

  // ── ALERT EMAIL ──────────────────────────────
  // Only send an email for the hottest leads:
  // quality = high AND intent = ready_to_book.
  // This keeps the inbox focused on actionable inquiries.
  if (result.inquiry_quality === 'high' && result.travel_intent === 'ready_to_book') {
    GmailApp.sendEmail(
      ALERT_EMAIL,
      'High-Priority Cruise Inquiry Detected',
      `A high-priority cruise inquiry was detected.

Name: ${name}
Email: ${email}
Cruise Type Preference: ${cruiseType}
Destination: ${destination}
Travel Period: ${travelPeriod}
Travelers: ${travelers}
Message: ${message}

Inquiry Quality: ${result.inquiry_quality}
Urgency: ${result.urgency}
Cruise Type Classified: ${result.cruise_type_classified}
Travel Intent: ${result.travel_intent}
Next Action: ${result.next_action}
AI Summary: ${result.ai_summary}`
    );
  }
}
