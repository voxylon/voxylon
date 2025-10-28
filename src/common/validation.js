const { utils: ethersUtils } = require('ethers');
const {
  REGISTRATION_DEADLINE_ISO,
  REGISTRATION_DEADLINE,
  VALIDATOR_KEY_PATTERN,
  SIGNATURE_PATTERN,
  buildRegistrationMessage
} = require('./constants');

const normalizeAddress = (address) => ethersUtils.getAddress(address);

const normalizeValidatorKey = (validatorKey) => validatorKey.toLowerCase();

const isDeadlinePassed = () => Date.now() > REGISTRATION_DEADLINE.getTime();

const isValidValidatorKey = (validatorKey) => VALIDATOR_KEY_PATTERN.test(validatorKey);

const isValidSignatureFormat = (signature) => SIGNATURE_PATTERN.test(signature);

const verifySignature = (address, validatorKey, signature) => {
  try {
    const message = buildRegistrationMessage(validatorKey);
    const recovered = ethersUtils.verifyMessage(message, signature);
    return normalizeAddress(recovered) === normalizeAddress(address);
  } catch (error) {
    return false;
  }
};

module.exports = {
  REGISTRATION_DEADLINE_ISO,
  isDeadlinePassed,
  buildRegistrationMessage,
  isValidSignatureFormat,
  isValidValidatorKey,
  normalizeAddress,
  normalizeValidatorKey,
  verifySignature
};
