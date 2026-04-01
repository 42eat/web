/** @type {import("eslint").Rule.RuleModule} */
export const objectNewlineKeyValue = {
	meta: {
		type: "layout",
		fixable: "whitespace",
		messages: {
			noNewline: "Property value must be on the same line as its key.",
		},
	},
	create(context) {
		return {
			Property(node) {
				if (node.key.loc.end.line < node.value.loc.start.line) {
					context.report({
						node,
						messageId: "noNewline",
						fix(fixer) {
							const sourceCode = context.sourceCode;
							const keyToken = sourceCode.getLastToken(node.key);
							const valueToken = sourceCode.getFirstToken(node.value);

							const start = keyToken?.range[1];
							const end = valueToken?.range[0];

							return fixer.replaceTextRange([start, end], ": ");
						}
					});
				}
			},
		};
	},
};
