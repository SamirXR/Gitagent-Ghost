# GitAgent Resource Checklist (Verified)

## Official Links
- GitAgent main repository: https://github.com/open-gitagent/gitagent
- Official specification: https://github.com/open-gitagent/gitagent/blob/main/spec/SPECIFICATION.md
- Official examples: https://github.com/open-gitagent/gitagent/tree/main/examples
- Lyzr adapter example: https://github.com/open-gitagent/gitagent/tree/main/examples/lyzr-agent
- All adapters: https://github.com/open-gitagent/gitagent#adapters
- Compliance section: https://github.com/open-gitagent/gitagent#compliance
- OSS page: https://oss.lyzr.ai/gitagent
- Website: https://www.gitagent.sh/

## In-Project Method Coverage
- Validate: npm run validate
- Info: npm run info
- Audit: npm run audit
- Export system prompt: npm run export:system-prompt
- Export adapters: npm run export:claude-code, npm run export:openai, npm run export:crewai, npm run export:openclaw, npm run export:nanobot, npm run export:lyzr, npm run export:github
- Run adapters: npm run run:claude, npm run run:github
- Lyzr methods: npm run lyzr:create, npm run lyzr:update, npm run lyzr:info, npm run lyzr:run

## CLI Note
- Hackathon docs often show: npm install -g gitagent
- Current npm package in use: npm install -g @open-gitagent/gitagent
- This project pins @open-gitagent/gitagent@0.1.5 in scripts for stable local behavior.
