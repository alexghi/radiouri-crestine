import type { VercelRequest, VercelResponse } from "@vercel/node";
import envVar from "env-var";
import { RecaptchaEnterpriseServiceClient } from "@google-cloud/recaptcha-enterprise";

const { get } = envVar;
const RECAPTCHA_KEY = get(`RECAPTCHA_KEY`).asString();
const MAILCHIMP_API_KEY = get(`MAILCHIMP_API_KEY`).asString();
const MAILCHIMP_LIST_ID = get(`MAILCHIMP_LIST_ID`).asString();
const MAILCHIMP_DC = get(`MAILCHIMP_DC`).asString();
const PROJECT_ID = get(`PROJECT_ID`).asString();
console.log({
  RECAPTCHA_KEY,
  MAILCHIMP_API_KEY,
  MAILCHIMP_LIST_ID,
  MAILCHIMP_DC,
});

async function createAssessment({
  projectID = PROJECT_ID,
  recaptchaKey = RECAPTCHA_KEY,
  token = "action-token",
  recaptchaAction = "action-name",
}) {
  // Create the reCAPTCHA client.
  // TODO: Cache the client generation code (recommended) or call client.close() before exiting the method.
  const client = new RecaptchaEnterpriseServiceClient();
  const projectPath = client.projectPath(projectID);

  // Build the assessment request.
  const request = {
    assessment: {
      event: {
        token: token,
        siteKey: recaptchaKey,
      },
    },
    parent: projectPath,
  };

  const [response] = await client.createAssessment(request);

  // Check if the token is valid.
  if (!response.tokenProperties.valid) {
    console.log(
      `The CreateAssessment call failed because the token was: ${response.tokenProperties.invalidReason}`,
    );
    return null;
  }

  if (response.tokenProperties.action === recaptchaAction) {
    console.log(`The reCAPTCHA score is: ${response.riskAnalysis.score}`);
    response.riskAnalysis.reasons.forEach((reason) => {
      console.log(reason);
    });

    return response.riskAnalysis.score;
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

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
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

      const recaptchaScore = await createAssessment({
        token: recaptchaToken,
        recaptchaAction: "subscribe_newsletter",
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
