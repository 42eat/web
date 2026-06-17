export type FtOauthCallbackError = {
	type: "ft-oauth-error";
};

export type FtOauthCallbackCancel = {
	type: "ft-oauth-cancel";
};

export type MessageEventData = FtOauthCallbackCancel | FtOauthCallbackError;
