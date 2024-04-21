import { cmdBasemodel } from "./commands/basemodel";
import { cmdHelp } from "./commands/help";
import { cmdCreate } from "./commands/create";
import { cmdAsk } from "./commands/ask";
import { cmdClear } from "./commands/clear";
import { cmdTransfer } from "./commands/transfer";
import { cmdList } from "./commands/list";
import { cmdDefault } from "./commands/default";
import { cmdPrompt } from "./commands/prompt";
import { cmdSettings } from "./commands/settings";
import { cmdDebug } from "./commands/debug";
import { cmdInfo } from "./commands/info";
import { cmdDelete } from "./commands/delete";
import { cmdAvatar } from "./commands/avatar";

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
}
