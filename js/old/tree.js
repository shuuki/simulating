
class Node {
	constructor(value) {
		this.id = value;
		this.parent = null;
		this.children = [];
	}
	setParent(node) {
		this.parent = node;
	}
	getParent() {
		return this.parent;
	}
	addChild(node) {
		node.setParent(this);
		this.children[this.children.length] = node;
		return this.children[this.children.length-1];
	}
	getChildren() {
		return this.children;
	}
	removeChildren() {
		this.children = [];
	}
}

export {Node}
