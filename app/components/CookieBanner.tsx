import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { initGA, pageview } from '../utils/analytics';
import { GA_TRACKING_ID } from '../config/analytics';
import { useCookieConsent } from '../context/CookieConsentContext';

// We'll use any type for dynamic imports to avoid TypeScript errors with the cookie consent component

export default function CookieBanner() {
  const location = useLocation();
  const [hasConsent, setHasConsent] = useState(false);
  const { messageHasBeenSent } = useCookieConsent();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Dynamic import for client-side only
  const [CookieConsent, setCookieConsent] = useState<any>(null);
  const [getCookieConsentValue, setGetCookieConsentValue] = useState<any>(null);

  // Detect dark mode
  useEffect(() => {
    // Check initial theme
    const checkTheme = () => {
      const hasDarkClass = document.documentElement.classList.contains('dark');
      setIsDarkMode(hasDarkClass);
    };

    checkTheme();

    // Set up observer for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkTheme();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  // Load the cookie consent library on client side only
  useEffect(() => {
    import('react-cookie-consent').then((module) => {
      setCookieConsent(() => module.default);
      setGetCookieConsentValue(() => module.getCookieConsentValue);
    });
  }, []);

  // Check for existing cookie consent
  useEffect(() => {
    if (getCookieConsentValue) {
      const consentValue = getCookieConsentValue('cookieConsent');
      if (consentValue === 'true') {
        setHasConsent(true);
        initGA();
      }
    }
  }, [getCookieConsentValue]);

  // Track page views when location changes (only if consent was given)
  useEffect(() => {
    if (hasConsent) {
      pageview(location.pathname + location.search);
    }
  }, [location, hasConsent]);

  // Add GA script if consent is given
  useEffect(() => {
    if (hasConsent && typeof document !== 'undefined') {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
      document.head.appendChild(script);

      // Define window.dataLayer with proper TypeScript type
      interface WindowWithDataLayer extends Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
      }

      const windowWithDataLayer = window as unknown as WindowWithDataLayer;
      windowWithDataLayer.dataLayer = windowWithDataLayer.dataLayer || [];

      function gtag(...args: any[]) {
        windowWithDataLayer.dataLayer.push(arguments);
      }

      windowWithDataLayer.gtag = gtag;
      gtag('js', new Date());
      gtag('config', GA_TRACKING_ID);
    }
  }, [hasConsent]);

  // Don't render anything if any of these conditions are met:
  // 1. CookieConsent is not loaded
  // 2. No message has been sent yet
  // 3. Google Analytics ID is not set (making analytics optional)
  if (!CookieConsent || !messageHasBeenSent || !GA_TRACKING_ID) return null;

  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      declineButtonText="Decline"
      cookieName="cookieConsent"
      style={{
        background: isDarkMode ? 'var(--color-dark-surface)' : 'var(--color-light-background-01)',
        color: isDarkMode ? 'var(--color-dark-secondary)' : 'var(--color-light-secondary)',
        boxShadow: isDarkMode
          ? '0 -1px 5px rgba(168, 133, 255, 0.1)' // Subtle lavender glow shadow dark
          : '0 -1px 5px rgba(0, 0, 0, 0.05)', // Subtle shadow light
        borderTop: isDarkMode
          ? '1px solid var(--color-dark-decorative-00)'
          : '1px solid var(--color-light-decorative-00)',
        fontSize: '13px',
        padding: '10px 15px',
      }}
      buttonStyle={{
        color: isDarkMode ? 'var(--color-dark-primary)' : 'var(--color-light-primary)',
        backgroundColor: isDarkMode ? 'var(--color-accent-02-dark)' : 'var(--color-accent-02-light)',
        fontSize: '12px',
        borderRadius: '6px', // Consistent rounding
        padding: '6px 12px',
        fontWeight: 500,
      }}
      declineButtonStyle={{
        color: isDarkMode ? 'var(--color-dark-secondary)' : 'var(--color-light-secondary)',
        backgroundColor: 'transparent',
        fontSize: '12px',
        border: `1px solid ${isDarkMode ? 'var(--color-dark-decorative-01)' : 'var(--color-light-decorative-01)'}`,
        borderRadius: '6px',
        padding: '5px 11px', // Adjusted for border
        marginLeft: '10px',
      }}
      expires={365}
      enableDeclineButton
      onAccept={() => {
        setHasConsent(true);
        initGA();
        pageview(location.pathname + location.search);
      }}
    >
      This website uses cookies to enhance the user experience and analyze site traffic.
    </CookieConsent>
  );
}