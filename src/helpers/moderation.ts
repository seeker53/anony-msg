import ModerationApi from "@moderation-api/sdk";

// Ensure the API key is typed correctly as a string or undefined
const moderationApi = new ModerationApi({
    key: process.env.MODERATION_API_KEY || "", // Provide a fallback in case the env variable is not set
});

// Define a type for the label scores
interface LabelScores {
    [key: string]: number; // Dynamic structure for label scores
}

// Define interfaces for each moderation category
interface NSFW {
    label?: string; // Made optional
    score?: number; // Made optional
    label_scores?: LabelScores; // Optional, may not be present
    error?: string; // Added error property
    warning?: string; // Added warning property
}

interface Toxicity {
    label?: string; // Made optional
    score?: number; // Made optional
    label_scores?: LabelScores; // Optional, may not be present
}

interface Sexual {
    label?: string; // Made optional
    score?: number; // Made optional
    label_scores?: LabelScores; // Optional, may not be present
}

interface SelfHarm {
    label?: string; // Made optional
    score?: number; // Made optional
    label_scores?: LabelScores; // Optional, may not be present
}

interface Violence {
    label?: string; // Made optional
    score?: number; // Made optional
    label_scores?: LabelScores; // Optional, may not be present
}

// Define the complete ModerationResponse interface
interface ModerationResponse {
    status: string;
    contentId?: string; // Optional, might be missing in some responses
    request: {
        timestamp: number;
        quota_usage: number;
    };
    content_moderated: boolean;
    unicode_spoofing?: boolean;
    data_found?: boolean;
    flagged: boolean;
    original: string;
    content: string;
    nsfw?: NSFW;          // Optional property
    toxicity?: Toxicity;  // Optional property
    sexual?: Sexual;      // Optional property
    self_harm?: SelfHarm; // Optional property
    violence?: Violence;   // Optional property
    email?: {
        found?: boolean;
        mode?: string;
        matches?: string[];
    };
    phone?: {
        mode?: "NORMAL" | "SUSPICIOUS" | "PARANOID" | undefined;
        found?: boolean | undefined;
        matches?: string[] | undefined;
        components?: any;
        error?: string | undefined;
        warning?: string | undefined;
    };
    sentiment?: {
        label?: string;
        labelIndex?: number;
        score?: number;
        label_scores?: {
            NEUTRAL?: number;
            POSITIVE?: number;
            NEGATIVE?: number;
        };
    };
}

// Function to check if the content is harmful
export async function checkIfHarmful(content: string): Promise<ModerationResponse> {
    try {
        const analysis: ModerationResponse = await moderationApi.moderate.text({
            value: content,
        });

        // Return the full analysis object for further use
        return analysis;
    } catch (error: unknown) {
        if (error instanceof Error) {
            // Throw an error if the moderation API call fails
            throw new Error(`Failed to validate content with Moderation API: ${error.message}`);
        } else {
            throw new Error("Unknown error occurred during content validation");
        }
    }
}
