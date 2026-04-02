import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const idFile = '.lyzr_agent_id';

if (!process.env.LYZR_API_KEY) {
  console.error('No LYZR_API_KEY found. Set LYZR_API_KEY and rerun npm run lyzr:bootstrap.');
  process.exit(1);
}

const hasAgentId = existsSync(idFile) && readFileSync(idFile, 'utf-8').trim().length > 0;
const subcommand = hasAgentId ? 'update' : 'create';

const runArgs = ['--yes', '@open-gitagent/gitagent@0.1.5', 'lyzr', subcommand, '-d', '.'];
const runResult = spawnSync('npx', runArgs, {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (runResult.status !== 0) {
  process.exit(runResult.status ?? 1);
}

const infoArgs = ['--yes', '@open-gitagent/gitagent@0.1.5', 'lyzr', 'info', '-d', '.'];
const infoResult = spawnSync('npx', infoArgs, {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (infoResult.status !== 0) {
  process.exit(infoResult.status ?? 1);
}
