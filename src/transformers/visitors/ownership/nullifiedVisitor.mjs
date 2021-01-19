/* eslint-disable no-param-reassign, no-shadow, no-unused-vars */

import cloneDeep from 'lodash.clonedeep';
import logger from '../../../utils/logger.mjs';
import { traverse, traverseNodesFast } from '../../../traverse/traverse.mjs';

export default {
  SourceUnit: {
    enter(path, state) {},

    exit(path, state) {},
  },

  PragmaDirective: {
    // TODO: We should probably check that the `.zsol` Pragma is 'supported'. The output Solidity's pragma will be limited to the latest-supported boilerplate code.
    // However, for now, we'll just inherit the Pragma of the original and hope.
    enter(path, state) {},
    exit(path, state) {},
  },

  ContractDefinition: {
    enter(path, state) {},

    exit(path, state) {},
  },

  FunctionDefinition: {
    enter(path, state) {},

    exit(path, state) {
      const { scope } = path;
      scope.isNullifiable();
    },
  },

  ParameterList: {
    enter(path) {},

    exit(path) {},
  },

  Block: {
    enter(path) {},

    exit(path) {},
  },

  VariableDeclarationStatement: {
    enter(path, state) {},

    exit(path) {},
  },

  BinaryOperation: {
    enter(path) {},

    exit(path) {},
  },

  Assignment: {
    enter(path, state) {},

    exit(path, state) {},
  },

  ExpressionStatement: {
    enter(path, state) {},

    exit(path, state) {
      const { node, scope } = path;
      // Here we look at each statement and decide whether it's a nullification
      if (node.expression.nodeType === 'FunctionCall') return;
      let referencedBinding;
      // we get the relevant bindings of the lhs and initialise binding.nullifyingPaths (if doesnt exist)
      switch (node.expression.leftHandSide.nodeType) {
        case 'Identifier':
          referencedBinding = scope.getReferencedBinding(node.expression.leftHandSide);
          if (!referencedBinding.nullifyingPaths) referencedBinding.nullifyingPaths = [];
          break;
        case 'IndexAccess':
          referencedBinding = scope.getReferencedBinding(
            node.expression.leftHandSide.baseExpression,
          ).mappingKey[scope.getMappingKeyIndicator(node.expression.leftHandSide)];
          if (!referencedBinding.nullifyingPaths) referencedBinding.nullifyingPaths = [];
          break;
        default:
          referencedBinding = {};
          break;
      }
      // then look at the node.expression to see if its incremented and/or the lhs to see if the state is whole
      // whole or decrement: we have a nullification
      switch (node.expression.isIncremented) {
        case true:
          if (node.expression.isDecremented) {
            node.expression.isNullification = true;
            referencedBinding.nullifyingPaths.push(path);
            break;
          } else if (node.expression.leftHandSide.isKnown || node.expression.leftHandSide.isWhole) {
            node.expression.isNullification = true;
            referencedBinding.nullifyingPaths.push(path);
            break;
          } else {
            node.expression.isNullification = false;
            break;
          }
        case false:
          node.expression.isNullification = true;
          referencedBinding.nullifyingPaths.push(path);
          break;
        default:
          // everything should be marked as isIncremented: true/false
          throw new Error(`Expression id ${node.expression.id} not marked as incremented.`);
      }
    },
  },

  VariableDeclaration: {
    enter(path, state) {},

    exit(path) {},
  },

  ElementaryTypeName: {
    enter(path) {},

    exit(path) {},
  },

  Identifier: {
    enter(path) {},

    exit(path) {},
  },

  Literal: {
    enter(path) {},

    exit(path) {},
  },
};