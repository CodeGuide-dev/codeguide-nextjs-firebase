import { OpenAI } from "openai";
import { ChatCompletionCreateParamsBase, ChatCompletionMessageParam } from "openai/resources/chat/completions";

interface GenerateCompletionArgs {
    chat: ChatCompletionMessageParam[];
    maxTokens?: number;
    onComplete?: (data: OpenAI.Chat.Completions.ChatCompletion) => void;
    responseFormatType?: ChatCompletionCreateParamsBase['response_format'];
    model?: OpenAI.Chat.ChatModel;
    toolParams?: {
        toolsChoice?: OpenAI.Chat.Completions.ChatCompletionToolChoiceOption;
        tools: OpenAI.Chat.Completions.ChatCompletionTool[];
    };
}

type CompletionResult = string | OpenAI.Chat.Completions.ChatCompletionMessage & { reasoning_content: string };

/**
 * Generate a completion using OpenAI API
 * @param args - Configuration for the completion generation
 * @param args.chat - Array of chat messages for context
 * @param args.maxTokens - Maximum number of tokens in the response (default: 200)
 * @param args.onComplete - Optional callback for the full completion response
 * @param args.responseFormatType - Specify the format of the response
 * @param args.model - OpenAI model to use (default: "gpt-4")
 * @param args.toolParams - Optional configuration for tool usage
 * @returns The generated completion text or message object
 * @throws Error if the API call fails or no completion is returned
 */
export async function generateCompletion(args: GenerateCompletionArgs): Promise<CompletionResult> {
    const {
        chat,
        maxTokens = 200,
        onComplete,
        responseFormatType,
        model = "gpt-4o",
        toolParams,
    } = args;

    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
        throw new Error("OpenAI API key is not configured");
    }

    const openai = new OpenAI({ apiKey: openaiKey });

    const isReadoningModel = model.includes("o3") || model.includes("o1")

    try {
        const response = await openai.chat.completions.create({
            model,
            messages: chat,
            max_tokens: isReadoningModel ? undefined : maxTokens,
            response_format: responseFormatType ?? { type: "text" },
            tool_choice: toolParams?.toolsChoice,
            tools: toolParams?.tools,
            max_completion_tokens: isReadoningModel ? maxTokens : undefined,
        });

        onComplete?.(response);

        const messageContent = response.choices[0]?.message?.content;
        if (!messageContent) {
            console.error("Unexpected OpenAI response:", JSON.stringify(response));
            throw new Error("No completion content found in the response");
        }

        return messageContent;
    } catch (error) {
        console.error("Error generating completion:", error);
        throw error instanceof Error
            ? error
            : new Error("Failed to generate completion");
    }
}