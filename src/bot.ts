let noHelloYet = true;

const helloResponses = ['hello', 'oh, hi there'];

const answerResponses = [
  'hmm, that is a good question',
  "i don't know",
  'wait, what was the question?',
  'yeah, like i would know lol',
];

const catchAllResponses = [
  "hmm, i'll think about it, i guess",
  "ahh, that's interesting",
  'that is a good point',
  'ooh, speak on that',
];

function getRandomPhrase(responses: string[]) {
  return responses[Math.floor(Math.random() * responses.length)];
}

export function generateBotMessage(input: string) {
  if (
    noHelloYet ||
    [/\bhi\b/, /\bhey\b/, /\bhello\b/, /\bhay\b/, /\bhihi\b/].some((s) =>
      s.test(input),
    )
  ) {
    noHelloYet = false;
    return getRandomPhrase(helloResponses);
  }
  if (/\?$/.test(input)) {
    return getRandomPhrase(answerResponses);
  }
  return getRandomPhrase(catchAllResponses);
}
