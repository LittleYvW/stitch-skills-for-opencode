import { homedir } from 'os';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync, cpSync, rmSync, readdirSync, readFileSync, writeFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pluginsRoot = join(__dirname, '../../plugins');
const CACHE_DIR = join(homedir(), '.cache', 'opencode', 'stitch-skills-cache');

function convertName(name) {
  return name.toLowerCase().replace(/::|:/g, '-');
}

function findSkills() {
  const results = [];
  if (!existsSync(pluginsRoot)) return results;
  for (const plugin of readdirSync(pluginsRoot)) {
    const skillsDir = join(pluginsRoot, plugin, 'skills');
    if (!existsSync(skillsDir)) continue;
    for (const skill of readdirSync(skillsDir)) {
      const skillDir = join(skillsDir, skill);
      const skillFile = join(skillDir, 'SKILL.md');
      if (existsSync(skillFile)) {
        results.push({ dir: skillDir, file: skillFile });
      }
    }
  }
  return results;
}

function buildCache() {
  if (existsSync(CACHE_DIR)) rmSync(CACHE_DIR, { recursive: true });
  mkdirSync(CACHE_DIR, { recursive: true });

  const skills = findSkills();
  for (const { dir: skillDir, file: skillFile } of skills) {
    const content = readFileSync(skillFile, 'utf-8');
    const nameMatch = content.match(/^---\s*\nname:\s*(.+)$/m);
    if (!nameMatch) continue;

    const originalName = nameMatch[1].trim();
    const newName = convertName(originalName);
    const targetDir = join(CACHE_DIR, newName);

    cpSync(skillDir, targetDir, { recursive: true });

    const targetFile = join(targetDir, 'SKILL.md');
    let newContent = readFileSync(targetFile, 'utf-8');
    newContent = newContent.replace(/^(name:\s*).+$/m, `$1${newName}`);
    writeFileSync(targetFile, newContent);
  }
}

export const StitchSkillsPlugin = async () => {
  buildCache();
  return {
    config: async (config) => {
      config.skills = config.skills || {};
      config.skills.paths = config.skills.paths || [];
      if (!config.skills.paths.includes(CACHE_DIR)) {
        config.skills.paths.push(CACHE_DIR);
      }
    },
  };
};
