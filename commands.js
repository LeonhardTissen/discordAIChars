import { cmdBasemodel } from "./commands/basemodel.js";
import { cmdHelp } from "./commands/help.js";
import { cmdCreate } from "./commands/create.js";
import { cmdAsk } from "./commands/ask.js";
import { cmdClear } from "./commands/clear.js";
import { cmdTransfer } from "./commands/transfer.js";
import { cmdList } from "./commands/list.js";
import { cmdDefault } from "./commands/default.js";
import { cmdPrompt } from "./commands/prompt.js";
import { cmdSettings } from "./commands/settings.js";
import { cmdDebug } from "./commands/debug.js";
import { cmdInfo } from "./commands/info.js";
import { cmdDelete } from "./commands/delete.js";
import { cmdAvatar } from "./commands/avatar.js";
import { cmdChain } from "./commands/chain.js";

export const commandList = {
	'basemodel': cmdBasemodel,
	'help': cmdHelp,
	'create': cmdCreate,
	'ask': cmdAsk,
	'clear': cmdClear,
	'transfer': cmdTransfer,
	'list': cmdList,
	'default': cmdDefault,
	'prompt': cmdPrompt,
	'settings': cmdSettings,
	'debug': cmdDebug,
	'info': cmdInfo,
	'delete': cmdDelete,
	'avatar': cmdAvatar,
	'chain': cmdChain,
}
