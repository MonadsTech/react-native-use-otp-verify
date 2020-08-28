import React from 'react';
import {Platform} from 'react-native';
import RNOtpVerify from 'react-native-otp-verify';

export function smsListener(callback: any) {
  RNOtpVerify.getOtp()
    .then((p) =>
      RNOtpVerify.addListener((message) => {
        try {
          if (message) {
            callback(null, message);
          }
        } catch (error) {
          callback(error);
        }
      }),
    )
    .catch((p) => console.log(p));

  return () => RNOtpVerify.removeListener();
}

export function useSMSListener(smsHandler: any | undefined) {
  const [sms, setSMS] = React.useState('');
  const [err, setErr] = React.useState(null);
  const cancelSMSListener = React.useRef(() => {});

  React.useEffect(() => {
    cancelSMSListener.current = smsListener((error: any, message: string) => {
      if (err !== error) {
        setErr(error ? error : null);
      }

      if (smsHandler) {
        smsHandler(message);
      }
      setSMS(message);
    });

    return cancelSMSListener.current;
  }, [err, smsHandler]);

  return [sms, err, cancelSMSListener.current];
}

const OTP_REGEX = /(\d+)[\s]*is|is[\s]*(\d+)\.?/g;
const ANDROID = 'android';

function defaultOtpParser(sms: string | null | any): string {
  let otpMatch = OTP_REGEX.exec(sms || '');

  return otpMatch ? otpMatch[1] || otpMatch[2] || '' : '';
}

export function useOtpVerify(otpParser = defaultOtpParser) {
  const [otp, setOTP] = React.useState<string | null>(null);
  const [sms, err, stopSMSListener] =
    Platform.OS === ANDROID
      ? useSMSListener(undefined)
      : [null, null, () => {}];

  React.useEffect(() => {
    if (Platform.OS === ANDROID) {
      if (!err) {
        const otp = otpParser(sms);
        setOTP(otp);
      }
    }
  }, [err, otpParser, sms]);

  return [otp, err, stopSMSListener];
}

export default RNOtpVerify;
