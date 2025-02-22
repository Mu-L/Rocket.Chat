import type { IOmnichannelCannedResponse } from '@rocket.chat/core-typings';
import type { ICannedResponseModel } from '@rocket.chat/model-typings';
import type { Db, DeleteResult, FindCursor, FindOptions, IndexDescription } from 'mongodb';

import { BaseRaw } from '../../../../server/models/raw/BaseRaw';

// TODO need to define type for CannedResponse object
export class CannedResponseRaw extends BaseRaw<IOmnichannelCannedResponse> implements ICannedResponseModel {
	constructor(db: Db) {
		super(db, 'canned_response');
	}

	protected modelIndexes(): IndexDescription[] {
		return [
			{
				key: {
					shortcut: 1,
				},
				unique: true,
			},
		];
	}

	async createOrUpdateCannedResponse(
		_id: string,
		{ shortcut, text, tags, scope, userId, departmentId, createdBy, _createdAt }: IOmnichannelCannedResponse,
	): Promise<Omit<IOmnichannelCannedResponse, '_updatedAt'>> {
		const record = {
			shortcut,
			text,
			scope,
			tags,
			userId,
			departmentId,
			createdBy,
			_createdAt,
		};

		if (_id) {
			await this.updateOne({ _id }, { $set: record });
		} else {
			_id = (await this.insertOne(record)).insertedId;
		}

		return Object.assign(record, { _id });
	}

	findOneById(_id: string, options?: FindOptions<IOmnichannelCannedResponse>): Promise<IOmnichannelCannedResponse | null> {
		const query = { _id };

		return this.findOne(query, options);
	}

	findOneByShortcut(shortcut: string, options?: FindOptions<IOmnichannelCannedResponse>): Promise<IOmnichannelCannedResponse | null> {
		const query = {
			shortcut,
		};

		return this.findOne(query, options);
	}

	findByCannedResponseId(_id: string, options?: FindOptions<IOmnichannelCannedResponse>): FindCursor<IOmnichannelCannedResponse> {
		const query = { _id };

		return this.find(query, options);
	}

	findByDepartmentId(departmentId: string, options?: FindOptions<IOmnichannelCannedResponse>): FindCursor<IOmnichannelCannedResponse> {
		const query = {
			scope: 'department',
			departmentId,
		};

		return this.find(query, options);
	}

	findByShortcut(shortcut: string, options?: FindOptions<IOmnichannelCannedResponse>): FindCursor<IOmnichannelCannedResponse> {
		const query = { shortcut };

		return this.find(query, options);
	}

	// REMOVE
	removeById(_id: string): Promise<DeleteResult> {
		const query = { _id };

		return this.deleteOne(query);
	}
}
