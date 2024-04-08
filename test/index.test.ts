import {describe, expect, test} from '@jest/globals';
import NextCaptcha from '../src'

require('dotenv').config();


const clientKey = process.env.CLIENT_KEY || '';
const client = new NextCaptcha(clientKey);

describe('client', () => {

  test('getBalance', async () => {
    const balance = await client.getBalance();
    expect(typeof balance).toBe('number');
  }, 30000);

  test('recaptchaV2Proxyless', async () => {
    const result = await client.recaptchaV2({
      websiteKey: '6Le-wvkSAAAAAPBMRTvw0Q4Muexq9bi0DJwx_mJ-',
      websiteURL: 'https://www.google.com/recaptcha/api2/demo'
    });
    expect(result?.errorId).toEqual(0);
    expect(result?.status).toEqual('ready');
    expect(typeof result?.solution?.gRecaptchaResponse).toEqual('string');
  });

  test('recaptchaV3Proxyless', async () => {
    const result = await client.recaptchaV3({
      websiteKey: '6LdKlZEpAAAAAAOQjzC2v_d36tWxCl6dWsozdSy9',
      websiteURL: 'https://recaptcha-demo.appspot.com/recaptcha-v3-request-scores.php',
      pageAction: 'examples/v3scores'
    });
    expect(result?.errorId).toEqual(0);
    expect(result?.status).toEqual('ready');
    expect(typeof result?.solution?.gRecaptchaResponse).toEqual('string');
  });

  test('recaptchaMobile', async () => {
    const result = await client.recaptchaMobile({
      "appPackageName": "com.reddit.frontpage",
      "appKey": "6LdyAhomAAAAAGFyldGQ2cRYneZZS-5FnEG_xjwb",
      "appAction": "login_with_password",
      "appDevice": "Android"
    });
    expect(result?.errorId).toEqual(0);
    expect(result?.status).toEqual('ready');
    expect(typeof result?.solution?.gRecaptchaResponse).toEqual('string');
  });

  test('hcaptcha', async () => {
    const result = await client.hcaptcha({
      "websiteURL": "https://discord.com",
      "websiteKey": "4c672d35-0701-42b2-88c3-78380b0db560",
    });
    expect(result?.errorId).toEqual(0);
    expect(result?.status).toEqual('ready');
    expect(typeof result?.solution?.gRecaptchaResponse).toEqual('string');
  });

  test('funcaptcha', async () => {
    const result = await client.funcaptcha({
      "websiteURL": "https://iframe.arkoselabs.com/7D857050-F609-4F6A-AF63-CD04DE665FFE/index.html?mkt=en",
      "websitePublicKey": "7D857050-F609-4F6A-AF63-CD04DE665FFE",
    });
    expect(result?.errorId).toEqual(0);
    expect(result?.status).toEqual('ready');
    expect(typeof result?.solution?.token).toEqual('string');
  });
});