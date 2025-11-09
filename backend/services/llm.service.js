const OpenAI = require('openai');

class LLMService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.NVIDIA_API_KEY || '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',
      baseURL: 'https://integrate.api.nvidia.com/v1',
    });
    
    this.model = 'nvidia/nvidia-nemotron-nano-9b-v2';
  }

  /**
   * Generate a completion with reasoning
   * @param {string} systemPrompt - System prompt for the model
   * @param {string} userMessage - User message
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} - Response with content and reasoning
   */
  async generateCompletion(systemPrompt, userMessage, options = {}) {
    try {
      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ];

      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages,
        temperature: options.temperature || 0.6,
        top_p: options.top_p || 0.95,
        max_tokens: options.max_tokens || 2048,
        frequency_penalty: options.frequency_penalty || 0,
        presence_penalty: options.presence_penalty || 0,
        stream: false,
        extra_body: {
          min_thinking_tokens: options.min_thinking_tokens || 1024,
          max_thinking_tokens: options.max_thinking_tokens || 2048
        }
      });

      return {
        content: completion.choices[0]?.message?.content || '',
        reasoning: completion.choices[0]?.message?.reasoning_content || '',
        usage: completion.usage
      };
    } catch (error) {
      console.error('LLM Service Error:', error);
      throw new Error(`Failed to generate completion: ${error.message}`);
    }
  }

  /**
   * Generate a streaming completion with reasoning
   * @param {string} systemPrompt - System prompt for the model
   * @param {string} userMessage - User message
   * @param {Function} onChunk - Callback for each chunk
   * @param {Object} options - Additional options
   */
  async generateStreamingCompletion(systemPrompt, userMessage, onChunk, options = {}) {
    try {
      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ];

      const completion = await this.openai.chat.completions.create({
        model: this.model,
        messages,
        temperature: options.temperature || 0.6,
        top_p: options.top_p || 0.95,
        max_tokens: options.max_tokens || 2048,
        frequency_penalty: options.frequency_penalty || 0,
        presence_penalty: options.presence_penalty || 0,
        stream: true,
        extra_body: {
          min_thinking_tokens: options.min_thinking_tokens || 1024,
          max_thinking_tokens: options.max_thinking_tokens || 2048
        }
      });

      for await (const chunk of completion) {
        const reasoning = chunk.choices[0]?.delta?.reasoning_content;
        const content = chunk.choices[0]?.delta?.content || '';
        
        if (onChunk) {
          onChunk({ reasoning, content });
        }
      }
    } catch (error) {
      console.error('LLM Streaming Error:', error);
      throw new Error(`Failed to generate streaming completion: ${error.message}`);
    }
  }

  /**
   * Analyze project requirements and generate PRD
   * @param {Object} requirements - Project requirements
   * @returns {Promise<Object>} - Generated PRD analysis
   */
  async analyzeRequirements(requirements) {
    const systemPrompt = `You are an expert product manager and technical analyst. 
Analyze the provided project requirements and generate a comprehensive Product Requirements Document (PRD).
Include: market analysis, technical recommendations, cost estimates, timeline, and potential risks.`;

    const userMessage = `
Project Name: ${requirements.projectName}
Description: ${requirements.projectDescription}
Business Objectives: ${requirements.businessObjectives || 'Not specified'}
Target Audience: ${requirements.targetAudience || 'Not specified'}
Budget Range: ${requirements.budgetRange || 'Flexible'}
Timeline: ${requirements.timeline || 'Flexible'}

Please provide a detailed analysis and PRD.`;

    return await this.generateCompletion(systemPrompt, userMessage, {
      max_tokens: 4096,
      temperature: 0.7
    });
  }
}

module.exports = new LLMService();
