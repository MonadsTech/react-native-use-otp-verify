"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOtpVerify = exports.useSMSListener = exports.smsListener = void 0;
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
var react_native_otp_verify_1 = __importDefault(require("react-native-otp-verify"));
function smsListener(callback) {
    react_native_otp_verify_1.default.getOtp()
        .then(function (p) {
        return react_native_otp_verify_1.default.addListener(function (message) {
            try {
                if (message) {
                    callback(null, message);
                }
            }
            catch (error) {
                callback(error);
            }
        });
    })
        .catch(function (p) { return console.log(p); });
    return function () { return react_native_otp_verify_1.default.removeListener(); };
}
exports.smsListener = smsListener;
function useSMSListener(smsHandler) {
    var _a = react_1.default.useState(''), sms = _a[0], setSMS = _a[1];
    var _b = react_1.default.useState(null), err = _b[0], setErr = _b[1];
    var cancelSMSListener = react_1.default.useRef(function () { });
    react_1.default.useEffect(function () {
        cancelSMSListener.current = smsListener(function (error, message) {
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
exports.useSMSListener = useSMSListener;
var OTP_REGEX = /(\d+)[\s]*is|is[\s]*(\d+)\.?/g;
var ANDROID = 'android';
function defaultOtpParser(sms) {
    var otpMatch = OTP_REGEX.exec(sms || '');
    return otpMatch ? otpMatch[1] || otpMatch[2] || '' : '';
}
function useOtpVerify(otpParser) {
    if (otpParser === void 0) { otpParser = defaultOtpParser; }
    var _a = react_1.default.useState(null), otp = _a[0], setOTP = _a[1];
    var _b = react_native_1.Platform.OS === ANDROID
        ? useSMSListener(undefined)
        : [null, null, function () { }], sms = _b[0], err = _b[1], stopSMSListener = _b[2];
    react_1.default.useEffect(function () {
        if (react_native_1.Platform.OS === ANDROID) {
            if (!err) {
                var otp_1 = otpParser(sms);
                setOTP(otp_1);
            }
        }
    }, [err, otpParser, sms]);
    return [otp, err, stopSMSListener];
}
exports.useOtpVerify = useOtpVerify;
exports.default = react_native_otp_verify_1.default;
