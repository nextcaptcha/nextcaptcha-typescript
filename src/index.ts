import axios, {AxiosInstance} from 'axios';
import {IFunCaptchaTask, IHCaptchaTask, IRecaptchaMobileTask, IReCaptchaV2Task, IReCaptchaV3Task} from "./interface";

// Define constants representing different types of captcha tasks
const RECAPTCHAV2_TYPE = "RecaptchaV2TaskProxyless";
const RECAPTCHAV2_ENTERPRISE_TYPE = "RecaptchaV2EnterpriseTaskProxyless";
const RECAPTCHAV3_PROXYLESS_TYPE = "RecaptchaV3TaskProxyless";
const RECAPTCHAV3_TYPE = "RecaptchaV3Task";
const RECAPTCHA_MOBILE_TYPE = "RecaptchaMobileTaskProxyless";
const HCAPTCHA_ENTERPRISE_TYPE = "HCaptchaEnterpriseTask";
const HCAPTCHA_TYPE = "HCaptchaTask";
const HCAPTCHA_PROXYLESS_TYPE = "HCaptchaTaskProxyless";
const FUNCAPTCHA_TYPE = "FunCaptchaTask";
const FUNCAPTCHA_PROXYLESS_TYPE = "FunCaptchaTaskProxyless";

// Define the timeout (in seconds) for tasks
const TIMEOUT = 45;

// Define constants representing different task statuses
const PENDING_STATUS = "pending";
const PROCESSING_STATUS = "processing";
const READY_STATUS = "ready";
const FAILED_STATUS = "failed";

// Define a custom error class
class TaskBadParametersError extends Error {
}

// Define the ApiClient class for communicating with the NextCaptcha API
class ApiClient {
  private client: AxiosInstance;
  private readonly clientKey: string;

  constructor(apiKey: string) {
    // Initialize the Axios client with the API base URL and API key
    this.clientKey = apiKey;
    this.client = axios.create({
      baseURL: "https://api.nextcaptcha.com",
    });
  }

  // Send a task to the NextCaptcha API
  async send(task: any): Promise<any> {
    try {
      // Send a POST request to the /createTask endpoint with the task data
      const response = await this.client.post("/createTask", {
        clientKey: this.clientKey,
        task
      });
      return response.data;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  // Get the result of a task from the NextCaptcha API
  async getTaskResult(taskId: string): Promise<any> {
    try {
      // Send a POST request to the /getTaskResult endpoint with the task ID
      const response = await this.client.post("/getTaskResult", {
        clientKey: this.clientKey,
        taskId,
      });
      return response.data;
    } catch (error) {
      console.error("Error getting task result:", error);
      throw error;
    }
  }

  // Get the account balance from the NextCaptcha API
  async getBalance(): Promise<number> {
    try {
      // Send a POST request to the /getBalance endpoint
      const response = await this.client.post("/getBalance", {
        clientKey: this.clientKey,
      });
      return response?.data?.balance;
    } catch (error) {
      console.error("Error getting balance:", error);
      throw error;
    }
  }
}

// Define the NextCaptcha class for interacting with the NextCaptcha service
export class NextCaptcha {
  private api: ApiClient;

  constructor(apiKey: string) {
    // Initialize the ApiClient with the provided API key
    this.api = new ApiClient(apiKey);
  }

  // Wait for a task to complete and return the result
  async waitForResult(taskId: string, tryTimes = 0): Promise<any> {
    // Get the task result from the API
    const result = await this.api.getTaskResult(taskId);

    // Check the task status
    if (result.status === READY_STATUS) {
      // Task is completed successfully
      console.info(`Task ${taskId} completed in ${tryTimes} seconds`);
      return result;
    } else if (result.status === FAILED_STATUS) {
      // Task failed
      console.error(`Task ${taskId} failed`);
      throw new Error("Task failed");
    } else if (tryTimes > TIMEOUT) {
      // Task timed out
      console.error(`Task ${taskId} timed out`);
      throw new Error("Task timed out");
    } else {
      // Task is still pending or processing, wait for a short interval before checking again
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return this.waitForResult(taskId, tryTimes++)
    }
  }

  // Solve a reCAPTCHA v2 task
  async recaptchaV2(
    {
      websiteURL,
      websiteKey,
      recaptchaDataSValue,
      isInvisible,
      apiDomain,
      proxyType = "",
      proxyAddress = "",
      proxyPort = 0,
      proxyLogin = "",
      proxyPassword = ""
    }: IReCaptchaV2Task
  ): Promise<any> {
    const task: any = {
      type: RECAPTCHAV2_TYPE,
      websiteURL,
      websiteKey,
      recaptchaDataSValue,
      isInvisible,
      apiDomain,
    };

    if (proxyAddress) {
      task.proxyType = proxyType;
      task.proxyAddress = proxyAddress;
      task.proxyPort = proxyPort;
      task.proxyLogin = proxyLogin;
      task.proxyPassword = proxyPassword;
    }

    // Send the task to the API and wait for the result
    const taskId = (await this.api.send(task))?.taskId;

    return this.waitForResult(taskId);
  }

  // Solve a reCAPTCHA v3 task
  async recaptchaV3(
    {
      websiteURL,
      websiteKey,
      pageAction,
      proxyType = "",
      proxyAddress = "",
      proxyPort = 0,
      proxyLogin = "",
      proxyPassword = ""
    }: IReCaptchaV3Task
  ): Promise<any> {
    const task: any = {
      type: proxyAddress ? RECAPTCHAV3_TYPE : RECAPTCHAV3_PROXYLESS_TYPE,
      websiteURL: websiteURL,
      websiteKey: websiteKey,
      pageAction: pageAction,
    };

    if (proxyAddress) {
      task.proxyType = proxyType;
      task.proxyAddress = proxyAddress;
      task.proxyPort = proxyPort;
      task.proxyLogin = proxyLogin;
      task.proxyPassword = proxyPassword;
    }
    // Send the task to the API and wait for the result
    const taskId = (await this.api.send(task)).taskId;
    return this.waitForResult(taskId);
  }

  // Solve a reCAPTCHA mobile task
  async recaptchaMobile(
    {
      appPackageName,
      appKey,
      appAction,
      appDevice
    }: IRecaptchaMobileTask
  ): Promise<any> {
    const task = {
      type: RECAPTCHA_MOBILE_TYPE,
      appPackageName,
      appKey,
      appAction,
      appDevice
    };

    // Send the task to the API and wait for the result
    const taskId = (await this.api.send(task)).taskId;
    return this.waitForResult(taskId);
  }

  // Solve an hCaptcha task
  async hcaptcha(
    {
      websiteURL,
      websiteKey,
      enterprisePayload = {},
      isInvisible = false,
      proxyType = "",
      proxyAddress = "",
      proxyPort = 0,
      proxyLogin = "",
      proxyPassword = ""
    }: IHCaptchaTask
  ): Promise<any> {
    const task: any = {
      type: proxyAddress ? HCAPTCHA_TYPE : HCAPTCHA_PROXYLESS_TYPE,
      websiteURL: websiteURL,
      websiteKey: websiteKey,
      isInvisible: isInvisible,
      enterprisePayload: enterprisePayload,
    };
    if (proxyAddress) {
      task.proxyType = proxyType;
      task.proxyAddress = proxyAddress;
      task.proxyPort = proxyPort;
      task.proxyLogin = proxyLogin;
      task.proxyPassword = proxyPassword;
    }

// Send the task to the API and wait for the result
    const taskId = (await this.api.send(task)).taskId;
    return this.waitForResult(taskId);
  }
  async hcaptchaEnterprise(
    {
      websiteURL,
      websiteKey,
      enterprisePayload = {},
      isInvisible = false,
      proxyType = "",
      proxyAddress = "",
      proxyPort = 0,
      proxyLogin = "",
      proxyPassword = ""
    }: IHCaptchaTask
  ): Promise<any> {
    const task: any = {
      type: HCAPTCHA_ENTERPRISE_TYPE,
      websiteURL: websiteURL,
      websiteKey: websiteKey,
      isInvisible: isInvisible,
      enterprisePayload: enterprisePayload,
    };
    if (proxyAddress) {
      task.proxyType = proxyType;
      task.proxyAddress = proxyAddress;
      task.proxyPort = proxyPort;
      task.proxyLogin = proxyLogin;
      task.proxyPassword = proxyPassword;
    }

// Send the task to the API and wait for the result
    const taskId = (await this.api.send(task)).taskId;
    return this.waitForResult(taskId);
  }


  // Solve a FunCaptcha task
  async funcaptcha(
    {
      websitePublicKey ,
      websiteURL = "",
      data = "",
      proxyType = "",
      proxyAddress = "",
      proxyPort = 0,
      proxyLogin = "",
      proxyPassword = ""
    }: IFunCaptchaTask
  ): Promise<any> {
    const task: any = {
      type: proxyAddress ? FUNCAPTCHA_TYPE : FUNCAPTCHA_PROXYLESS_TYPE,
      websiteURL,
      websitePublicKey,
      data,
    };
    if (proxyAddress) {
      task.proxyType = proxyType;
      task.proxyAddress = proxyAddress;
      task.proxyPort = proxyPort;
      task.proxyLogin = proxyLogin;
      task.proxyPassword = proxyPassword;
    }

// Send the task to the API and wait for the result
    const taskId = (await this.api.send(task)).taskId;
    return this.waitForResult(taskId);
  }

  // Get the account balance
  async getBalance(): Promise<number> {
    return this.api.getBalance();
  }
}
