import { b } from 'code-red';
import Renderer from '../Renderer';
import Block from '../Block';
import Tag from './shared/Tag';
import Wrapper from './shared/Wrapper';
import MustacheTag from '../../nodes/MustacheTag';
import RawMustacheTag from '../../nodes/RawMustacheTag';
import { Identifier } from 'estree';

export default class RawMustacheTagWrapper extends Tag {
	var: Identifier = { type: 'Identifier', name: 'append' };

	constructor(
		renderer: Renderer,
		block: Block,
		parent: Wrapper,
		node: MustacheTag | RawMustacheTag
	) {
		super(renderer, block, parent, node);
		this.cannot_use_innerhtml();
		this.not_static_content();
	}

	render(block: Block, parent_node: Identifier, parent_nodes: Identifier) {

		const id =  this.node.expression.manipulate(block);

		if (parent_node) {
			block.chunks.mount.push(b`@append(${parent_node}, ${id});`);
			block.chunks.destroy.push(b`@detach(${id});`);
		} else {
			block.chunks.mount.push(b`@insert(#target, ${id}, #anchor);`);
			block.chunks.destroy.push(b`if (detaching) @detach(${id});`);
		}

	}
}
