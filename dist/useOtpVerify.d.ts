export declare function smsListener(callback: any): () => void;
export declare function useSMSListener(smsHandler: any | undefined): (string | (() => void) | null)[];
declare function defaultOtpParser(sms: string | null | any): string;
export declare function useOtpVerify(otpParser?: typeof defaultOtpParser): (string | (() => void) | null)[];
declare const _default: {
    getHash: () => Promise<string[]>;
    useOtpVerify: typeof useOtpVerify;
};
export default _default;
