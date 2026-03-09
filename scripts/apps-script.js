// ─────────────────────────────────────────────
// CONFIGURATION
// Central place for API settings, alert email,
// and spreadsheet column mapping.
// ─────────────────────────────────────────────
const CONFIG = {
  GEMINI_API_KEY: PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY'),
  GEMINI_MODEL: 'gemini-2.5-flash',
  GEMINI_TEMPERATURE: 0.1,
  ALERT_EMAIL: 'almamysidibe111@gmail.com',
  SHEET_COLUMNS: {
    TIMESTAMP: 1,
    NAME: 2,
    EMAIL: 3,
    CRUISE_TYPE: 4,
    DESTINATION: 5,
    TRAVEL_PERIOD: 6,
    TRAVELERS: 7,
    MESSAGE: 8,
    INQUIRY_QUALITY: 9,
    URGENCY: 10,
    CRUISE_TYPE_CLASSIFIED: 11,
    TRAVEL_INTENT: 12,
    NEXT_ACTION: 13,
    AI_SUMMARY: 14,
    PROCESSED: 15
  }
};


// ─────────────────────────────────────────────
// FUNCTION: buildPrompt
// Builds the Gemini classification prompt from
// a structured inquiry object.
// ─────────────────────────────────────────────
function buildPrompt(inquiry) {
  return `
You are a cruise inquiry qualification engine.
Your only output is a single raw JSON object. No markdown, no code fences, no explanations.

STEP 1 — RESOLVE FIELDS IN THIS EXACT ORDER:
cruise_type_classified → inquiry_quality → urgency → travel_intent → next_action → ai_summary

Each field depends on the ones before it. Do not skip ahead.

════════════════════════════════════════
FIELD 1: cruise_type_classified
════════════════════════════════════════
Classify the type of cruise based on any signal in the inquiry or form fields.

ocean   → open sea destinations (Caribbean, Mediterranean, Norwegian fjords, etc.)
river   → inland waterways (Danube, Rhine, Nile, Mekong, etc.)
unknown → no signal available OR No preference

If the CruiseType form field is filled, use it as the primary signal.
If empty, infer from the destination. If still unclear, return unknown.

════════════════════════════════════════
FIELD 2: inquiry_quality
════════════════════════════════════════
Measure how actionable this inquiry is for a travel advisor.

high   → includes 3 or more of: destination, travel period, traveler count,
         cruise type, cabin preference, flights included — AND shows real booking interest
         Example: "We want a 7-night Mediterranean cruise for 2 in September, balcony cabin if possible."

medium → shows genuine interest but missing key details
         Example: "Looking for a Caribbean cruise sometime next year for my family."

low    → vague, generic, or almost no useful travel information
         Example: "Do you have any cruise deals?" or a nearly empty form

Rule: If destination + travel period + traveler count are all present, lean toward high
unless the message itself is clearly vague or disinterested.

════════════════════════════════════════
FIELD 3: urgency
════════════════════════════════════════
Measure how time-sensitive this inquiry is.

high   → travel is within 6 weeks, OR customer explicitly requests quick callback,
         OR language signals they are ready to decide now
         Example: "We want to leave in 3 weeks." / "Please call me back today."

medium → clear interest but no strong time pressure
         Example: "We're thinking about a cruise this summer."

low    → exploratory, no timeline, or clearly long-range planning
         Example: "Just browsing for ideas for maybe next year."

════════════════════════════════════════
FIELD 4: travel_intent
════════════════════════════════════════
Measure where the customer is in their decision journey.

ready_to_book → clear criteria provided AND customer asks for offers, options, or contact
                Example: "We want to book a Nile river cruise for 4 in October. Please send us options."

comparing     → has preferences but still evaluating, not yet asking to commit
                Example: "I'm looking at a few options for a Baltic cruise next summer for 2 people."

research      → broad or vague, no real criteria, just exploring
                Example: "Hi, what cruise deals do you have?"

Override rules (apply these before finalizing):
- If destination + travel period + traveler count are all present AND customer asks for offers or contact → use ready_to_book or comparing, never research
- If customer explicitly requests suitable offers or options AND provides 3+ travel details → prefer ready_to_book over comparing

════════════════════════════════════════
FIELD 5: next_action
════════════════════════════════════════
Decide the best immediate follow-up action.

advisor_callback → when inquiry_quality = high AND travel_intent = ready_to_book
                   OR when urgency = high AND inquiry_quality = medium
                   Example: Detailed inquiry, customer wants to be contacted

send_offers      → when inquiry is useful but not yet ready for direct advisor contact
                   Example: Good detail level, customer wants to compare options first

manual_review    → ONLY when the inquiry is contradictory, suspicious, or impossible to classify
                   Do not use manual_review simply because detail is low — use send_offers instead

════════════════════════════════════════
FIELD 6: ai_summary
════════════════════════════════════════
Write one professional sentence, maximum 20 words.
Include: who is traveling, where, when (if known), and their intent.
Do not evaluate quality or urgency — just summarize the request.

Good: "Couple seeking 7-night Mediterranean ocean cruise in September, balcony cabin preferred, ready for advisor contact."
Bad:  "High-quality inquiry from a ready-to-book customer." ← do not evaluate, just summarize

════════════════════════════════════════
EDGE CASE RULES
════════════════════════════════════════
- Empty or blank form fields: treat as not provided. Do not infer or assume.
- Vague values like "me and my family" or "sometime soon": treat as partial, not definitive.
- If genuinely uncertain between two values, choose the more conservative one (e.g. medium over high).
- Never leave a field empty. Every field must have a value from its allowed list.

════════════════════════════════════════
INQUIRY DATA
════════════════════════════════════════
Name: ${inquiry.name}
Email: ${inquiry.email}
Cruise Type Preference: ${inquiry.cruiseType}
Destination: ${inquiry.destination}
Travel Period: ${inquiry.travelPeriod}
Travelers: ${inquiry.travelers}
Message: ${inquiry.message}

Return only this JSON structure, nothing else:
{
  "cruise_type_classified": "",
  "inquiry_quality": "",
  "urgency": "",
  "travel_intent": "",
  "next_action": "",
  "ai_summary": ""
}
`;
}


// ─────────────────────────────────────────────
// FUNCTION: callGeminiApi
// Sends a prompt to the Gemini API and returns
// the raw text response.
// ─────────────────────────────────────────────
function callGeminiApi(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.GEMINI_MODEL}:generateContent?key=${CONFIG.GEMINI_API_KEY}`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: CONFIG.GEMINI_TEMPERATURE }
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const responseText = response.getContentText();
  Logger.log('Gemini raw response: ' + responseText);

  const json = JSON.parse(responseText);

  if (!json.candidates?.[0]?.content?.parts) {
    throw new Error('Unexpected Gemini response structure: ' + responseText);
  }

  return json.candidates[0].content.parts[0].text;
}


// ─────────────────────────────────────────────
// FUNCTION: parseGeminiJson
// Strips accidental markdown fences from the
// Gemini response and parses it as JSON.
// ─────────────────────────────────────────────
function parseGeminiJson(rawText) {
  const cleaned = rawText
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();

  Logger.log('Cleaned JSON: ' + cleaned);
  return JSON.parse(cleaned);
}


// ─────────────────────────────────────────────
// FUNCTION: validateResult
// Validates that Gemini returned all required
// fields before writing anything to the sheet.
// ─────────────────────────────────────────────
function validateResult(result) {
  const requiredFields = [
    'cruise_type_classified',
    'inquiry_quality',
    'urgency',
    'travel_intent',
    'next_action',
    'ai_summary'
  ];

  for (const field of requiredFields) {
    if (!(field in result)) {
      throw new Error(`Missing field in Gemini response: ${field}`);
    }
  }

  return result;
}


// ─────────────────────────────────────────────
// FUNCTION: analyzeInquiry
// Orchestrates the full AI classification flow:
// builds prompt → calls API → parses result →
// validates result.
// ─────────────────────────────────────────────
function analyzeInquiry(inquiry) {
  const prompt = buildPrompt(inquiry);
  const rawText = callGeminiApi(prompt);
  const parsed = parseGeminiJson(rawText);
  return validateResult(parsed);
}


// ─────────────────────────────────────────────
// FUNCTION: sendAlertEmail
// Sends a formatted alert email for high-priority
// inquiries that are ready to book.
// ─────────────────────────────────────────────
function sendAlertEmail(inquiry, result) {
  const subject = 'High-Priority Cruise Inquiry Detected';

  const body = [
    'A high-priority cruise inquiry was detected.',
    '',
    `Name:                   ${inquiry.name}`,
    `Email:                  ${inquiry.email}`,
    `Cruise Type Preference: ${inquiry.cruiseType}`,
    `Destination:            ${inquiry.destination}`,
    `Travel Period:          ${inquiry.travelPeriod}`,
    `Travelers:              ${inquiry.travelers}`,
    `Message:                ${inquiry.message}`,
    '',
    `Inquiry Quality:        ${result.inquiry_quality}`,
    `Urgency:                ${result.urgency}`,
    `Cruise Type Classified: ${result.cruise_type_classified}`,
    `Travel Intent:          ${result.travel_intent}`,
    `Next Action:            ${result.next_action}`,
    `AI Summary:             ${result.ai_summary}`
  ].join('\n');

  GmailApp.sendEmail(CONFIG.ALERT_EMAIL, subject, body);
}


// ─────────────────────────────────────────────
// FUNCTION: processLatestRow
// Reads the most recent inquiry from the sheet,
// runs AI analysis, writes results back in a
// single batch, and sends an alert email if
// high-priority.
//
// Trigger: onFormSubmit (Apps Script trigger)
// ─────────────────────────────────────────────
function processLatestRow() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const lastRow = sheet.getLastRow();
  const cols = CONFIG.SHEET_COLUMNS;

  if (lastRow < 2) return;

  const row = sheet.getRange(lastRow, 1, 1, cols.PROCESSED).getValues()[0];

  const [
    timestamp, name, email, cruiseType, destination,
    travelPeriod, travelers, message,
    , , , , , , // Skip AI result columns (9–14)
    processed
  ] = row;

  if (processed === 'YES') return;

  const inquiry = {
    name: name || '',
    email: email || '',
    cruiseType: cruiseType || '',
    destination: destination || '',
    travelPeriod: travelPeriod || '',
    travelers: travelers || '',
    message: message || ''
  };

  const result = analyzeInquiry(inquiry);

  // Write all AI results back to the sheet in one batch for better performance
  sheet.getRange(lastRow, cols.INQUIRY_QUALITY, 1, 7).setValues([[
    result.inquiry_quality || '',
    result.urgency || '',
    result.cruise_type_classified || '',
    result.travel_intent || '',
    result.next_action || '',
    result.ai_summary || '',
    'YES'
  ]]);

  // Send alert only for strong leads that appear ready to book
  if (result.inquiry_quality === 'high' && result.travel_intent === 'ready_to_book') {
    sendAlertEmail(inquiry, result);
  }
}
