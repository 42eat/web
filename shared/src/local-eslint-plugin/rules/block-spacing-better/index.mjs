/** @type {import("eslint").Rule.RuleModule} */
export const blockSpacingBetterRule = {
	meta: {
		type: "layout",
		fixable: "whitespace",
		messages: {
			emptyBlock: "Empty block must not have spaces.",
			nonEmptyBlock: "Non-empty single-line block must have spaces.",
		},
	},
	create(context) {
		return {
			BlockStatement(node) {
				const sourceCode = context.sourceCode;

				if (node.loc.start.line !== node.loc.end.line) return;

				const openBrace = sourceCode.getFirstToken(node);
				const closeBrace = sourceCode.getLastToken(node);

				if (!openBrace || !closeBrace) return;

				const isEmpty = node.body.length === 0;
				const textBetween = sourceCode.text.slice(openBrace.range[1], closeBrace.range[0]);

				if (isEmpty) {
					if (textBetween !== "") {
						context.report({
							node,
							messageId: "emptyBlock",
							fix: (fixer) => fixer.replaceTextRange(
								[openBrace.range[1], closeBrace.range[0]],
								"",
							),
						});
					}
				} else {
					const hasLeadingSpace = textBetween.startsWith(" ");
					const hasTrailingSpace = textBetween.endsWith(" ");

					if (!hasLeadingSpace || !hasTrailingSpace) {
						context.report({
							node,
							messageId: "nonEmptyBlock",
							fix: (fixer) => {
								const inner = textBetween.trim();
								return fixer.replaceTextRange(
									[openBrace.range[1], closeBrace.range[0]],
									` ${inner} `,
								);
							},
						});
					}
				}
			},
		};
	},
};
