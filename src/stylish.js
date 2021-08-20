import _ from 'lodash';

const makeIndent = (depth, symbol = ' ') => `${'    '.repeat(depth)}  ${symbol} `;

const drawNode = (value, depth) => {
  if (_.isObject(value)) {
    const keys = Object.keys(value);

    const node = keys.map((key) => `${makeIndent(depth + 1)}${key}: ${drawNode(value[key], depth + 1)}`).join('\n');

    return `{\n${node}\n${makeIndent(depth)}}`;
  }

  return value;
};

const drawTree = (ast, depth = 0) => {
  const tree = ast.map((node) => {
    const { key, value } = node;

    if (node.status === 'added') {
      return `${makeIndent(depth, '+')}${key}: ${drawNode(value, depth)}`;
    }

    if (node.status === 'removed') {
      return `${makeIndent(depth, '-')}${key}: ${drawNode(value, depth)}`;
    }

    if (node.status === 'changed') {
      return `${makeIndent(depth, '-')}${key}: ${drawNode(value[0], depth)}
${makeIndent(depth, '+')}${key}: ${drawNode(value[1], depth)}`;
    }

    if (node.status === 'unchanged') {
      return `${makeIndent(depth)}${key}: ${drawNode(value, depth)}`;
    }

    return `${makeIndent(depth)}${key}: {\n${drawTree(value,
      depth + 1)}\n${makeIndent(depth)}}`;
  });

  return tree.join('\n');
};


export default (ast, format) => {
  if (format === 'stylish') {
    return `{\n${drawTree(ast)}\n}`;
  }

  return `format ${format} not found!`;
}