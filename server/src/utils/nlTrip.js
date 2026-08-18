function parseNaturalLanguage(text) {
  const raw = String(text || '');
  const budgetMatch =
    raw.match(/(?:₹|rs\.?\s*|inr\s*|budget\s*)(\d{3,7})/i) ||
    raw.match(/(\d{3,7})\s*(?:rs|rupees|budget)/i);
  const daysMatch = raw.match(/(\d+)\s*(?:din|days?)/i);
  const travelersMatch = raw.match(/(\d+)\s*(?:log|people|person|travelers?)/i);

  let origin = '';
  let destination = '';
  const se = raw.match(/\b([A-Za-z][A-Za-z ]{1,40}?)\s+se\s+([A-Za-z][A-Za-z ]{1,40}?)(?:\s|,|$)/i);
  if (se) {
    origin = se[1].trim();
    destination = se[2].trim();
  }

  const interests = [];
  if (/taj/i.test(raw)) interests.push('historical');
  if (/temple|mandir/i.test(raw)) interests.push('temple');
  if (/gurudwara|gurdwara/i.test(raw)) interests.push('gurudwara');
  if (/food|khana|street/i.test(raw)) interests.push('food');
  if (/nature|park|lake/i.test(raw)) interests.push('nature');

  let transportPreference = 'any';
  if (/train/i.test(raw)) transportPreference = 'train';
  if (/bus/i.test(raw)) transportPreference = 'bus';
  if (/walk/i.test(raw)) transportPreference = 'walking';
  if (/car|taxi|cab/i.test(raw)) transportPreference = 'car';

  let stayPreference = 'medium';
  if (/budget hotel|sasta hotel/i.test(raw)) stayPreference = 'budget';
  if (/premium|luxury/i.test(raw)) stayPreference = 'premium';
  if (/no hotel|hotel nahi/i.test(raw)) stayPreference = 'none';

  return {
    origin: origin || 'Delhi',
    destination: destination || 'Agra',
    budget: budgetMatch ? Number(budgetMatch[1]) : 5000,
    durationDays: daysMatch ? Number(daysMatch[1]) : 2,
    travelers: { adults: travelersMatch ? Number(travelersMatch[1]) : 1, children: 0 },
    transportPreference,
    stayPreference,
    interests: [...new Set(interests)],
    naturalLanguage: raw.slice(0, 500),
  };
}

module.exports = { parseNaturalLanguage };
