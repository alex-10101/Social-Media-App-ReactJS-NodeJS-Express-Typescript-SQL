import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";

/**
 * @param userInput
 * @returns A sanitized user input.
 */
export function sanitizeUserInput(userInput: string | object) {
  if (typeof userInput === "object") {
    for (const key in userInput) {
      if (typeof userInput[key] === "string") {
        const window = new JSDOM("").window;
        const purify = DOMPurify(window);
        const sanitizedInput: string = purify.sanitize(userInput[key]);
        userInput[key] = sanitizedInput;
      }
    }
  } else if (typeof userInput === "string") {
    const window = new JSDOM("").window;
    const purify = DOMPurify(window);
    const sanitizedInput: string = purify.sanitize(userInput);
    userInput = sanitizedInput;
  }

  return userInput;
}
