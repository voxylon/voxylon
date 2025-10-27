const { utils: ethersUtils } = require('ethers');

const REGISTRATION_DEADLINE_ISO = '2025-12-31T23:59:59Z';
const REGISTRATION_DEADLINE = new Date(REGISTRATION_DEADLINE_ISO);

const VALIDATOR_KEY_PATTERN = /^0x[a-fA-F0-9]{96}$/;
const SIGNATURE_PATTERN = /^0x[a-fA-F0-9]{130}$/;

const normalizeAddress = (address) => ethersUtils.getAddress(address);

const isDeadlinePassed = () => Date.now() > REGISTRATION_DEADLINE.getTime();

const buildRegistrationMessage = (validatorKey) => `Register Validator: ${validatorKey}`;

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
  verifySignature
};
