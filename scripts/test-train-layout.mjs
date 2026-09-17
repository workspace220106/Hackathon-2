import assert from 'node:assert/strict';
import { layout, carX, doorCenterX, VIEW, PHASES } from '../src/components/train/trainDoorsLayout.js';

const env = { scale: 1.2, vw: 1440 };
const off = layout(0, env);
assert.equal(off.x, 1440, 'train starts fully off the right edge');
assert.deepEqual(off.doors, [0, 0, 0, 0]);

const rest0 = layout(PHASES.enterEnd, env);
assert.equal(Math.round(rest0.x), Math.round(1440 / 2 - 1.2 * doorCenterX(0)), 'door 0 centred after entry');

const mid0 = layout(PHASES.enterEnd + PHASES.slotLen * 0.5, env);
assert.equal(mid0.doors[0], 1, 'door 0 fully open mid-slot');
assert.equal(mid0.panels[0], 1, 'panel 0 visible mid-slot');
assert.equal(mid0.doors[1], 0);

const mid2 = layout(PHASES.enterEnd + PHASES.slotLen * 2.5, env);
assert.equal(Math.round(mid2.x), Math.round(1440 / 2 - 1.2 * doorCenterX(2)), 'door 2 centred in slot 2');
assert.equal(mid2.doors[2], 1);
assert.equal(mid2.doors[1], 0, 'previous door closed');

const end = layout(1, env);
assert.ok(end.x < -VIEW.W * 1.2, 'train fully off the left at the end');
assert.equal(end.phase, 'exit');
assert.equal(carX(1), VIEW.CAR_X0 + VIEW.CAR_W + VIEW.CAR_GAP);
console.log('trainDoorsLayout ok');
