# react-native-use-otp-verify

Wrapper Hook for [react-native-otp-verify](https://github.com/faizalshap/react-native-otp-verify)

Make yourself familiar with [react-native-otp-verify](https://github.com/faizalshap/react-native-otp-verify#readme) before using this hook .

### Installation

```bash
yarn add react-native-otp-verify react-native-use-otp-verify
```

or

```bash
npm i react-native-otp-verify react-native-use-otp-verify
```

then Follow instruction of [react-native-otp-verify](https://github.com/faizalshap/react-native-otp-verify#readme) first

### Usage

#### Basic Example

```js
import React from 'react';
import {useOtpVerify} from 'rn-use-otp-verify';

const OtpConfirm = () => {
  const [otp, setOtp] = React.useState('');
  const [autoDetectedOtp, autoDetectError] =  useOtpVerify() ;

  React.useEffect(() => {
    if (autoDetectedOtp) {
      setOtp(autoDetectedOtp);
    }
  }, [autoDetectedOtp, handleLogin]);

  ...
};

```

---

### OTP Parser

Default otp parser checks for following regex : /(\d+)[\s]_is|is[\s]_(\d+)\.?/g

i.e. otp SMS must be one of following formats

`OTP is 2098`

`2098 is OTP`

However, you can pass a custom `otpParser` to useOtpVerify hook.

this `otpParser` must accept sms as argument and return otp as string or empty string.

## LICENSE

MIT
