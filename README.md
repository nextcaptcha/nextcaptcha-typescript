# NextCaptcha Node.js SDK

NextCaptcha is a powerful captcha solving service that supports various types of captchas including reCAPTCHA v2,
reCAPTCHA v2 Enterprise, reCAPTCHA v3, reCAPTCHA Mobile, hCaptcha, hCaptcha Enterprise, and FunCaptcha. With
NextCaptcha, you can easily solve a variety of captcha challenges in your automation scripts and programs.

This SDK provides a simple and easy-to-use Node.js interface for interacting with the NextCaptcha API. It supports all
available captcha types and offers intuitive methods for solving different types of captchas.

## Installation

You can install the NextCaptcha Node.js SDK using npm:

```shell
npm install nextcaptcha-ts
```

## Usage

To start using the NextCaptcha Node.js SDK, you first need to obtain your API key from the NextCaptcha Dashboard. Then,
you can create a NextCaptcha instance:

```typescript
import NextCaptcha from 'nextcaptcha-ts';

const apiKey = 'YOUR_API_KEY';
const nextCaptcha = new NextCaptcha(apiKey);
```

Now, you can use the nextCaptcha object to solve various types of captchas.
Solving reCAPTCHA v2
To solve reCAPTCHA v2 challenges, use the recaptchaV2 method:

```typescript
const result = await nextCaptcha.recaptchaV2({websiteURL, websiteKey});
```

Solving reCAPTCHA v3
To solve reCAPTCHA v3 challenges, use the recaptchaV3 method:

```typescript
const result = await nextCaptcha.recaptchaV3({websiteURL, websiteKey, pageAction});
```

Solving reCAPTCHA Mobile
To solve reCAPTCHA Mobile challenges, use the recaptchaMobile method:

```typescript
const result = await nextCaptcha.recaptchaMobile({websiteURL, websiteKey});
```

Solving hCaptcha
To solve hCaptcha challenges, use the hcaptcha method:

```typescript
const result = await nextCaptcha.hcaptcha({websiteURL, websiteKey});
```

Solving hCaptcha Enterprise
To solve hCaptcha Enterprise challenges, use the hcaptchaEnterprise method:

```typescript
const result = await nextCaptcha.hcaptchaEnterprise({websiteURL, websiteKey, enterprisePayload});
```

Solving FunCaptcha
To solve FunCaptcha challenges, use the funcaptcha method:

```typescript
const result = await nextCaptcha.funcaptcha({websitePublicKey, websiteURL});
```

Checking Account Balance
To check your NextCaptcha account balance, use the getBalance method:

```typescript
const balance = await nextCaptcha.getBalance();
console.log(`Account balance: ${balance}`);
```

## Error Handling

If an error occurs while solving a captcha, the SDK will throw an error. You can catch and handle these errors using a
try-catch block.

## Contributing

If you find any bugs or have suggestions for improvement, please feel free to submit an issue or send a pull request. We
welcome all contributions!

## License

This project is licensed under the MIT License. For more information, please see the LICENSE file.
