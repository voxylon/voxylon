import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { utils as ethersUtils } from 'ethers';

const REGISTRATION_DEADLINE_ISO = '2025-12-31T23:59:59Z';
const DEADLINE = new Date(REGISTRATION_DEADLINE_ISO);
const DEADLINE_DATE = DEADLINE.toLocaleDateString('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC'
});
const DEADLINE_TIME = DEADLINE.toLocaleTimeString('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'UTC'
});
const DEADLINE_DISPLAY = `${DEADLINE_DATE} ${DEADLINE_TIME} UTC`;

const heroVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.15, duration: 0.6, ease: 'easeOut' }
  })
};

const panelVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.08, duration: 0.5, ease: 'easeOut' }
  })
};

const formatCountdown = (diffMs) => {
  if (diffMs <= 0) {
    return {
      text: 'Registration period has ended.',
      segments: []
    };
  }

  const secondsTotal = Math.floor(diffMs / 1000);
  const years = Math.floor(secondsTotal / (365 * 24 * 60 * 60));
  const days = Math.floor((secondsTotal % (365 * 24 * 60 * 60)) / (24 * 60 * 60));
  const hours = Math.floor((secondsTotal % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((secondsTotal % (60 * 60)) / 60);
  const seconds = secondsTotal % 60;

  const totalDays = years * 365 + days;

  const textSegments = [];
  if (years > 0) {
    textSegments.push(`${years}y`);
  }
  textSegments.push(`${days}d`, `${hours}h`, `${minutes}m`, `${seconds}s`);

  const segments = [
    { label: 'Days', value: totalDays.toString().padStart(2, '0') },
    { label: 'Hours', value: hours.toString().padStart(2, '0') },
    { label: 'Minutes', value: minutes.toString().padStart(2, '0') },
    { label: 'Seconds', value: seconds.toString().padStart(2, '0') }
  ];

  return {
    text: textSegments.join(' '),
    segments
  };
};

const formatAddress = (address) => (address ? `${address.slice(0, 6)}…${address.slice(-4)}` : '');

const getCountdownState = () => {
  const now = new Date();
  const diff = DEADLINE.getTime() - now.getTime();
  const { text, segments } = formatCountdown(diff);
  return {
    diff,
    formatted: text,
    segments,
    expired: diff <= 0
  };
};

const initialStatus = {
  ready: false,
  message: 'Waiting for wallet providers…'
};

const VALIDATOR_KEY_PATTERN = /^0x[a-fA-F0-9]{96}$/;

const buildRegistrationMessage = (validatorKey) => `Register Validator: ${validatorKey}`;

const ERROR_MESSAGES = {
  ALREADY_REGISTERED: 'Registration already exists for this account.',
  CONNECT_WALLET: 'Connect a wallet first.',
  INVALID_VALIDATOR_KEY: 'Validator public key must be 0x-prefixed with 96 hex characters.',
  DEADLINE_PASSED: 'Registration deadline has passed.',
  VALIDATOR_KEY_TAKEN: 'Validator key already registered by another account.',
  SIGNATURE_REJECTED: 'Signature request was rejected.',
  SIGNATURE_REQUIRED: 'Sign the validator key before submitting.',
  SIGNATURE_INVALID: 'Signature validation failed.',
  REGISTRATION_FAILED: 'Registration failed.',
  COPY_FAILED: 'Unable to copy to clipboard.'
};

const normalizeAddress = (address) => {
  if (!address) return '';
  try {
    return ethersUtils.getAddress(address);
  } catch {
    return address;
  }
};

function Register() {
  const [status, setStatus] = useState(initialStatus);
  const [countdown, setCountdown] = useState(getCountdownState);
  const [providers, setProviders] = useState([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeDetail, setActiveDetail] = useState(null);
  const [connectedAddress, setConnectedAddress] = useState('');
  const [registration, setRegistration] = useState(null);
  const [validatorKey, setValidatorKey] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSigning, setIsSigning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [pendingSignature, setPendingSignature] = useState('');
  const [isSignatureValid, setIsSignatureValid] = useState(false);
  const [copyToast, setCopyToast] = useState('');
  const [registrationCount, setRegistrationCount] = useState(0);
  const [isLoadingCount, setIsLoadingCount] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdownState());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const registerProvider = useCallback((detail) => {
    setProviders((current) => {
      if (current.some((item) => item.info.uuid === detail.info.uuid)) {
        return current;
      }
      return [...current, detail].sort((a, b) => (a.info.name || '').localeCompare(b.info.name || ''));
    });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const announceHandler = (event) => {
      registerProvider(event.detail);
    };

    window.addEventListener('eip6963:announceProvider', announceHandler);
    window.dispatchEvent(new Event('eip6963:requestProvider'));

    const fallback = setTimeout(() => {
      setStatus((current) => {
        if (providers.length > 0 || connectedAddress) {
          return current;
        }
        return {
          ready: false,
          message: 'No EIP-6963 providers detected'
        };
      });
    }, 2000);

    return () => {
      clearTimeout(fallback);
      window.removeEventListener('eip6963:announceProvider', announceHandler);
    };
  }, [providers.length, registerProvider, connectedAddress]);

  useEffect(() => {
    if (connectedAddress) {
      return;
    }
    setStatus({
      ready: providers.length > 0,
      message: 'Waiting for wallet providers…'
    });
  }, [providers.length, connectedAddress]);

  const resetMessages = useCallback(() => {
    setErrorMessage('');
    setSuccessMessage('');
    setCopyToast('');
  }, []);

  const handleDisconnect = useCallback(() => {
    resetMessages();
    setActiveDetail(null);
    setConnectedAddress('');
    setRegistration(null);
    setValidatorKey('');
    setPendingSignature('');
    setIsSignatureValid(false);
    setConfirmationOpen(false);
    setIsSigning(false);
    setIsSubmitting(false);
    setCopyToast('');
    setStatus({
      ready: providers.length > 0,
      message: providers.length > 0 ? 'Select a wallet to connect' : 'Waiting for wallet providers…'
    });
  }, [providers.length, resetMessages]);

  const fetchRegistrationCount = useCallback(async () => {
    try {
      setIsLoadingCount(true);
      const response = await fetch('/api/registrations');
      if (!response.ok) {
        throw new Error('Unable to fetch registration count');
      }
      const data = await response.json();
      setRegistrationCount(typeof data.total === 'number' ? data.total : 0);
    } catch (error) {
      console.error('Failed to fetch registration count', error);
    } finally {
      setIsLoadingCount(false);
    }
  }, []);

  const fetchRegistration = useCallback(
    async (address) => {
      try {
        resetMessages();
        const response = await fetch(`/api/registrations/${normalizeAddress(address)}`);
        if (response.status === 404) {
          setRegistration(null);
          setValidatorKey('');
          setPendingSignature('');
          setIsSignatureValid(false);
          setConfirmationOpen(false);
          return;
        }
        if (!response.ok) {
          throw new Error('Unable to fetch registration data');
        }
        const data = await response.json();
        setRegistration(data);
        setValidatorKey(data.validatorKey);
        setPendingSignature('');
        setIsSignatureValid(false);
        setConfirmationOpen(false);
        setSuccessMessage('Registration found on file.');
        setCopyToast('');
      } catch (error) {
        setErrorMessage(error.message || 'Failed to load registration.');
      }
    },
    [resetMessages]
  );

  const refreshConnectedAccount = useCallback(
    async (detail) => {
      const { provider } = detail;
      const accounts = await provider.request({ method: 'eth_accounts' });
      if (!accounts || accounts.length === 0) {
        handleDisconnect();
        return;
      }
      const address = accounts[0];
      setActiveDetail(detail);
      setConnectedAddress(address);
      setStatus({
        ready: true,
        message: 'Wallet connected'
      });
      await fetchRegistration(address);
      await fetchRegistrationCount();
    },
    [fetchRegistration, fetchRegistrationCount, handleDisconnect]
  );

  const connectWithProvider = useCallback(
    async (detail) => {
      try {
        resetMessages();
        const { info, provider } = detail;
        setStatus({
          ready: true,
          message: 'Connecting to wallet…'
        });
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        if (!accounts || accounts.length === 0) {
          throw new Error('No accounts returned from provider.');
        }
        const address = accounts[0];
        const detailWithMeta = { info, provider };
        setActiveDetail(detailWithMeta);
        setConnectedAddress(address);
        setStatus({
          ready: true,
          message: 'Wallet connected'
        });
        await fetchRegistration(address);
        await fetchRegistrationCount();

        provider.on?.('accountsChanged', async (nextAccounts) => {
          if (!nextAccounts || nextAccounts.length === 0) {
            handleDisconnect();
            return;
          }
          await refreshConnectedAccount(detailWithMeta);
        });

        provider.on?.('chainChanged', async () => {
          await refreshConnectedAccount(detailWithMeta);
        });
      } catch (error) {
        console.error('Failed to connect', error);
        setErrorMessage(error.message || 'Failed to connect to wallet.');
        setStatus({
          ready: false,
          message: 'Connection failed'
        });
      }
    },
    [fetchRegistration, fetchRegistrationCount, handleDisconnect, refreshConnectedAccount, resetMessages]
  );

  const handleConnectClick = () => {
    resetMessages();
    if (providers.length === 0) {
      setStatus({
        ready: false,
        message: 'No EIP-6963 providers detected'
      });
      return;
    }
    if (providers.length === 1) {
      connectWithProvider(providers[0]);
    } else {
      setPickerOpen(true);
    }
  };

  const handleSelectProvider = async (uuid) => {
    const detail = providers.find((item) => item.info.uuid === uuid);
    if (!detail) {
      return;
    }
    setPickerOpen(false);
    await connectWithProvider(detail);
  };

  const handleSign = async () => {
    resetMessages();
    if (registration) {
      setErrorMessage(ERROR_MESSAGES.ALREADY_REGISTERED);
      return;
    }
    if (!activeDetail || !connectedAddress) {
      setErrorMessage(ERROR_MESSAGES.CONNECT_WALLET);
      return;
    }

    if (!VALIDATOR_KEY_PATTERN.test(validatorKey)) {
      setErrorMessage(ERROR_MESSAGES.INVALID_VALIDATOR_KEY);
      return;
    }

    if (countdown.expired) {
      setErrorMessage(ERROR_MESSAGES.DEADLINE_PASSED);
      return;
    }

    try {
      setIsSigning(true);
      setPendingSignature('');
      setIsSignatureValid(false);
      setConfirmationOpen(false);

      const availabilityResponse = await fetch(
        `/api/registrations/validator-keys/${encodeURIComponent(validatorKey)}`
      );

      if (availabilityResponse.ok) {
        setErrorMessage(ERROR_MESSAGES.VALIDATOR_KEY_TAKEN);
        return;
      }

      if (availabilityResponse.status !== 404) {
        const data = await availabilityResponse.json().catch(() => ({}));
        const message =
          data?.message || 'Unable to verify validator key registration status. Please try again.';
        throw new Error(message);
      }

      const message = buildRegistrationMessage(validatorKey);
      
      // Get fresh account list to ensure we have the exact address format the wallet expects
      const accounts = await activeDetail.provider.request({ method: 'eth_accounts' });
      const currentAccount = accounts[0];
      
      // Convert message to hex for personal_sign (required by EIP-1193)
      const messageHex = ethersUtils.hexlify(ethersUtils.toUtf8Bytes(message));
      
      const signature = await activeDetail.provider.request({
        method: 'personal_sign',
        params: [messageHex, currentAccount]
      });
      
      setPendingSignature(signature);
      try {
        const recovered = ethersUtils.verifyMessage(message, signature);
        const valid = normalizeAddress(recovered) === normalizeAddress(connectedAddress);
        setIsSignatureValid(valid);
      } catch (verificationError) {
        setIsSignatureValid(false);
      }
      setConfirmationOpen(true);
    } catch (error) {
      console.error('Signature request failed:', error);
      setErrorMessage(error.message || ERROR_MESSAGES.SIGNATURE_REJECTED);
    } finally {
      setIsSigning(false);
    }
  };

  const handleSubmit = async () => {
    resetMessages();
    if (!activeDetail || !connectedAddress) {
      setErrorMessage(ERROR_MESSAGES.CONNECT_WALLET);
      return;
    }

    if (registration) {
      setErrorMessage(ERROR_MESSAGES.ALREADY_REGISTERED);
      return;
    }

    if (!VALIDATOR_KEY_PATTERN.test(validatorKey)) {
      setErrorMessage(ERROR_MESSAGES.INVALID_VALIDATOR_KEY);
      return;
    }

    if (!pendingSignature) {
      setErrorMessage(ERROR_MESSAGES.SIGNATURE_REQUIRED);
      return;
    }

    if (!isSignatureValid) {
      setErrorMessage(ERROR_MESSAGES.SIGNATURE_INVALID);
      return;
    }

    if (countdown.expired) {
      setErrorMessage(ERROR_MESSAGES.DEADLINE_PASSED);
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        address: connectedAddress,
        validatorKey,
        signature: pendingSignature
      };

      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || ERROR_MESSAGES.REGISTRATION_FAILED);
      }

      const result = await response.json();
      setRegistration(result);
      setValidatorKey(result.validatorKey);
      setSuccessMessage(result.message || 'Registration stored successfully.');
      await fetchRegistrationCount();
      handleDismissConfirmation();
    } catch (error) {
      console.error('Registration failed', error);
      setErrorMessage(error.message || ERROR_MESSAGES.REGISTRATION_FAILED);
      handleDismissConfirmation();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDismissConfirmation = useCallback(() => {
    setConfirmationOpen(false);
    setPendingSignature('');
    setIsSignatureValid(false);
    setIsSubmitting(false);
    setCopyToast('');
  }, []);

  useEffect(() => {
    if (!copyToast) {
      return undefined;
    }
    const timer = setTimeout(() => {
      setCopyToast('');
    }, 2500);
    return () => clearTimeout(timer);
  }, [copyToast]);

  useEffect(() => {
    fetchRegistrationCount();
  }, [fetchRegistrationCount]);

  const copyToClipboard = async (value, label) => {
    if (!value) {
      return;
    }

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'absolute';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopyToast(`${label} copied to clipboard`);
    } catch (error) {
      console.error('Copy failed', error);
      setErrorMessage(ERROR_MESSAGES.COPY_FAILED);
    }
  };

  const registrationBadge = registration
    ? registration.isValid
      ? { label: 'Signature valid', tone: 'success' }
      : { label: 'Signature invalid', tone: 'danger' }
    : null;

  return (
    <div className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-grid-lines bg-[size:50px_50px] opacity-30" aria-hidden="true" />
      <div className="absolute inset-0 -z-20 bg-grid-radial opacity-75" aria-hidden="true" />
      <main className="relative mx-auto max-w-6xl px-4 pb-24 pt-24 sm:px-6 lg:pt-28">
        <section className="flex flex-col-reverse items-start gap-12 lg:flex-row">
          <motion.div
            className="w-full flex-1 space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={heroVariants}
            custom={0}
          >
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-1 text-sm font-medium shadow-[0_12px_30px_rgba(31,116,255,0.2)] ${
                status.ready
                  ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-100'
                  : 'border-amber-400/40 bg-amber-500/15 text-amber-100'
              }`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  status.ready
                    ? 'bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.8)]'
                    : 'bg-amber-400 shadow-[0_0_18px_rgba(253,224,71,0.8)]'
                }`}
              />
              {status.message}
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Secure your genesis validator seat.
            </h1>
            <p className="text-base text-slate-300 sm:text-lg">
              Connect an EIP-6963 wallet, sign your BLS validator key, and submit your signature to finalize your Voxylon
              validator registration.
            </p>
            <div className="grid gap-4 text-sm text-slate-300 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <div className="mt-1 h-2 w-2 rounded-full bg-voxylon-blue shadow-[0_0_12px_rgba(31,116,255,0.6)]" />
                <div>
                  <p className="font-semibold text-white">Fair launch enforcement</p>
                  <p className="mt-1 text-slate-400">
                    Every validator begins with identical stake and transparent on-chain rules.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <div className="mt-1 h-2 w-2 rounded-full bg-voxylon-purple shadow-[0_0_12px_rgba(122,60,255,0.6)]" />
                <div>
                  <p className="font-semibold text-white">Deterministic tooling</p>
                  <p className="mt-1 text-slate-400">
                    Zero premine, zero insiders—just verifiable artifacts and community auditability.
                  </p>
                </div>
              </div>
            </div>
            {connectedAddress ? (
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/80">
                  Connected as {formatAddress(connectedAddress)}
                </span>
                {registration && (
                  <span className="rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-1 text-emerald-100">
                    Registration on file
                  </span>
                )}
              </div>
            ) : null}
          </motion.div>

          <motion.div
            className="flex w-full max-w-lg flex-col gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={heroVariants}
            custom={1}
          >
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/10 p-8 shadow-2xl">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-200">Countdown to validator deadline</p>
              {countdown.expired ? (
                <p className="mt-6 text-lg font-semibold text-white">{countdown.formatted}</p>
              ) : (
                <>
                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {countdown.segments.map((segment) => (
                      <div key={segment.label} className="rounded-2xl bg-slate-950/70 p-4 text-center shadow-inner">
                        <div className="text-3xl font-semibold text-white md:text-4xl">{segment.value}</div>
                        <div className="mt-1 text-xs uppercase tracking-wide text-slate-400">{segment.label}</div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-slate-300">
                    Deadline: <span className="font-semibold text-white">{DEADLINE_DISPLAY}</span>
                  </p>
                </>
              )}
              <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/75 p-5 text-center shadow-inner">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Registrations submitted</p>
                <p className="mt-2 text-3xl font-semibold text-white">
                  {isLoadingCount ? '...' : registrationCount.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="mt-16 grid gap-8 lg:grid-cols-2">
          <motion.div
            className="card-glass rounded-3xl p-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={panelVariants}
            custom={0}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm uppercase tracking-[0.3em] text-slate-200">Wallet connection</h2>
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${
                  status.ready
                    ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-100'
                    : 'border-amber-400/40 bg-amber-500/10 text-amber-100'
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${status.ready ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                {status.ready ? 'Ready' : 'Pending'}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-400">{status.message}</p>

            {connectedAddress ? (
              <div className="mt-6 space-y-6">
                <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 shadow-inner">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-white">{activeDetail?.info.name || 'Wallet'}</p>
                    </div>
                    <button
                      className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
                      onClick={handleDisconnect}
                    >
                      Disconnect
                    </button>
                  </div>
                  <dl className="mt-5 space-y-4 text-sm text-slate-300">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <dt className="font-medium text-slate-200">Ethereum account</dt>
                      <dd className="flex items-center gap-2">
                        <span className="break-all text-slate-200">{connectedAddress}</span>
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-slate-200 transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-voxylon-purple/60"
                          onClick={() => copyToClipboard(connectedAddress, 'Ethereum account')}
                        >
                          Copy
                        </button>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-slate-950/40 p-6 text-center shadow-inner">
                <p className="text-sm text-slate-300">
                  Click below to discover an announced wallet provider and authenticate with your Ethereum account.
                </p>
                <button
                  className="mt-5 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-voxylon-blue to-voxylon-purple px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(122,60,255,0.35)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-voxylon-purple"
                  onClick={handleConnectClick}
                >
                  Connect wallet
                </button>
              </div>
            )}
          </motion.div>

          <motion.div
            className="card-glass rounded-3xl p-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={panelVariants}
            custom={1}
          >
            <h2 className="text-sm uppercase tracking-[0.3em] text-slate-200">Validator registration</h2>

            {errorMessage && (
              <div className="mt-6 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {errorMessage}
              </div>
            )}
            {successMessage && !errorMessage && (
              <div className="mt-6 rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                {successMessage}
              </div>
            )}
            {copyToast && !errorMessage && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-slate-200">
                {copyToast}
              </div>
            )}

            {connectedAddress ? (
              <div className="mt-6 space-y-6">
                {registration ? (
                  <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 shadow-inner">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white">Registered validator</h3>
                      </div>
                      {registrationBadge && (
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${
                            registrationBadge.tone === 'success'
                              ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-100'
                              : 'border-red-400/40 bg-red-500/15 text-red-100'
                          }`}
                        >
                          {registrationBadge.label}
                        </span>
                      )}
                    </div>
                    <dl className="mt-6 space-y-4 text-sm text-slate-300">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <dt className="font-medium text-slate-200">Ethereum account</dt>
                        <dd className="flex items-center gap-2">
                          <span className="break-all text-slate-200">{registration.address}</span>
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-slate-200 transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-voxylon-purple/60"
                            onClick={() => copyToClipboard(registration.address, 'Ethereum account')}
                          >
                            Copy
                          </button>
                        </dd>
                      </div>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <dt className="font-medium text-slate-200">Validator key</dt>
                        <dd className="flex items-center gap-2">
                          <span className="break-all text-slate-200">{registration.validatorKey}</span>
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-slate-200 transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-voxylon-purple/60"
                            onClick={() => copyToClipboard(registration.validatorKey, 'Validator key')}
                          >
                            Copy
                          </button>
                        </dd>
                      </div>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <dt className="font-medium text-slate-200">Signature</dt>
                        <dd className="flex items-center gap-2">
                          <span className="break-all text-slate-200">{registration.signature}</span>
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-slate-200 transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-voxylon-purple/60"
                            onClick={() => copyToClipboard(registration.signature, 'Signature')}
                          >
                            Copy
                          </button>
                        </dd>
                      </div>
                    </dl>
                    <p className="mt-4 text-xs text-slate-400">
                      Registration is final. To associate a different validator key, use another Ethereum account.
                    </p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/15 bg-slate-950/50 p-6 text-sm text-slate-300 shadow-inner">
                    No registration found yet. Provide your validator public key and sign before the countdown reaches
                    zero.
                  </div>
                )}

                {!registration && (
                  <form
                    className="rounded-2xl border border-white/10 bg-slate-950/60 p-6 shadow-inner"
                    onSubmit={(event) => {
                      event.preventDefault();
                      handleSign();
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <label htmlFor="validatorKey" className="text-sm font-medium text-slate-200">
                          Validator public key
                        </label>
                        <a
                          href="https://keygen.voxylon.net/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-voxylon-purple/60"
                        >
                          Get Key
                        </a>
                      </div>
                      <input
                        id="validatorKey"
                        name="validatorKey"
                        value={validatorKey}
                        onChange={(event) => setValidatorKey(event.target.value.trim())}
                        placeholder="0x..."
                        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-voxylon-blue focus:outline-none focus:ring-1 focus:ring-voxylon-blue/70 disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={countdown.expired || isSigning || isSubmitting}
                        autoComplete="off"
                        spellCheck={false}
                      />
                      <p className="mt-2 text-xs text-slate-400">
                        Must be a 0x-prefixed, 96 character hexadecimal BLS public key.
                      </p>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-voxylon-blue to-voxylon-purple px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(122,60,255,0.35)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-voxylon-purple disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={countdown.expired || isSigning}
                      >
                        {isSigning ? 'Awaiting signature…' : 'Sign validator key'}
                      </button>
                      {countdown.expired && (
                        <span className="text-xs text-rose-200">Registration deadline has passed.</span>
                      )}
                    </div>
                  </form>
                )}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-white/15 bg-slate-950/50 p-6 text-center text-sm text-slate-300 shadow-inner">
                Connect a wallet above to unlock validator registration. We will ask you to sign the validator key via your
                wallet provider.
              </div>
            )}
          </motion.div>
        </section>
      </main>

      {pickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setPickerOpen(false)} />
          <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900/85 p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs uppercase tracking-[0.3em] text-slate-300">Choose wallet</span>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-3 py-1 text-xs font-medium text-white/70 transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
                onClick={() => setPickerOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="mt-6 space-y-3">
              {providers.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-white/15 bg-slate-950/50 p-4 text-sm text-slate-300">
                  No EIP-6963 wallet providers detected.
                </p>
              ) : (
                providers.map(({ info }) => (
                  <button
                    key={info.uuid}
                    className="flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-left text-white transition hover:-translate-y-0.5 hover:border-voxylon-purple/40 hover:bg-slate-950/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-voxylon-purple"
                    onClick={() => handleSelectProvider(info.uuid)}
                  >
                    <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-slate-900/70">
                      {info.icon ? (
                        <img src={info.icon} alt={`${info.name || 'Wallet'} icon`} className="h-8 w-8 object-contain" />
                      ) : (
                        <span className="text-lg font-semibold text-slate-200">{info.name?.[0] ?? '?'}</span>
                      )}
                    </span>
                    <span className="text-sm font-semibold text-white">{info.name || 'Wallet'}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {confirmationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm"
            onClick={() => {
              if (!isSubmitting) {
                handleDismissConfirmation();
              }
            }}
          />
          <div className="relative w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900/85 p-8 shadow-[0_35px_80px_rgba(5,8,22,0.65)]">
            <h3 className="text-xl font-semibold text-white">Review registration</h3>
            <p className="mt-3 text-sm text-slate-300">
              Please double-check the details below. Once submitted, this record cannot be modified or deleted.
            </p>
            <dl className="mt-6 space-y-4 rounded-2xl border border-white/10 bg-slate-950/60 p-6 text-sm text-slate-200">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <dt className="font-medium text-slate-200">Ethereum account</dt>
                <dd className="w-full break-all text-right text-slate-200 sm:w-auto sm:text-left">{connectedAddress}</dd>
              </div>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <dt className="font-medium text-slate-200">Validator key</dt>
                <dd className="w-full break-all text-right text-slate-200 sm:w-auto sm:text-left">{validatorKey}</dd>
              </div>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <dt className="font-medium text-slate-200">Signature</dt>
                <dd className="w-full break-all text-right text-slate-200 sm:w-auto sm:text-left">{pendingSignature}</dd>
              </div>
            </dl>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${
                  isSignatureValid
                    ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-100'
                    : 'border-red-400/40 bg-red-500/15 text-red-100'
                }`}
              >
                {isSignatureValid ? 'Signature valid' : 'Signature invalid'}
              </span>
              {!isSignatureValid && (
                <span className="text-sm text-slate-300">Re-sign the validator key to proceed.</span>
              )}
            </div>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleDismissConfirmation}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-voxylon-blue to-voxylon-purple px-6 py-2.5 text-sm font-semibold text-white shadow-[0_20px_50px_rgba(122,60,255,0.35)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-voxylon-purple disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleSubmit}
                disabled={!isSignatureValid || isSubmitting}
              >
                {isSubmitting ? 'Submitting…' : 'Submit registration'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
