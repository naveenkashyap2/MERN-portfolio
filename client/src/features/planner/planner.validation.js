export function validatePlanner(draft) {
  const errors = {};
  if (!draft.origin) errors.origin = 'From is required.';
  if (!draft.destination) errors.destination = 'To is required.';
  if (!draft.startDate || !draft.endDate) errors.dates = 'Pick start and end dates.';
  if (draft.startDate && draft.endDate && new Date(draft.endDate) < new Date(draft.startDate)) {
    errors.dates = 'End date must be on or after start date.';
  }
  if (!(Number(draft.budget) >= 0)) errors.budget = 'Enter a valid budget.';
  return errors;
}
