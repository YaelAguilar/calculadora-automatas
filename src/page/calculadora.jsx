import { useState } from 'react';
import { evaluate } from 'mathjs';

class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function Calculadora() {
    const [input, setInput] = useState('');
    const [lexResult, setLexResult] = useState([]);
    const [operations, setOperations] = useState([]);
    const [operationTree, setOperationTree] = useState('');

    const tokenize = (input) => {
        const tokens = input.match(/\d+|\+|-|\*|\/|\(|\)|\./g);
        return tokens ? tokens.map((token) => {
            if (!isNaN(token)) {
                return { type: 'Número', value: token };
            } else if ('+-*/'.includes(token)) {
                return { type: 'Operador', value: token };
            } else if ('()'.includes(token)) {
                return { type: 'Paréntesis', value: token };
            } else {
                return { type: 'Desconocido', value: token };
            }
        }) : [];
    };

    const handleClick = (e) => {
        setInput(input + e.target.name);
    };

    const calculate = () => {
        const tokens = tokenize(input);
        setLexResult(tokens);

        try {
            const result = evaluate(input).toString();
            setInput(result);
            setOperations([...operations, `${input} = ${result}`]);
            const treeRoot = buildTree(tokens);
            const treeRepresentation = printTree(treeRoot);
            setOperationTree(treeRepresentation);
        } catch (error) {
            setInput('Error');
            setOperationTree('');
        }
    };

    const clear = () => {
        setInput('');
        setLexResult([]);
        setOperations([]);
        setOperationTree('');
    };

    function buildTree(tokens) {
      let root = new TreeNode(tokens[0] ? tokens[0].value : '');
      let current = root;
      tokens.slice(1).forEach(token => {
        if (token.type === 'Operador') {
          let node = new TreeNode(token.value);
          node.left = current;
          current = node;
        } else if (token.type === 'Número') {
          current.right = new TreeNode(token.value);
        }
      });
      return current;
    }

    function printTree(node, prefix = '', isLeft = true) {
      if (node == null) {
        return '';
      }

      let result = printTree(node.right, prefix + (isLeft ? "        " : " |      "), false);
      result += prefix + (isLeft ? ' /--- ' : ' \\--- ') + node.value + '\n';
      result += printTree(node.left, prefix + (isLeft ? " |      " : "        "), true);
      return result;
    }

    return (
        <div className="min-h-screen bg-gray-800 flex items-center justify-center text-white">
            <div className="flex flex-row justify-between items-start w-full max-w-4xl">
                <div className="flex-1 p-8 bg-gray-700 shadow-xl rounded-2xl">
                    <input
                        className="mb-4 p-2 text-xl font-semibold rounded bg-gray-600 border border-gray-500 focus:outline-none focus:border-blue-500"
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <div className="grid grid-cols-4 gap-4 mb-4">
                        {'1234567890.'.split('').map((digit) => (
                            <button
                                key={digit}
                                name={digit}
                                onClick={handleClick}
                                className="bg-gray-600 text-gray-200 font-bold rounded shadow hover:bg-gray-500 p-4 focus:outline-none"
                            >
                                {digit}
                            </button>
                        ))}
                        {['+', '-', '*', '/'].map((operator) => (
                            <button
                                key={operator}
                                name={operator}
                                onClick={handleClick}
                                className="bg-blue-600 text-gray-200 font-bold rounded shadow hover:bg-blue-500 p-4 focus:outline-none"
                            >
                                {operator}
                            </button>
                        ))}
                        <button onClick={clear} className="col-span-2 bg-red-600 text-gray-200 font-bold rounded shadow hover:bg-red-500 p-4 focus:outline-none">Clear</button>
                        <button onClick={calculate} className="col-span-2 bg-green-600 text-gray-200 font-bold rounded shadow hover:bg-green-500 p-4 focus:outline-none">=</button>
                    </div>
                    <div className="mt-4">
                        <h2 className="font-bold text-lg mb-2">Analizador léxico</h2>
                        <div className="overflow-y-auto h-56 bg-gray-600 rounded p-2">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Token</th>
                                        <th>Tipo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lexResult.map((token, index) => (
                                        <tr key={index}>
                                            <td>{token.value}</td>
                                            <td>{token.type}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="flex-1 p-8">
                    <div className="bg-gray-700 shadow-xl rounded-2xl p-4 h-auto overflow-y-auto">
                        <h2 className="font-bold text-lg mb-2">Lista de operaciones realizadas</h2>
                        <div>
                            {operations.map((operation, index) => (
                                <p key={index} className="text-sm">{index + 1}. {operation}</p>
                            ))}
                        </div>
                    </div>
                    <div className="bg-gray-700 shadow-xl rounded-2xl p-4 mt-4 h-auto overflow-y-auto">
                        <h2 className="font-bold text-lg mb-2">Árbol de derivación</h2>
                        <pre className="whitespace-pre-wrap">{operationTree}</pre>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Calculadora;
