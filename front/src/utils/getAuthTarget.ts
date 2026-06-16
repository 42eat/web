import { Location } from "@solidjs/router";

export function getAuthTarget(location: Location<unknown>) {
	return encodeURIComponent(location.pathname);
}
