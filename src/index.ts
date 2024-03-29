import axios, {AxiosInstance} from 'axios';

// Define constants representing different types of captcha tasks
const RECAPTCHAV2_TYPE = "RecaptchaV2TaskProxyless";
const RECAPTCHAV2_ENTERPRISE_TYPE = "RecaptchaV2EnterpriseTaskProxyless";
const RECAPTCHAV3_PROXYLESS_TYPE = "RecaptchaV3TaskProxyless";
const RECAPTCHAV3_TYPE = "RecaptchaV3Task";
const RECAPTCHA_MOBILE_TYPE = "RecaptchaMobileProxyless";
const HCAPTCHA_TYPE = "HCaptchaTask";
const HCAPTCHA_PROXYLESS_TYPE = "HCaptchaTaskProxyless";
const HCAPTCHA_ENTERPRISE_TYPE = "HCaptchaEnterpriseTask";
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

    constructor(apiKey: string) {
        // Initialize the Axios client with the API base URL and API key
        this.client = axios.create({
            baseURL: "https://api.nextcaptcha.com",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
            },
        });
    }

    // Send a task to the NextCaptcha API
    async send(task: any): Promise<any> {
        try {
            // Send a POST request to the /createTask endpoint with the task data
            const response = await this.client.post("/createTask", task);
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
            const response = await this.client.post("/getTaskResult", {taskId});
            return response.data;
        } catch (error) {
            console.error("Error getting task result:", error);
            throw error;
        }
    }

    // Get the account balance from the NextCaptcha API
    async getBalance(): Promise<string> {
        try {
            // Send a POST request to the /getBalance endpoint
            const response = await this.client.post("/getBalance");
            return response.data.balance;
        } catch (error) {
            console.error("Error getting balance:", error);
            throw error;
        }
    }
}

// Define the NextCaptcha class for interacting with the NextCaptcha service
class NextCaptcha {
    private api: ApiClient;

    constructor(apiKey: string) {
        // Initialize the ApiClient with the provided API key
        this.api = new ApiClient(apiKey);
    }

    // Wait for a task to complete and return the result
    async waitForResult(taskId: string): Promise<any> {
        console.log(`Waiting for task ${taskId} to complete...`);
        const startTime = Date.now();

        while (true) {
            // Get the task result from the API
            const result = await this.api.getTaskResult(taskId);

            // Check the task status
            if (result.status === READY_STATUS) {
                // Task is completed successfully
                console.info(`Task ${taskId} completed in ${(Date.now() - startTime) / 1000} seconds`);
                return result;
            } else if (result.status === FAILED_STATUS) {
                // Task failed
                console.error(`Task ${taskId} failed`);
                throw new Error("Task failed");
            } else if (Date.now() - startTime >= TIMEOUT * 1000) {
                // Task timed out
                console.error(`Task ${taskId} timed out`);
                throw new Error("Task timed out");
            } else {
                // Task is still pending or processing, wait for a short interval before checking again
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        }
    }

    // Solve a reCAPTCHA v2 task
    async recaptchaV2(
        websiteURL: string,
        websiteKey: string,
        minScore: number = 0.3,
        proxyType: string = "",
        proxyAddress: string = "",
        proxyPort: number = 0,
        proxyLogin: string = "",
        proxyPassword: string = ""
    ): Promise<any> {
        const task: any = {
            type: RECAPTCHAV2_TYPE,
            websiteURL: websiteURL,
            websiteKey: websiteKey,
            minScore: minScore,
        };

        if (proxyAddress) {
            task.type = RECAPTCHAV2_ENTERPRISE_TYPE;
            task.proxyType = proxyType;
            task.proxyAddress = proxyAddress;
            task.proxyPort = proxyPort;
            task.proxyLogin = proxyLogin;
            task.proxyPassword = proxyPassword;
        }

        // Send the task to the API and wait for the result
        const taskId = await this.api.send(task);
        return this.waitForResult(taskId);
    }

    // Solve a reCAPTCHA v3 task
    async recaptchaV3(
        websiteURL: string,
        websiteKey: string,
        pageAction: string,
        minScore: number = 0.3,
        proxyType: string = "",
        proxyAddress: string = "",
        proxyPort: number = 0,
        proxyLogin: string = "",
        proxyPassword: string = ""
    ): Promise<any> {
        const task: any = {
            type: RECAPTCHAV3_PROXYLESS_TYPE,
            websiteURL: websiteURL,
            websiteKey: websiteKey,
            pageAction: pageAction,
            minScore: minScore,
        };

        if (proxyAddress) {
            task.type = RECAPTCHAV3_TYPE;
            task.proxyType = proxyType;
            task.proxyAddress = proxyAddress;
            task.proxyPort = proxyPort;
            task.proxyLogin = proxyLogin;
            task.proxyPassword = proxyPassword;
        }

        // Send the task to the API and wait for the result
        const taskId = await this.api.send(task);
        return this.waitForResult(taskId);
    }

    // Solve a reCAPTCHA mobile task
    async recaptchaMobile(
        websiteURL: string,
        websiteKey: string,
        invisibleMode: boolean = false
    ): Promise<any> {
        const task = {
            type: RECAPTCHA_MOBILE_TYPE,
            websiteURL: websiteURL,
            websiteKey: websiteKey,
            isInvisible: invisibleMode,
        };

        // Send the task to the API and wait for the result
        const taskId = await this.api.send(task);
        return this.waitForResult(taskId);
    }

    // Solve an hCaptcha task
    async hcaptcha(
        websiteURL: string,
        websiteKey: string,
        enterprisePayload: any = {},
        isInvisible: boolean = false,
        proxyType: string = "",
        proxyAddress: string = "",
        proxyPort: number = 0,
        proxyLogin: string = "",
        proxyPassword: string = ""
    ): Promise<any> {
        const task: any = {
            type: HCAPTCHA_PROXYLESS_TYPE,
            websiteURL: websiteURL,
            websiteKey: websiteKey,
            isInvisible: isInvisible,
            enterprisePayload: enterprisePayload,
        };
        if (proxyAddress) {
            task.type = HCAPTCHA_TYPE;
            task.proxyType = proxyType;
            task.proxyAddress = proxyAddress;
            task.proxyPort = proxyPort;
            task.proxyLogin = proxyLogin;
            task.proxyPassword = proxyPassword;
        }

// Send the task to the API and wait for the result
        const taskId = await this.api.send(task);
        return this.waitForResult(taskId);
    }

    // Solve an hCaptcha Enterprise task
    async hcaptchaEnterprise(
        websiteURL: string,
        websiteKey: string,
        enterprisePayload: any = {},
        isInvisible: boolean = false,
        proxyType: string = "",
        proxyAddress: string = "",
        proxyPort: number = 0,
        proxyLogin: string = "",
        proxyPassword: string = ""
    ): Promise<any> {
        const task = {
            type: HCAPTCHA_ENTERPRISE_TYPE,
            websiteURL: websiteURL,
            websiteKey: websiteKey,
            enterprisePayload: enterprisePayload,
            isInvisible: isInvisible,
            proxyType: proxyType,
            proxyAddress: proxyAddress,
            proxyPort: proxyPort,
            proxyLogin: proxyLogin,
            proxyPassword: proxyPassword,
        };
        // Send the task to the API and wait for the result
        const taskId = await this.api.send(task);
        return this.waitForResult(taskId);
    }

    // Solve a FunCaptcha task
    async funcaptcha(
        websitePublicKey: string,
        websiteURL: string = "",
        data: string = "",
        proxyType: string = "",
        proxyAddress: string = "",
        proxyPort: number = 0,
        proxyLogin: string = "",
        proxyPassword: string = ""
    ): Promise<any> {
        const task: any = {
            type: FUNCAPTCHA_PROXYLESS_TYPE,
            websiteURL: websiteURL,
            websitePublicKey: websitePublicKey,
            data: data,
        };
        if (proxyAddress) {
            task.type = FUNCAPTCHA_TYPE;
            task.proxyType = proxyType;
            task.proxyAddress = proxyAddress;
            task.proxyPort = proxyPort;
            task.proxyLogin = proxyLogin;
            task.proxyPassword = proxyPassword;
        }

// Send the task to the API and wait for the result
        const taskId = await this.api.send(task);
        return this.waitForResult(taskId);
    }

    // Get the account balance
    async getBalance(): Promise<string> {
        return this.api.getBalance();
    }
}
