import { Meteor } from 'meteor/meteor';
import { Subscriptions } from '@rocket.chat/models';

import { settings } from '../../../settings/server';
import { Users } from '../../../models/server';
import { trim } from '../../../../lib/utils/stringUtils';

export const saveCustomFieldsWithoutValidation = async function (userId, formData) {
	if (trim(settings.get('Accounts_CustomFields')) !== '') {
		let customFieldsMeta;
		try {
			customFieldsMeta = JSON.parse(settings.get('Accounts_CustomFields'));
		} catch (e) {
			throw new Meteor.Error('error-invalid-customfield-json', 'Invalid JSON for Custom Fields');
		}

		const customFields = {};
		Object.keys(customFieldsMeta).forEach((key) => {
			customFields[key] = formData[key];
		});
		Users.setCustomFields(userId, customFields);

		// Update customFields of all Direct Messages' Rooms for userId
		await Subscriptions.setCustomFieldsDirectMessagesByUserId(userId, customFields);

		Object.keys(customFields).forEach((fieldName) => {
			if (!customFieldsMeta[fieldName].modifyRecordField) {
				return;
			}

			const { modifyRecordField } = customFieldsMeta[fieldName];
			const update = {};
			if (modifyRecordField.array) {
				update.$addToSet = {};
				update.$addToSet[modifyRecordField.field] = customFields[fieldName];
			} else {
				update.$set = {};
				update.$set[modifyRecordField.field] = customFields[fieldName];
			}

			Users.update(userId, update);
		});
	}
};
