import { z } from "zod";
import { useTranslation } from "./context";

type Translator = ReturnType<typeof useTranslation>["t"];

export function setupZodErrorMap(t: Translator) {
	z.setErrorMap((iss, _context) => {
		let result = "";
		switch (iss.code) {
			case "invalid_type":
				if (iss.received === "undefined" || iss.received === "null") result = t("validation.required");
				break;

			case "invalid_string":
				if (iss.validation === "email") result = t("validation.email.invalid");
				break;

			case "too_small":
				result = t("validation.string.tooShort", { min: String(iss.minimum) });
		}
		return { message: result ?? undefined };
	});
}
