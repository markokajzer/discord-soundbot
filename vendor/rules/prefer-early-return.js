// Taken from eslint-plugin-shopify
// https://github.com/Shopify/eslint-plugin-shopify/blob/c5e0f7919d28fe69e0b56d82fc00d6d96b513783/lib/rules/prefer-early-return.js

const docsUrl =
  'https://github.com/Shopify/eslint-plugin-shopify/blob/c5e0f7919d28fe69e0b56d82fc00d6d96b513783/docs/rules/prefer-early-return.md';

const MAXIMUM_STATEMENTS = 1;

module.exports = {
  meta: {
    docs: {
      description:
        'Prefer early returns over full-body conditional wrapping in function declarations.',
      category: 'Best Practices',
      recommended: false,
      uri: docsUrl
    },
    schema: []
  },

  create(context) {
    function isLonelyIfStatement(statement) {
      return statement.type === 'IfStatement' && statement.alternate == null;
    }

    function isOffendingConsequent(consequent) {
      return consequent.type === 'BlockStatement' && consequent.body.length > MAXIMUM_STATEMENTS;
    }

    function isOffendingIfStatement(statement) {
      return isLonelyIfStatement(statement) && isOffendingConsequent(statement.consequent);
    }

    function hasSimplifiableConditionalBody(functionBody) {
      const { body } = functionBody;

      return (
        functionBody.type === 'BlockStatement' &&
        body.length === 1 &&
        isOffendingIfStatement(body[0])
      );
    }

    function checkFunctionBody(functionNode) {
      const { body } = functionNode;

      if (hasSimplifiableConditionalBody(body)) {
        context.report(body, 'Prefer an early return to a conditionally-wrapped function body');
      }
    }

    return {
      FunctionDeclaration: checkFunctionBody,
      FunctionExpression: checkFunctionBody,
      ArrowFunctionExpression: checkFunctionBody
    };
  }
};
