const quotes = [
  "Stay focused. Small progress every day leads to big results.",
  "Success is the result of consistent effort and smart planning.",
  "Productivity is never an accident. It is always the result of commitment.",
  "Focus on progress, not perfection.",
  "Discipline is choosing between what you want now and what you want most.",
  "A little progress each day adds up to big results.",
];

export const getQuote = async (): Promise<string> => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
};