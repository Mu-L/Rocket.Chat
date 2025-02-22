import type { ServerMethods } from '@rocket.chat/ui-contexts';
import { Meteor } from 'meteor/meteor';

import { hasPermissionAsync } from '../../../../../app/authorization/server/functions/hasPermission';
import { LivechatEnterprise } from '../lib/LivechatEnterprise';

declare module '@rocket.chat/ui-contexts' {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface ServerMethods {
		'livechat:removeUnit'(id: string): boolean;
	}
}

Meteor.methods<ServerMethods>({
	async 'livechat:removeUnit'(id) {
		const uid = Meteor.userId();
		if (!uid || !(await hasPermissionAsync(uid, 'manage-livechat-units'))) {
			throw new Meteor.Error('error-not-allowed', 'Not allowed', { method: 'livechat:removeUnit' });
		}

		return LivechatEnterprise.removeUnit(id);
	},
});
