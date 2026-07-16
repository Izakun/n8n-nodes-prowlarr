import {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
	NodeApiError,
	NodeConnectionTypes,
	NodeOperationError,
} from 'n8n-workflow';

export class Prowlarr implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Prowlarr',
		name: 'prowlarr',
		icon: { light: 'file:prowlarr.svg', dark: 'file:prowlarr.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + " : " + $parameter["resource"]}}',
		description: 'Manage your Prowlarr indexers through its v1 API',
		defaults: {
			name: 'Prowlarr',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'prowlarrApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Command', value: 'command' },
					{ name: 'Indexer', value: 'indexer' },
					{ name: 'Search', value: 'search' },
					{ name: 'System', value: 'system' },
				],
				default: 'search',
			},

			// Indexer operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['indexer'] } },
				options: [
					{ name: 'Get', value: 'get', action: 'Get an indexer' },
					{ name: 'Get Many', value: 'getMany', action: 'Get many indexers' },
				],
				default: 'getMany',
			},
			// Search operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['search'] } },
				options: [{ name: 'Search', value: 'search', action: 'Search across indexers' }],
				default: 'search',
			},
			// System operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['system'] } },
				options: [
					{ name: 'Get Health', value: 'getHealth', action: 'Get system health' },
					{ name: 'Get Status', value: 'getStatus', action: 'Get system status' },
				],
				default: 'getStatus',
			},
			// Command operations
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['command'] } },
				options: [{ name: 'Trigger', value: 'trigger', action: 'Trigger a command' }],
				default: 'trigger',
			},

			// ---- Fields ----
			{
				displayName: 'Indexer ID',
				name: 'indexerId',
				type: 'number',
				default: 0,
				required: true,
				description: 'The Prowlarr internal indexer ID',
				displayOptions: { show: { resource: ['indexer'], operation: ['get'] } },
			},
			{
				displayName: 'Query',
				name: 'query',
				type: 'string',
				default: '',
				required: true,
				description: 'The search term to send to the indexers',
				displayOptions: { show: { resource: ['search'], operation: ['search'] } },
			},
			{
				displayName: 'Options',
				name: 'searchOptions',
				type: 'collection',
				placeholder: 'Add option',
				default: {},
				displayOptions: { show: { resource: ['search'], operation: ['search'] } },
				options: [
					{
						displayName: 'Indexer IDs',
						name: 'indexerIds',
						type: 'string',
						default: '',
						placeholder: '1,2,3',
						description: 'Comma-separated indexer IDs to search (empty = all)',
					},
					{
						displayName: 'Categories',
						name: 'categories',
						type: 'string',
						default: '',
						placeholder: '2000,5000',
						description: 'Comma-separated Newznab category IDs',
					},
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						options: [
							{ name: 'Book', value: 'book' },
							{ name: 'Movie', value: 'movie' },
							{ name: 'Music', value: 'music' },
							{ name: 'Search', value: 'search' },
							{ name: 'TV', value: 'tvsearch' },
						],
						default: 'search',
					},
					{
						displayName: 'Limit',
						name: 'limit',
						type: 'number',
						typeOptions: {
							minValue: 1,
						},
						default: 50,
						description: 'Max number of results to return',
					},
				],
			},
			{
				displayName: 'Command Name',
				name: 'commandName',
				type: 'string',
				default: 'ApplicationIndexerSync',
				required: true,
				placeholder: 'ApplicationIndexerSync, IndexerHealthCheck…',
				displayOptions: { show: { resource: ['command'], operation: ['trigger'] } },
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const credentials = await this.getCredentials('prowlarrApi', i);
				const baseURL = (credentials.baseUrl as string).replace(/\/+$/, '');
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				const request = async (
					method: IHttpRequestMethods,
					url: string,
					opts: { qs?: IDataObject; body?: IDataObject } = {},
				) => {
					const options: IHttpRequestOptions = {
						method,
						baseURL,
						url,
						json: true,
						qs: opts.qs,
						body: opts.body,
					};
					return this.helpers.httpRequestWithAuthentication.call(this, 'prowlarrApi', options);
				};

				let response: unknown;

				if (resource === 'system') {
					response = await request(
						'GET',
						operation === 'getHealth' ? '/api/v1/health' : '/api/v1/system/status',
					);
				} else if (resource === 'command') {
					const name = this.getNodeParameter('commandName', i) as string;
					response = await request('POST', '/api/v1/command', { body: { name } });
				} else if (resource === 'indexer') {
					if (operation === 'getMany') {
						response = await request('GET', '/api/v1/indexer');
					} else {
						const indexerId = this.getNodeParameter('indexerId', i) as number;
						response = await request('GET', `/api/v1/indexer/${indexerId}`);
					}
				} else if (resource === 'search') {
					const query = this.getNodeParameter('query', i) as string;
					const options = this.getNodeParameter('searchOptions', i, {}) as IDataObject;
					const qs: IDataObject = { query };
					if (options.type) qs.type = options.type;
					if (options.limit) qs.limit = options.limit;
					if (options.indexerIds) {
						qs.indexerIds = (options.indexerIds as string)
							.split(',')
							.map((s) => Number(s.trim()))
							.filter((n) => !Number.isNaN(n));
					}
					if (options.categories) {
						qs.categories = (options.categories as string)
							.split(',')
							.map((s) => Number(s.trim()))
							.filter((n) => !Number.isNaN(n));
					}
					response = await request('GET', '/api/v1/search', { qs });
				} else {
					throw new NodeOperationError(this.getNode(), `Unknown resource: ${resource}`, {
						itemIndex: i,
					});
				}

				if (Array.isArray(response)) {
					for (const element of response) {
						returnData.push({ json: element as IDataObject, pairedItem: { item: i } });
					}
				} else {
					returnData.push({ json: response as IDataObject, pairedItem: { item: i } });
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
