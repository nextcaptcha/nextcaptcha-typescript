export interface IReCaptchaV2Task {
  websiteURL: string;
  websiteKey: string;
  recaptchaDataSValue?: string;
  isInvisible?: boolean;
  apiDomain?: string;
  proxyType?: string;
  proxyAddress?: string;
  proxyPort?: number;
  proxyLogin?: string;
  proxyPassword?: string;
}

export type IReCaptchaV3Task = IReCaptchaV2Task & { pageAction?: string }

export interface IRecaptchaMobileTask {
  appPackageName: string;
  appKey: string;
  appAction: string;
  appDevice?: string
}

export interface IHCaptchaTask {
  websiteURL: string;
  websiteKey: string;
  isInvisible?: boolean;
  enterprisePayload?: any;
  proxyType?: string;
  proxyAddress?: string;
  proxyPort?: number;
  proxyLogin?: string;
  proxyPassword?: string;
}
export interface IFunCaptchaTask {
  websiteURL: string;
  websitePublicKey: string;
  data?: string;
  enterprisePayload?: any;
  proxyType?: string;
  proxyAddress?: string;
  proxyPort?: number;
  proxyLogin?: string;
  proxyPassword?: string;
}