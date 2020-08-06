import {useState, useEffect} from 'react';
import {Platform} from 'react-native';
import RNOtpVerify from 'react-native-otp-verify';

const ANDROID = 'android';
const OTP_REGEX = /(\d+)[\s]*is|is[\s]*(\d+)\.?/g;

export async function smsListener(callback) {
  if (Platform.OS === ANDROID) {
    RNOtpVerify.getOtp()
      .then(p =>
        RNOtpVerify.addListener(message => {
          try {
            if (message) {
              callback(null, message);
            }
          } catch (error) {
            callback(error);
          }
        }),
      )
      .catch(p => console.log(p));
  } else {
    callback(null, '');
  }

  return () => {
    if (Platform.OS === ANDROID) {
      RNOtpVerify.removeListener();
    }
  };
}

export function useSMSListener(smsHandler) {
  const [sms, setSMS] = useState('');
  const [err, setErr] = useState(null);

  useEffect(() => {
    return smsListener((error, message) => {
      if (err !== error) {
        setErr(error ? error : null);
      }

      if (smsHandler) {
        smsHandler(message);
      }
      setSMS(message);
    });
  });

  return [sms, err];
}

function defaultOtpParser(sms) {
  let otpMatch = OTP_REGEX.exec(sms);

  return otpMatch ? otpMatch[1] || otpMatch[2] || '' : '';
}

export function useOtpVerify(otpParser = defaultOtpParser) {
  const [otp, setOTP] = useState('');
  const [sms, err] = useSMSListener();

  useEffect(() => {
    if (!err) {
      setOTP(otpParser(sms));
    }
  }, [err, otpParser, sms]);

  return [otp, err];
}
