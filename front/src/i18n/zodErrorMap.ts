import { z } from "zod";
import { Translator } from "./context";

export function setupZodErrorMap(t: Translator) {
	z.setErrorMap((iss, _context) => {
		let result = "";
		switch (iss.code) {
			case "invalid_type":
				if (iss.received === "undefined" || iss.received === "null") result = t("errors.input.text.text.valueMissing");
				break;

			case "invalid_string":
				if (iss.validation === "email") result = t("errors.input.text.email.typeMismatch");
				break;

			case "too_small":
				result = t("errors.input.text.tooShort", { min: String(iss.minimum) });
		}
		return { message: result ?? undefined };
	});
}
