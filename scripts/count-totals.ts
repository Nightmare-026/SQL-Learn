import { CURRICULUM_INDEX } from '../src/content/modules/index';
const entries = Object.values(CURRICULUM_INDEX);
const tasks = entries.reduce((a, e) => a + e.taskCount, 0);
console.log('modules:', entries.length, '| total tasks:', tasks, '| quiz questions:', entries.length * 4, '| hints:', tasks * 3);
