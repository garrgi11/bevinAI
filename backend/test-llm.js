require('dotenv').config();
const llmService = require('./services/llm.service');

async function testLLM() {
  console.log('🧪 Testing LLM Service...\n');

  try {
    // Test basic completion
    console.log('📝 Testing basic completion...');
    const result = await llmService.generateCompletion(
      '/think',
      'What are the key considerations for building a SaaS product?',
      { max_tokens: 1024 }
    );

    console.log('\n✅ Response:');
    console.log('Content:', result.content);
    console.log('\n🧠 Reasoning:', result.reasoning);
    console.log('\n📊 Usage:', result.usage);

    // Test streaming
    console.log('\n\n📡 Testing streaming completion...');
    await llmService.generateStreamingCompletion(
      '/think',
      'List 3 benefits of using AI in product management.',
      (chunk) => {
        if (chunk.reasoning) process.stdout.write(`[Reasoning: ${chunk.reasoning}]`);
        if (chunk.content) process.stdout.write(chunk.content);
      },
      { max_tokens: 512 }
    );

    console.log('\n\n✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testLLM();
