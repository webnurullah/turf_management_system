// Registers every config-driven list screen from src/admin/modules.mjs.
import { MODULES } from '../../admin/modules.mjs';
import { crudPage } from '../../admin/crud.mjs';

export default MODULES.map(crudPage);
