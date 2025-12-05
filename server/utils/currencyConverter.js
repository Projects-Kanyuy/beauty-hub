// convertCurrency.js

/**
 * Generic currency converter using a USD-based rates object.
 *
 * @param {number} amount - The amount to convert.
 * @param {string} fromCurrency - The currency of the input amount.
 * @param {string} toCurrency - The currency to convert to.
 * @param {object} rates - Currency rates where USD = 1 is the base.
 *
 * @returns {number} - The converted amount.
 * @throws {Error} - If the currency is unsupported or rates are invalid.
 */
function convertCurrency(amount, fromCurrency, toCurrency, rates) {
  if (!rates || typeof rates !== "object") {
    throw new Error("Invalid rates object");
  }

  if (!rates[fromCurrency]) {
    throw new Error(`Unsupported currency: ${fromCurrency}`);
  }

  if (!rates[toCurrency]) {
    throw new Error(`Unsupported target currency: ${toCurrency}`);
  }

  // Since USD is base:
  //
  // 1 unit of fromCurrency = (1 / rates[fromCurrency]) USD
  // converted to target:
  // amountInToCurrency = amount * (rates[toCurrency] / rates[fromCurrency])
  //
  const multiplier = rates[toCurrency] / rates[fromCurrency];

  return amount * multiplier;
}

module.exports = convertCurrency;
