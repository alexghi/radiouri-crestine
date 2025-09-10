import type { VercelRequest, VercelResponse } from "@vercel/node";
import envVar from "env-var";
import { RecaptchaEnterpriseServiceClient } from "@google-cloud/recaptcha-enterprise";

const { get } = envVar;
const RECAPTCHA_KEY = get(`RECAPTCHA_KEY`).asString();
const MAILCHIMP_API_KEY = get(`MAILCHIMP_API_KEY`).asString();
const MAILCHIMP_LIST_ID = get(`MAILCHIMP_LIST_ID`).asString();
const MAILCHIMP_DC = get(`MAILCHIMP_DC`).asString();
const GOOGLE_CLOUD_PROJECT_ID = get(`GOOGLE_CLOUD_PROJECT_ID`).asString();
const GOOGLE_APPLICATION_CREDENTIALS_JSON = get(
  `GOOGLE_APPLICATION_CREDENTIALS_JSON`,
).asString();

async function createAssessment({
  token = "action-token",
  recaptchaAction = "action-name",
}) {
  console.log("Creating assessment...");

  // Parse the JSON string and handle potential parsing errors
  let credentials;
  try {
    credentials = JSON.parse(GOOGLE_APPLICATION_CREDENTIALS_JSON);
  } catch (error) {
    console.error("Failed to parse Google credentials JSON:", error);
    throw new Error("Invalid Google Cloud credentials format");
  }

  const projectId = GOOGLE_CLOUD_PROJECT_ID;

  const client = new RecaptchaEnterpriseServiceClient({
    credentials: {
      ...credentials,
      // Handle newlines in private key properly
      private_key: credentials.private_key?.replace(/\\n/g, "\n"),
    },
    projectId: projectId,
  });

  const projectPath = client.projectPath(projectId);

  // Build the assessment request.
  const request = {
    assessment: {
      event: {
        token: token,
        siteKey: RECAPTCHA_KEY,
      },
    },
    parent: projectPath,
  };

  const [response] = await client.createAssessment(request);

  // Check if the token is valid.
  if (!response.tokenProperties?.valid) {
    console.log(
      `The CreateAssessment call failed because the token was: ${response.tokenProperties?.invalidReason}`,
    );
    return null;
  }

  if (response.tokenProperties.action === recaptchaAction) {
    console.log(`The reCAPTCHA score is: ${response.riskAnalysis?.score}`);
    response.riskAnalysis?.reasons?.forEach((reason) => {
      console.log(reason);
    });

    return response.riskAnalysis?.score;
  } else {
    console.log(
      "The action attribute in your reCAPTCHA tag does not match the action you are expecting to score",
    );
    return null;
  }
}

async function addToMailchimp(
  email: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const mailchimpDc = MAILCHIMP_DC;
    const listId = MAILCHIMP_LIST_ID;
    const apiKey = MAILCHIMP_API_KEY;

    const response = await fetch(
      `https://${mailchimpDc}.api.mailchimp.com/3.0/lists/${listId}/members`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: email,
          status: "subscribed",
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      if (data.title === "Member Exists") {
        return { success: true, message: "You are already subscribed!" };
      }
      throw new Error(data.detail || "Failed to subscribe to newsletter");
    }

    return { success: true, message: "Successfully subscribed to newsletter!" };
  } catch (error) {
    console.error("Mailchimp API error:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to subscribe to newsletter",
    };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log("Function started with method:", req.method);
    console.log("Environment variables check:", {
      RECAPTCHA_KEY: !!RECAPTCHA_KEY,
      MAILCHIMP_API_KEY: !!MAILCHIMP_API_KEY,
      MAILCHIMP_LIST_ID: !!MAILCHIMP_LIST_ID,
      MAILCHIMP_DC: !!MAILCHIMP_DC,
      GOOGLE_CLOUD_PROJECT_ID: !!GOOGLE_CLOUD_PROJECT_ID,
      GOOGLE_APPLICATION_CREDENTIALS_JSON:
        !!GOOGLE_APPLICATION_CREDENTIALS_JSON,
    });

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Check for missing environment variables
    const missingEnvVars = [];
    if (!RECAPTCHA_KEY) missingEnvVars.push("RECAPTCHA_KEY");
    if (!MAILCHIMP_API_KEY) missingEnvVars.push("MAILCHIMP_API_KEY");
    if (!MAILCHIMP_LIST_ID) missingEnvVars.push("MAILCHIMP_LIST_ID");
    if (!MAILCHIMP_DC) missingEnvVars.push("MAILCHIMP_DC");
    if (!GOOGLE_CLOUD_PROJECT_ID)
      missingEnvVars.push("GOOGLE_CLOUD_PROJECT_ID");
    if (!GOOGLE_APPLICATION_CREDENTIALS_JSON)
      missingEnvVars.push("GOOGLE_APPLICATION_CREDENTIALS_JSON");

    if (missingEnvVars.length > 0) {
      console.error("Missing environment variables:", missingEnvVars);
      return res.status(500).json({
        success: false,
        error: "Server configuration error",
        details: `Missing environment variables: ${missingEnvVars.join(", ")}`,
      });
    }

    try {
      console.log("Request body:", JSON.stringify(req.body));
      const { recaptchaToken, email } = req.body;

      if (!recaptchaToken) {
        return res.status(400).json({
          success: false,
          error: "reCAPTCHA token is required",
        });
      }

      if (!email) {
        return res.status(400).json({
          success: false,
          error: "Email is required",
        });
      }

      const recaptchaScore = await createAssessment({
        token: recaptchaToken,
        recaptchaAction: "newsletterSubmit",
      });

      if (
        recaptchaScore === null ||
        recaptchaScore === undefined ||
        recaptchaScore < 0.5
      ) {
        return res.status(400).json({
          success: false,
          error: "reCAPTCHA verification failed",
        });
      }

      const mailchimpResult = await addToMailchimp(email);

      if (!mailchimpResult.success) {
        return res.status(500).json({
          success: false,
          error: mailchimpResult.message,
        });
      }

      return res.status(200).json({
        success: true,
        message: mailchimpResult.message,
      });
    } catch (innerError) {
      console.error("Internal processing error:", innerError);
      return res.status(500).json({
        success: false,
        error: "Internal processing error",
        details:
          innerError instanceof Error ? innerError.message : String(innerError),
      });
    }
  } catch (outerError) {
    console.error("Outer function error:", outerError);
    return res.status(500).json({
      success: false,
      error: "Function execution error",
      details:
        outerError instanceof Error ? outerError.message : String(outerError),
    });
  }
}
