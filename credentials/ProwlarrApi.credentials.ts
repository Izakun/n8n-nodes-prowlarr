import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ProwlarrApi implements ICredentialType {
	name = 'prowlarrApi';

	displayName = 'Prowlarr API';

	icon = 'file:prowlarrApi.svg' as const;

	documentationUrl = 'https://prowlarr.com/docs/api/';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'http://prowlarr:9696',
			required: true,
			description:
				'Base URL of the Prowlarr instance (e.g. http://prowlarr:9696). No trailing slash.',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Prowlarr API key (Settings → General → Security → API Key)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-Api-Key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/api/v1/system/status',
		},
	};
}
